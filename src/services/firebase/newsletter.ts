// FLOW — Newsletter service (persistência real, com consentimento LGPD).
// Escreve em `newsletter` (regras em firestore.rules exigem e-mail + consent).
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { requireFirestore } from './config';

export async function subscribeNewsletter(email: string, consent: boolean): Promise<void> {
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Informe um e-mail válido.');
  if (!consent) throw new Error('É necessário aceitar o uso do e-mail para a newsletter.');
  await addDoc(collection(requireFirestore(), 'newsletter'), {
    email: value,
    consent: true,
    source: 'site-footer',
    createdAt: serverTimestamp(),
  });
}
