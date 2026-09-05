import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';
import { pushNotification, type NotificationType } from './notifications';
import { apiRequest } from '../api/client';
import { uploadMedia, type UploadResult } from './storage';

export type PostInput = { text?: string; type: 'text' | 'image' | 'video'; media?: UploadResult | null };
export type CommentRecord = { id: string; authorId: string; text: string; createdAt?: unknown; parentId?: string | null };

/** Puro e testável: extrai hashtags únicas (#tag) de um texto. */
export function extractHashtags(text: string): string[] {
  const found = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  return [...new Set(found.map((t) => (t.startsWith('#') ? t : `#${t}`)))];
}

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
}

/**
 * Fan-out de notificação: tenta o backend (`POST /api/v1/notify`, que persiste
 * in-app + dispara Web Push); sem backend, grava direto no Firestore.
 * Nunca quebra a operação principal.
 */
async function fanOut(
  targetUid: string,
  data: { type: NotificationType; actorName: string; actorAvatar: string; text: string },
): Promise<void> {
  if (!targetUid) return;
  try {
    await apiRequest({ path: '/api/v1/notify', method: 'POST', body: { targetUid, ...data } });
  } catch {
    await pushNotification(targetUid, data).catch(() => undefined);
  }
}

export async function createPost(input: PostInput): Promise<string> {
  const db = requireFirestore();
  const uid = requireUid();
  const text = input.text?.trim() ?? '';
  if (!text && !input.media) throw new Error('Escreva algo ou selecione uma mídia.');
  const postRef = doc(collection(db, 'posts'));
  await setDoc(postRef, {
    authorId: uid,
    text,
    type: input.type,
    mediaUrl: input.media?.url ?? null,
    mediaPath: input.media?.path ?? null,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: serverTimestamp(),
  });
  return postRef.id;
}

export async function toggleLike(postId: string, liked: boolean): Promise<void> {
  const db = requireFirestore();
  const auth = requireFirebaseAuth();
  const uid = requireUid();
  const likeRef = doc(db, 'posts', postId, 'likes', uid);
  const postRef = doc(db, 'posts', postId);
  await runTransaction(db, async transaction => {
    const like = await transaction.get(likeRef);
    if (liked) {
      if (like.exists()) transaction.delete(likeRef);
      transaction.update(postRef, { likesCount: increment(-1) });
    } else if (!like.exists()) {
      transaction.set(likeRef, { userId: uid, createdAt: serverTimestamp() });
      transaction.update(postRef, { likesCount: increment(1) });
    }
  });
  // Fan-out real: notifica o autor (nunca quebra o like em caso de falha).
  if (!liked) {
    void (async () => {
      try {
        const post = await getDoc(postRef);
        const authorId = post.data()?.authorId;
        if (typeof authorId === 'string' && authorId && authorId !== uid) {
          await fanOut(authorId, {
            type: 'like',
            actorName: auth.currentUser?.displayName || 'Alguém',
            actorAvatar: auth.currentUser?.photoURL || '/logo.png',
            text: 'curtiu sua publicação.',
          });
        }
      } catch {
        /* fan-out best-effort */
      }
    })();
  }
}

export async function hasLiked(postId: string): Promise<boolean> {
  const db = requireFirestore();
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  return uid ? (await getDoc(doc(db, 'posts', postId, 'likes', uid))).exists() : false;
}

