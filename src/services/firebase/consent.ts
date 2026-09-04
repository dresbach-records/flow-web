import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { requireFirestore } from './config';
import { logout } from './auth';

export const CURRENT_CONSENT_VERSION = '1.0.0';
export const CURRENT_DOCUMENT_VERSION = 'v1.0.0-2026';

export interface UserConsentRecord {
  userId: string;
  consentType: 'terms_and_privacy';
  documentVersion: string;
  consentVersion: string;
  acceptedAt?: unknown;
  declinedAt?: unknown;
  status: 'accepted' | 'declined';
  termsAccepted: boolean;
  privacyAccepted: boolean;
  userAgent?: string;
}

export async function checkUserConsent(userId: string): Promise<{ hasAccepted: boolean; record?: UserConsentRecord | null }> {
  try {
    const firestore = requireFirestore();
    const userSnap = await getDoc(doc(firestore, 'users', userId));
    if (userSnap.exists()) {
      const data = userSnap.data();
      const termsAccepted = Boolean(data.termsAccepted ?? data.acceptedTermsAt);
      const privacyAccepted = Boolean(data.privacyAccepted ?? data.acceptedTermsAt);
      const consentVersion = String(data.consentVersion || '');
      if (termsAccepted && privacyAccepted && consentVersion === CURRENT_CONSENT_VERSION) {
        return { hasAccepted: true };
      }
    }

    const consentSnap = await getDoc(doc(firestore, 'consents', userId));
    if (consentSnap.exists()) {
      const consentData = consentSnap.data() as UserConsentRecord;
      if (
        consentData.status === 'accepted' &&
        consentData.termsAccepted &&
        consentData.privacyAccepted &&
        consentData.consentVersion === CURRENT_CONSENT_VERSION
      ) {
        return { hasAccepted: true, record: consentData };
      }
    }

    return { hasAccepted: false };
  } catch (error) {
    console.warn('[FLOW] Falha ao verificar consentimento no Firestore.', error);
    const cached = typeof localStorage !== 'undefined'
      ? localStorage.getItem(`flow.consent.${userId}`)
      : null;
    return { hasAccepted: cached === CURRENT_CONSENT_VERSION };
  }
}

export async function recordUserConsent(userId: string, accepted: boolean): Promise<void> {
  const firestore = requireFirestore();

  if (!userId) {
    throw new Error('Usuário não autenticado para registrar consentimento.');
  }

  if (accepted) {
    const payload: UserConsentRecord = {
      userId,
      consentType: 'terms_and_privacy',
      documentVersion: CURRENT_DOCUMENT_VERSION,
      consentVersion: CURRENT_CONSENT_VERSION,
      acceptedAt: serverTimestamp(),
      status: 'accepted',
      termsAccepted: true,
      privacyAccepted: true,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };

    // A gravação é idempotente: funciona tanto para primeiro aceite quanto para atualização.
    await setDoc(doc(firestore, 'consents', userId), payload, { merge: true });

    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    const consentFields = {
      termsAccepted: true,
      privacyAccepted: true,
      consentVersion: CURRENT_CONSENT_VERSION,
      consentDocumentVersion: CURRENT_DOCUMENT_VERSION,
      consentAcceptedAt: serverTimestamp(),
      consentUserId: userId,
    };

    if (userSnap.exists()) {
      // Preserva todos os dados existentes e, principalmente, não altera role/accountType.
      await updateDoc(userRef, consentFields);
    } else {
      // Cadastro ainda sem perfil Firestore: cria o mínimo exigido pelas regras.
      await setDoc(userRef, {
        role: 'user',
        ...consentFields,
      }, { merge: true });
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`flow.consent.${userId}`, CURRENT_CONSENT_VERSION);
    }
    return;
  }

  // Recusa: registra o evento quando possível e sempre encerra a sessão.
  try {
    await setDoc(doc(firestore, 'consents', userId), {
      userId,
      consentType: 'terms_and_privacy',
      documentVersion: CURRENT_DOCUMENT_VERSION,
      consentVersion: CURRENT_CONSENT_VERSION,
      declinedAt: serverTimestamp(),
      status: 'declined',
      termsAccepted: false,
      privacyAccepted: false,
    }, { merge: true });
  } finally {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`flow.consent.${userId}`);
    }
    await logout();
  }
}
