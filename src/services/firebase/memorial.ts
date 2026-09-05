// FLOW — Memorial service (dados reais, FASE 5).
// Solicitações (`memorial_requests`), homenagens (`tributes`) e legado (campos no
// perfil `users/{uid}`). Sem conteúdo fictício (REGRA DE CONCLUSÃO FLOW).
import { createDocument, deleteDocument, getDocument, listDocuments } from './firestore';
import { requireFirebaseAuth } from './config';

/** Memorial do catálogo (contexto das telas 351-365). Homenagens reais abaixo dele. */
export const DEFAULT_MEMORIAL_ID = 'memorial-carlos-eduardo';

export type MemorialRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MemorialRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  relationship: string;
  deceasedDate: string;
  status: MemorialRequestStatus;
  createdAt?: unknown;
}

export interface Tribute {
  id: string;
  memorialId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  mediaUrl: string | null;
  createdAt?: unknown;
}

export interface LegacySettings {
  memorialize: boolean;
  legacyContact: boolean;
  keepPosts: boolean;
  keepMedia: boolean;
  clearDMs: boolean;
  purgeAfterTime: boolean;
}

export const DEFAULT_LEGACY: LegacySettings = {
  memorialize: true,
  legacyContact: true,
  keepPosts: true,
  keepMedia: true,
  clearDMs: true,
  purgeAfterTime: false,
};

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
}

/** Cria solicitação de memorialização (status PENDING). Retorna o protocolo. */
export async function createMemorialRequest(input: {
  requesterName: string;
  relationship: string;
  deceasedDate: string;
  docUrl?: string | null;
}): Promise<string> {
  const uid = requireUid();
  const name = input.requesterName.trim();
  if (name.length < 3) throw new Error('Informe seu nome completo.');
  if (!input.relationship) throw new Error('Selecione a relação com o usuário.');
  if (!input.deceasedDate.trim()) throw new Error('Informe a data do falecimento.');
  return createDocument('memorial_requests', {
    requesterId: uid,
    requesterName: name,
    relationship: input.relationship,
    deceasedDate: input.deceasedDate.trim(),
    docUrl: input.docUrl ?? null,
    status: 'PENDING',
  });
}

/** Busca solicitação pelo protocolo (dono ou admin, garantido pela regra). */
export async function getMemorialRequest(protocol: string): Promise<MemorialRequest | null> {
  const id = protocol.trim();
  if (!id) return null;
  const doc = await getDocument<Record<string, unknown>>('memorial_requests', id).catch(() => null);
  if (!doc) return null;
  return {
    id: doc.id,
    requesterId: typeof doc.requesterId === 'string' ? doc.requesterId : '',
    requesterName: typeof doc.requesterName === 'string' ? doc.requesterName : '',
    relationship: typeof doc.relationship === 'string' ? doc.relationship : '',
    deceasedDate: typeof doc.deceasedDate === 'string' ? doc.deceasedDate : '',
    status: doc.status === 'APPROVED' ? 'APPROVED' : doc.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
    createdAt: doc.createdAt,
  };
}

/** Solicitações do usuário logado. */
export async function listMyMemorialRequests(): Promise<MemorialRequest[]> {
  const uid = requireUid();
  const docs = await listDocuments<Record<string, unknown>>('memorial_requests', {
    field: 'requesterId',
    value: uid,
    max: 20,
  });
  const out: MemorialRequest[] = [];
  for (const d of docs) {
    const full = await getMemorialRequest(d.id);
    if (full) out.push(full);
  }
  return out;
}

/** Homenagens reais de um memorial (sem mocks). */
export async function listTributes(memorialId: string, max = 50): Promise<Tribute[]> {
  const docs = await listDocuments<Record<string, unknown>>('tributes', {
    field: 'memorialId',
    value: memorialId,
    max,
  });
  return docs.map((d) => ({
    id: d.id,
    memorialId: typeof d.memorialId === 'string' ? d.memorialId : memorialId,
    authorId: typeof d.authorId === 'string' ? d.authorId : '',
    authorName: typeof d.authorName === 'string' && d.authorName ? d.authorName : 'Usuário',
    authorAvatar: typeof d.authorAvatar === 'string' && d.authorAvatar ? d.authorAvatar : '/logo.png',
    text: typeof d.text === 'string' ? d.text : '',
    mediaUrl: typeof d.mediaUrl === 'string' ? d.mediaUrl : null,
    createdAt: d.createdAt,
  }));
}

/** Publica homenagem real (texto 1..500). */
export async function createTribute(input: {
  memorialId: string;
  text: string;
  mediaUrl?: string | null;
}): Promise<string> {
  const auth = requireFirebaseAuth();
  const uid = requireUid();
  const text = input.text.trim();
  if (text.length < 1) throw new Error('Escreva sua homenagem.');
  if (text.length > 500) throw new Error('Limite de 500 caracteres.');
  return createDocument('tributes', {
    memorialId: input.memorialId,
    authorId: uid,
    authorName: auth.currentUser?.displayName || 'Usuário',
    authorAvatar: auth.currentUser?.photoURL || '/logo.png',
    text,
    mediaUrl: input.mediaUrl ?? null,
  });
}

/** Remove homenagem própria. */
export async function deleteTribute(tributeId: string): Promise<void> {
  await deleteDocument('tributes', tributeId);
}

/** Configurações de legado do usuário (campos no próprio perfil). */
export async function loadLegacySettings(): Promise<LegacySettings> {
  const uid = requireUid();
  const doc = await getDocument<Record<string, unknown>>('users', uid).catch(() => null);
  if (!doc) return DEFAULT_LEGACY;
  const pick = (key: keyof LegacySettings): boolean =>
    typeof doc[key] === 'boolean' ? (doc[key] as boolean) : DEFAULT_LEGACY[key];
  return {
    memorialize: pick('memorialize'),
    legacyContact: pick('legacyContact'),
    keepPosts: pick('keepPosts'),
    keepMedia: pick('keepMedia'),
    clearDMs: pick('clearDMs'),
    purgeAfterTime: pick('purgeAfterTime'),
  };
}

/** Salva configurações de legado no perfil (persistência real). */
export async function saveLegacySettings(settings: LegacySettings): Promise<void> {
  const uid = requireUid();
  const { updateDocument } = await import('./firestore');
  await updateDocument('users', uid, { ...settings });
}
