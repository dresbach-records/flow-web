import { getFirestore, type CollectionReference, type DocumentData } from 'firebase-admin/firestore';
import { firebaseAdmin } from './firebase-admin';

firebaseAdmin();

export class FirestoreRepository<T extends DocumentData> {
  private readonly db = getFirestore();
  constructor(private readonly collectionName: string) {}
  private collection(): CollectionReference<T> { return this.db.collection(this.collectionName) as CollectionReference<T>; }
  async get(id:string):Promise<T|undefined>{ const snap=await this.collection().doc(id).get(); return snap.exists ? snap.data() : undefined; }
  async create(id:string,data:T):Promise<void>{ await this.collection().doc(id).create(data); }
  async set(id:string,data:Partial<T>):Promise<void>{ await this.collection().doc(id).set(data as T,{merge:true}); }
  async delete(id:string):Promise<void>{ await this.collection().doc(id).delete(); }
}
