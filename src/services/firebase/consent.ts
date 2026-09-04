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

/**
 * Checks whether the given user has accepted the mandatory terms and privacy policy.
 * The Firestore database is the single source of truth.
 */
export async function checkUserConsent(userId: string): Promise<{ hasAccepted: boolean; record?: UserConsentRecord | null }> {
  try {
    const firestore = requireFirestore();

    // 1. Check user profile document in Firestore
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

    // 2. Check dedicated consents collection in Firestore
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
    console.warn('[FLOW] Falha ao verificar consentimento no Firestore, checando cache local.', error);
    // Fallback: check local flag only if network fails
    const cached = localStorage.getItem(`flow.consent.${userId}`);
    return { hasAccepted: cached === CURRENT_CONSENT_VERSION };
  }
}

/**
 * Persists the user's mandatory consent in Firestore.
 */
export async function recordUserConsent(userId: string, accepted: boolean): Promise<void> {
  const firestore = requireFirestore();

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

    // Save to consents collection
    await setDoc(doc(firestore, 'consents', userId), payload, { merge: true });

    // Update user profile document
    await updateDoc(doc(firestore, 'users', userId), {
      termsAccepted: true,
      privacyAccepted: true,
      consentVersion: CURRENT_CONSENT_VERSION,
      consentDocumentVersion: CURRENT_DOCUMENT_VERSION,
      consentAcceptedAt: serverTimestamp(),
      consentUserId: userId,
    }).catch(async () => {
      // If doc didn't exist or merge needed
      await setDoc(doc(firestore, 'users', userId), {
        termsAccepted: true,
        privacyAccepted: true,
        consentVersion: CURRENT_CONSENT_VERSION,
        consentDocumentVersion: CURRENT_DOCUMENT_VERSION,
        consentAcceptedAt: serverTimestamp(),
        consentUserId: userId,
      }, { merge: true });
    });

    localStorage.setItem(`flow.consent.${userId}`, CURRENT_CONSENT_VERSION);
  } else {
    // Declined flow
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
    } catch {
      // Ignore if offline
    }

    localStorage.removeItem(`flow.consent.${userId}`);
    await logout();
  }
}
