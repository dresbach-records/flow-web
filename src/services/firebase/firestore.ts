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
  updateDoc,
  where,
  type QueryConstraint,
} from 'firebase/firestore';
import { firestore } from './config';

export type WithId<T> = T & { id: string };

/** Create a document in a collection and return its id. */
export async function createDocument<T extends Record<string, unknown>>(path: string, data: T): Promise<string> {
  const ref = await addDoc(collection(firestore, path), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

/** Create or overwrite a document with a known id. */
export async function upsertDocument<T extends Record<string, unknown>>(path: string, id: string, data: T): Promise<void> {
  await setDoc(doc(firestore, path, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateDocument(path: string, id: string, data: Record<string, unknown>): Promise<void> {
  await updateDoc(doc(firestore, path, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(path: string, id: string): Promise<void> {
  await deleteDoc(doc(firestore, path, id));
}

export async function getDocument<T>(path: string, id: string): Promise<WithId<T> | null> {
  const snapshot = await getDoc(doc(firestore, path, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as T) }) : null;
}

export type ListOptions = {
  field?: string;
  value?: unknown;
  orderByField?: string;
  direction?: 'asc' | 'desc';
  max?: number;
};

/** List documents from a collection with optional filtering and ordering. */
export async function listDocuments<T>(path: string, options: ListOptions = {}): Promise<WithId<T>[]> {
  const constraints: QueryConstraint[] = [];
  if (options.field && options.value !== undefined) constraints.push(where(options.field, '==', options.value));
  if (options.orderByField) constraints.push(orderBy(options.orderByField, options.direction ?? 'desc'));
  if (options.max) constraints.push(limitFn(options.max));
  const snapshot = await getDocs(query(collection(firestore, path), ...constraints));
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}
