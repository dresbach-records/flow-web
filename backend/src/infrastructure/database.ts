import { firebaseAdmin, firestore } from './firebase/firebase-admin.js';

export async function connectDatabases() {
  firebaseAdmin();
  await firestore().listCollections();
}

export async function disconnectDatabases() {
  // Firebase Admin manages its connection lifecycle.
}
