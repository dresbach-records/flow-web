import { firebaseAuth, firestore, firebaseStorage } from './firebase/firebase-admin.js';

export { firebaseAuth, firestore, firebaseStorage };

export async function connectDatabases() {
  await firestore().collection('_health').limit(1).get();
}

export async function disconnectDatabases() {
  // Firebase Admin manages its own connections.
}
