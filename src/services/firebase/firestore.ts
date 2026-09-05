import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as limitFn,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter as startAfterFn,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { requireFirestore } from './config';

export type WithId<T> = T & { id: string };

/** Create a document in a collection and return its id. */
export async function createDocument<T extends Record<string, unknown>>(path: string, data: T): Promise<string> {
  const db = requireFirestore();
  const ref = await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

/** Create or overwrite a document with a known id. */
export async function upsertDocument<T extends Record<string, unknown>>(path: string, id: string, data: T): Promise<void> {
  const db = requireFirestore();
  await setDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateDocument(path: string, id: string, data: Record<string, unknown>): Promise<void> {
  const db = requireFirestore();
  await updateDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(path: string, id: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, path, id));
}

export async function getDocument<T>(path: string, id: string): Promise<WithId<T> | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, path, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as T) }) : null;
}

export type ListOptions = {
  field?: string;
  value?: unknown;
  orderByField?: string;
  direction?: 'asc' | 'desc';
  max?: number;
  /** Cursor de paginação: snapshot do último doc ou valor do campo ordenado. */
  cursor?: unknown;
};

/** List documents from a collection with optional filtering and ordering. */
export async function listDocuments<T>(path: string, options: ListOptions = {}): Promise<WithId<T>[]> {
  const db = requireFirestore();
  const constraints: QueryConstraint[] = [];
  if (options.field && options.value !== undefined) constraints.push(where(options.field, '==', options.value));
  if (options.orderByField) constraints.push(orderBy(options.orderByField, options.direction ?? 'desc'));
  if (options.cursor !== undefined) constraints.push(startAfterFn(options.cursor as DocumentData));
  if (options.max) constraints.push(limitFn(options.max));
  const snapshot = await getDocs(query(collection(db, path), ...constraints));
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

/** Último snapshot de uma lista (para paginar com `cursor`). */
export async function listDocumentsPage<T>(
  path: string,
  options: ListOptions = {},
): Promise<{ items: WithId<T>[]; cursor: unknown }> {
  const db = requireFirestore();
  const constraints: QueryConstraint[] = [];
  if (options.field && options.value !== undefined) constraints.push(where(options.field, '==', options.value));
  if (options.orderByField) constraints.push(orderBy(options.orderByField, options.direction ?? 'desc'));
  if (options.cursor !== undefined) constraints.push(startAfterFn(options.cursor as DocumentData));
  if (options.max) constraints.push(limitFn(options.max));
  const snapshot = await getDocs(query(collection(db, path), ...constraints));
  const docs = snapshot.docs;
  return {
    items: docs.map((d) => ({ id: d.id, ...(d.data() as T) })),
    cursor: docs.length > 0 ? docs[docs.length - 1] : undefined,
  };
}
