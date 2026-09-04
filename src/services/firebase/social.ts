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
import { uploadMedia, type UploadResult } from './storage';

export type PostInput = { text?: string; type: 'text' | 'image' | 'video'; media?: UploadResult | null };
export type CommentRecord = { id: string; authorId: string; text: string; createdAt?: unknown };

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
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
}

export async function hasLiked(postId: string): Promise<boolean> {
  const db = requireFirestore();
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  return uid ? (await getDoc(doc(db, 'posts', postId, 'likes', uid))).exists() : false;
}

export async function addComment(postId: string, text: string): Promise<string> {
  const db = requireFirestore();
  const uid = requireUid();
  const value = text.trim();
  if (!value) throw new Error('Escreva um comentário.');
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  await setDoc(commentRef, { authorId: uid, text: value, createdAt: serverTimestamp() });
  await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(1) });
  return commentRef.id;
}

export async function listComments(postId: string): Promise<CommentRecord[]> {
  const db = requireFirestore();
  const snapshot = await getDocs(query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(100)));
  return snapshot.docs.map(item => ({ id: item.id, ...(item.data() as Omit<CommentRecord, 'id'>) }));
}

export async function toggleFollow(targetUid: string, following: boolean): Promise<void> {
  const db = requireFirestore();
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
  }
}

export async function toggleSaved(postId: string, saved: boolean): Promise<void> {
  const db = requireFirestore();
  const uid = requireUid();
  const ref = doc(db, 'users', uid, 'saved', postId);
  if (saved) await deleteDoc(ref);
  else await setDoc(ref, { postId, createdAt: serverTimestamp() });
}

export async function uploadPostMedia(file: File, onProgress?: (percent: number) => void): Promise<UploadResult> {
  const uid = requireUid();
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const maxBytes = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  if ((!isImage && !isVideo) || file.size > maxBytes) throw new Error(isImage ? 'A imagem deve ter no máximo 10 MB.' : 'O vídeo deve ter no máximo 100 MB.');
  return uploadMedia(`users/${uid}/posts`, file, onProgress);
}