export async function addComment(postId: string, text: string, parentId?: string): Promise<string> {
  const db = requireFirestore();
  const auth = requireFirebaseAuth();
  const uid = requireUid();
  const value = text.trim();
  if (!value) throw new Error('Escreva um comentário.');
  if (value.length > 500) throw new Error('Limite de 500 caracteres.');
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  await setDoc(commentRef, {
    authorId: uid,
    text: value,
    parentId: parentId ?? null,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(1) });
  // Fan-out real: notifica o autor do post (best-effort, nunca quebra o envio).
  void (async () => {
    try {
      const post = await getDoc(doc(db, 'posts', postId));
      const authorId = post.data()?.authorId;
      if (typeof authorId === 'string' && authorId && authorId !== uid) {
        await fanOut(authorId, {
          type: 'comment',
          actorName: auth.currentUser?.displayName || 'Alguém',
          actorAvatar: auth.currentUser?.photoURL || '/logo.png',
          text: parentId ? 'respondeu um comentário na sua publicação.' : 'comentou na sua publicação.',
        });
      }
    } catch {
      /* fan-out best-effort */
    }
  })();
  return commentRef.id;
}

/** Remove comentário próprio (regra: só o autor). */
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
  await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(-1) }).catch(() => undefined);
}

/** Edita texto da própria publicação (regra: autor mantém authorId). */
export async function updatePost(postId: string, text: string): Promise<void> {
  const value = text.trim();
  if (!value) throw new Error('A publicação não pode ficar vazia.');
  if (value.length > 2000) throw new Error('Limite de 2000 caracteres.');
  const db = requireFirestore();
  await updateDoc(doc(db, 'posts', postId), { text: value, caption: value });
}

export async function listComments(postId: string): Promise<CommentRecord[]> {
  const db = requireFirestore();
  const snapshot = await getDocs(query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(100)));
  return snapshot.docs.map(item => ({ id: item.id, ...(item.data() as Omit<CommentRecord, 'id'>) }));
}

export async function toggleFollow(targetUid: string, following: boolean): Promise<void> {
  const db = requireFirestore();
  const auth = requireFirebaseAuth();
  const uid = requireUid();
  if (uid === targetUid) throw new Error('Você não pode seguir a si mesmo.');
  const ref = doc(db, 'users', uid, 'following', targetUid);
  const reverse = doc(db, 'users', targetUid, 'followers', uid);
  if (following) {
    await Promise.all([deleteDoc(ref), deleteDoc(reverse)]);
  } else {
    await Promise.all([
      setDoc(ref, { userId: targetUid, createdAt: serverTimestamp() }),
      setDoc(reverse, { userId: uid, createdAt: serverTimestamp() }),
    ]);
    // Fan-out real: notifica o seguido (best-effort).
    void fanOut(targetUid, {
      type: 'follow',
      actorName: auth.currentUser?.displayName || 'Alguém',
      actorAvatar: auth.currentUser?.photoURL || '/logo.png',
      text: 'começou a seguir você.',
    });
  }
}

export async function toggleSaved(postId: string, saved: boolean): Promise<void> {
  const db = requireFirestore();
  const uid = requireUid();
  const ref = doc(db, 'users', uid, 'saved', postId);
  if (saved) await deleteDoc(ref);
  else await setDoc(ref, { postId, createdAt: serverTimestamp() });
}

export interface SavedPostRef {
  id: string;
  postId: string;
}

/** IDs de posts salvos pelo usuário logado (persistência real, sem mock). */
export async function listSavedPostIds(): Promise<SavedPostRef[]> {
  const db = requireFirestore();
  const uid = requireUid();
  const snapshot = await getDocs(
    query(collection(db, 'users', uid, 'saved'), orderBy('createdAt', 'desc'), limit(50)),
  );
  return snapshot.docs.map((d) => {
    const data = d.data() as { postId?: unknown };
    return { id: d.id, postId: typeof data.postId === 'string' ? data.postId : d.id };
  });
}

export async function uploadPostMedia(file: File, onProgress?: (percent: number) => void): Promise<UploadResult> {
  const uid = requireUid();
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const maxBytes = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  if ((!isImage && !isVideo) || file.size > maxBytes) throw new Error(isImage ? 'A imagem deve ter no máximo 10 MB.' : 'O vídeo deve ter no máximo 100 MB.');
  return uploadMedia(`users/${uid}/posts`, file, onProgress);
}
