import { firebaseAuth, firestore } from '../infrastructure/database.js';

export async function register(input: { email: string; password: string; username: string; displayName: string; cpf?: string }) {
  const user = await firebaseAuth().createUser({
    email: input.email,
    password: input.password,
    displayName: input.displayName,
  });

  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: input.email,
    username: input.username,
    displayName: input.displayName,
    cpf: input.cpf ?? null,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: user.uid, email: user.email, username: input.username, displayName: input.displayName };
}

export async function login(_email: string, _password: string) {
  throw new Error('USE_FIREBASE_CLIENT_AUTH');
}
