// FLOW — Creator directory service (dados reais, diretório público).
// `creator_profiles/{uid}`: leitura pública (somente o que o criador publicou),
// escrita do próprio dono. Sem e-mail/telefone (privacidade).
import { listDocuments, getDocument, upsertDocument } from './firestore';
import { requireFirebaseAuth, requireFirestore } from './config';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export interface CreatorProfile {
  uid: string;
  displayName: string;
  handle: string;
  bio: string;
  avatar: string;
  createdAt?: unknown;
}

function toProfile(uid: string, data: Record<string, unknown>): CreatorProfile {
  return {
    uid,
    displayName: typeof data.displayName === 'string' && data.displayName ? data.displayName : 'Criador',
    handle: typeof data.handle === 'string' && data.handle ? data.handle : `@criador-${uid.slice(0, 6)}`,
    bio: typeof data.bio === 'string' ? data.bio : '',
    avatar: typeof data.avatar === 'string' && data.avatar ? data.avatar : '/logo.png',
    createdAt: data.createdAt,
  };
}

/** Diretório público de criadores. Vazio honesto sem cadastros. */
export async function listCreators(max = 24): Promise<CreatorProfile[]> {
  const docs = await listDocuments<Record<string, unknown>>('creator_profiles', { max });
  return docs.map((d) => toProfile(d.id, d));
}

/** Perfil público por handle (ex.: @maria). */
export async function getCreatorByHandle(handle: string): Promise<CreatorProfile | null> {
  const clean = handle.trim().replace(/^@/, '').toLowerCase();
  if (!clean) return null;
  const db = requireFirestore();
  const snapshot = await getDocs(
    query(collection(db, 'creator_profiles'), where('handleLower', '==', clean), limit(1)),
  );
  const doc = snapshot.docs[0];
  return doc ? toProfile(doc.id, doc.data() as Record<string, unknown>) : null;
}

/** Perfil público por uid. */
export async function getCreatorByUid(uid: string): Promise<CreatorProfile | null> {
  const doc = await getDocument<Record<string, unknown>>('creator_profiles', uid).catch(() => null);
  return doc ? toProfile(doc.id, doc) : null;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 24);
}

/** Ativa o modo criador do usuário logado (persistência real). */
export async function activateCreatorProfile(input: { displayName: string; bio?: string }): Promise<CreatorProfile> {
  const auth = requireFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Faça login para continuar.');
  const displayName = input.displayName.trim();
  if (displayName.length < 2) throw new Error('Informe um nome de exibição.');
  const existing = await getCreatorByUid(user.uid).catch(() => null);
  const handle = existing?.handle ?? `@${slugify(displayName) || `criador-${user.uid.slice(0, 6)}`}`;
  const data = {
    displayName,
    handle,
    handleLower: handle.replace(/^@/, '').toLowerCase(),
    bio: (input.bio ?? '').slice(0, 280),
    avatar: user.photoURL || existing?.avatar || '/logo.png',
  };
  await upsertDocument('creator_profiles', user.uid, data);
  return { uid: user.uid, ...data };
}
