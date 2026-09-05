import { firebaseAuth, firestore } from './infrastructure/firebase/firebase-admin.js';

/**
 * P0 — bootstrap administrativo (operador).
 * Concede `role: 'admin'` no perfil Firestore de um usuário existente.
 *
 * Uso: `npm run seed:admin -- usuario@email.com`
 * Requer `backend/.env` com credenciais do Admin SDK.
 * Sem este passo, o login admin nega tudo (comportamento correto das rules).
 */
const email = process.argv[2]?.trim();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Uso: npm run seed:admin -- usuario@email.com');
  process.exit(1);
}

const user = await firebaseAuth().getUserByEmail(email);
await firestore().collection('users').doc(user.uid).set(
  {
    email: user.email ?? email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    role: 'admin',
    updatedAt: new Date(),
  },
  { merge: true },
);
console.log(`OK: ${email} (${user.uid}) agora é admin.`);
