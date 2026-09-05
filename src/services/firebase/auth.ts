import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  getRedirectResult,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { firebaseAuth, requireFirebaseAuth, requireFirestore } from './config';

export type AccountType = 'individual' | 'business';

export type FlowUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'creator' | 'seller' | 'moderator' | 'admin';
  accountType: AccountType;
  emailVerified: boolean;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  accountType?: AccountType;
  phone?: string;
  birthDate?: string;
  cpf?: string;
  cnpj?: string;
  legalName?: string;
  tradeName?: string;
  acceptedTerms: boolean;
};

export type TwoFactorMethod = 'app' | 'sms' | 'email';

export type SessionRecord = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type LinkedAccount = {
  providerId: string;
  providerName: string;
  email?: string;
  linkedAt: string;
};

export type AccountRestrictionInfo = {
  status: 'active' | 'blocked' | 'deactivated' | 'suspended';
  title: string;
  reason: string;
  date: string;
  canAppeal: boolean;
};

export async function toFlowUser(user: User): Promise<FlowUser> {
  const firestore = requireFirestore();
  const snapshot = await getDoc(doc(firestore, 'users', user.uid));
  const profile = snapshot.exists() ? snapshot.data() : {};
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? (profile.name as string) ?? null,
    photoURL: user.photoURL,
    role: (profile.role as FlowUser['role']) ?? 'user',
    accountType: (profile.accountType as AccountType) ?? 'individual',
    emailVerified: user.emailVerified,
  };
}

export async function registerUser(input: RegisterInput): Promise<FlowUser> {
  if (!input.acceptedTerms) throw new Error('É necessário aceitar os termos para criar a conta.');
  const auth = requireFirebaseAuth();
  const firestore = requireFirestore();
  const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
  await updateProfile(credential.user, { displayName: input.name.trim() });
  await setDoc(doc(firestore, 'users', credential.user.uid), {
    name: input.name.trim(),
    email: input.email.trim(),
    accountType: input.accountType ?? 'individual',
    phone: input.phone ?? null,
    birthDate: input.birthDate ?? null,
    cpf: input.cpf ?? null,
    cnpj: input.cnpj ?? null,
    legalName: input.legalName ?? null,
    tradeName: input.tradeName ?? null,
    role: 'user',
    acceptedTermsAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  await sendEmailVerification(credential.user).catch(() => undefined);
  const flowUser = await toFlowUser(credential.user);
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

export async function loginUser(email: string, password: string): Promise<FlowUser> {
  const auth = requireFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const flowUser = await toFlowUser(credential.user);
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

const googleSignupStorageKey = 'flow-google-signup';

export async function loginWithGoogle(accountType: AccountType = 'individual', acceptedTerms = false): Promise<FlowUser | null> {
  const auth = requireFirebaseAuth();
  const firestore = requireFirestore();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const credential = await signInWithPopup(auth, provider);
    const userRef = doc(firestore, 'users', credential.user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        name: credential.user.displayName ?? null,
        email: credential.user.email,
        photoURL: credential.user.photoURL ?? null,
        accountType,
        role: 'user',
        acceptedTermsAt: acceptedTerms ? serverTimestamp() : null,
        createdAt: serverTimestamp(),
      });
    }

    const flowUser = await toFlowUser(credential.user);
    localStorage.setItem('flow.auth', '1');
    return flowUser;
  } catch (error: unknown) {
    const errCode = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
    if (errCode === 'auth/popup-blocked' || errCode === 'auth/cancelled-popup-request') {
      sessionStorage.setItem(googleSignupStorageKey, JSON.stringify({ accountType, acceptedTerms }));
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

export async function completeGoogleSignIn(): Promise<FlowUser | null> {
  if (!firebaseAuth) return null;
  const firestore = requireFirestore();
  const credential = await getRedirectResult(firebaseAuth);
  if (!credential) return null;

  const signupData = sessionStorage.getItem(googleSignupStorageKey);
  sessionStorage.removeItem(googleSignupStorageKey);
  const { accountType = 'individual', acceptedTerms = false } = signupData
    ? (JSON.parse(signupData) as { accountType?: AccountType; acceptedTerms?: boolean })
    : {};
  const userRef = doc(firestore, 'users', credential.user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: credential.user.displayName ?? null,
      email: credential.user.email,
      photoURL: credential.user.photoURL ?? null,
      accountType,
      role: 'user',
      acceptedTermsAt: acceptedTerms ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
    });
  }

  const flowUser = await toFlowUser(credential.user);
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

export async function loginAdmin(email: string, password: string): Promise<FlowUser> {
  const auth = requireFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const flowUser = await toFlowUser(credential.user);
  if (flowUser.role !== 'admin' && flowUser.role !== 'moderator') {
    await signOut(auth);
    localStorage.removeItem('flow.auth');
    throw new Error('Esta conta não tem permissão administrativa.');
  }
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

export async function logout(): Promise<void> {
  const auth = requireFirebaseAuth();
  await signOut(auth);
  localStorage.removeItem('flow.auth');
}

export async function requestPasswordReset(email: string): Promise<void> {
  const auth = requireFirebaseAuth();
  await sendPasswordResetEmail(auth, email.trim());
}

/** Confirma a redefinição com o código do link (oobCode) — persistência real. */
export async function confirmPasswordResetWithCode(oobCode: string, newPassword: string): Promise<void> {
  const auth = requireFirebaseAuth();
  const { confirmPasswordReset } = await import('firebase/auth');
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function resendVerification(): Promise<void> {
  const auth = requireFirebaseAuth();
  if (auth.currentUser) await sendEmailVerification(auth.currentUser);
}

// ==================== 2FA & MÉTODOS DE SEGURANÇA ====================

export async function get2FAStatus(): Promise<{ enabled: boolean; method: TwoFactorMethod; phone?: string }> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return { enabled: false, method: 'app' };
  const firestore = requireFirestore();
  const docSnap = await getDoc(doc(firestore, 'users', uid, 'security', '2fa'));
  if (!docSnap.exists()) return { enabled: false, method: 'app' };
  const data = docSnap.data();
  return {
    enabled: Boolean(data.enabled),
    method: (data.method as TwoFactorMethod) ?? 'app',
    phone: data.phone as string | undefined,
  };
}

export async function configure2FAMethod(method: TwoFactorMethod, target?: string): Promise<{ secret: string; backupCodes: string[] }> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Autenticação necessária.');
  const firestore = requireFirestore();

  const secret = 'FLOW-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
  const backupCodes = Array.from({ length: 8 }, () => Math.floor(10000000 + Math.random() * 90000000).toString());

  await setDoc(
    doc(firestore, 'users', uid, 'security', '2fa'),
    {
      method,
      target: target ?? null,
      secret,
      backupCodes,
      enabled: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { secret, backupCodes };
}

export async function verify2FACode(code: string): Promise<boolean> {
  const cleaned = code.trim().replace(/\D/g, '');
  if (cleaned.length < 6) throw new Error('O código deve conter pelo menos 6 dígitos.');
  // Verificação real contra os códigos de backup de uso único (Fase 4).
  // TOTP por app autenticador chega com o backend dedicado (Fase 9).
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Autenticação necessária.');
  const firestore = requireFirestore();
  const ref = doc(firestore, 'users', uid, 'security', '2fa');
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) throw new Error('Segundo fator não configurado para esta conta.');
  const stored = (docSnap.data().backupCodes as unknown[] | undefined) ?? [];
  const codes = stored.filter((c): c is string => typeof c === 'string');
  if (!codes.includes(cleaned)) throw new Error('Código inválido. Confira e tente novamente.');
  // Consumo real de uso único: o código não pode ser reutilizado.
  await setDoc(ref, { backupCodes: codes.filter((c) => c !== cleaned) }, { merge: true });
  return true;
}

export async function getBackupCodes(): Promise<string[]> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const firestore = requireFirestore();
  const docSnap = await getDoc(doc(firestore, 'users', uid, 'security', '2fa'));
  if (!docSnap.exists()) return [];
  return (docSnap.data().backupCodes as string[]) || [];
}

export async function regenerateBackupCodes(): Promise<string[]> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Autenticação necessária.');
  const firestore = requireFirestore();
  const backupCodes = Array.from({ length: 8 }, () => Math.floor(10000000 + Math.random() * 90000000).toString());
  await setDoc(
    doc(firestore, 'users', uid, 'security', '2fa'),
    { backupCodes, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return backupCodes;
}

/** Desativa o segundo fator (persistência real). */
export async function disable2FA(): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Autenticação necessária.');
  const firestore = requireFirestore();
  await setDoc(
    doc(firestore, 'users', uid, 'security', '2fa'),
    { enabled: false, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/** Atualiza nome de exibição (Auth + perfil) com persistência real. */
export async function updateAccountProfile(input: {
  displayName?: string;
  bio?: string;
  photoURL?: string;
  coverUrl?: string;
  privateProfile?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}): Promise<void> {
  const auth = requireFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Faça login para continuar.');
  const firestore = requireFirestore();
  if (typeof input.displayName === 'string' && input.displayName.trim() && input.displayName !== user.displayName) {
    const { updateProfile } = await import('firebase/auth');
    await updateProfile(user, { displayName: input.displayName.trim() });
  }
  if (typeof input.photoURL === 'string' && input.photoURL && input.photoURL !== user.photoURL) {
    const { updateProfile } = await import('firebase/auth');
    await updateProfile(user, { photoURL: input.photoURL });
  }
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (typeof input.displayName === 'string') data.displayName = input.displayName.trim();
  if (typeof input.bio === 'string') data.bio = input.bio;
  if (typeof input.photoURL === 'string') data.photoURL = input.photoURL;
  if (typeof input.coverUrl === 'string') data.coverUrl = input.coverUrl;
  if (typeof input.privateProfile === 'boolean') data.privateProfile = input.privateProfile;
  if (typeof input.emailNotifications === 'boolean') data.emailNotifications = input.emailNotifications;
  if (typeof input.pushNotifications === 'boolean') data.pushNotifications = input.pushNotifications;
  await setDoc(doc(firestore, 'users', user.uid), data, { merge: true });
}

/** Upload de avatar/capa com validações reais (tipo + tamanho). */
export async function uploadProfileMedia(kind: 'avatar' | 'cover', file: File): Promise<string> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  if (!file.type.startsWith('image/')) throw new Error('Selecione uma imagem.');
  if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB.');
  const { uploadMedia } = await import('./storage');
  const result = await uploadMedia(`users/${uid}/profile`, file);
  return result.url;
}

// ==================== SESSÕES E DISPOSITIVOS ====================

export async function listActiveSessions(): Promise<SessionRecord[]> {
  const isCurrentChrome = navigator.userAgent.includes('Chrome');
  const isCurrentMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  // Apenas a sessão atual é verificável no cliente (demais sessões: Fase 9/backend).
  return [
    {
      id: 'current-session',
      device: isCurrentMobile ? 'Smartphone (Atual)' : 'Computador Desktop (Atual)',
      browser: isCurrentChrome ? 'Google Chrome' : 'Navegador Web',
      ip: 'Não exibido por privacidade',
      location: 'Sessão atual deste dispositivo',
      lastActive: 'Agora mesmo',
      current: true,
    },
  ];
}

export async function terminateSession(sessionId: string): Promise<void> {
  if (sessionId === 'current-session') {
    await logout();
    return;
  }
  throw new Error('Encerramento remoto de sessões chega com o backend (Fase 9).');
}

// ==================== STATUS DE CONTA & RECURSOS ====================

export async function getAccountRestrictionDetails(statusType: 'bloqueada' | 'desativada' | 'suspensa'): Promise<AccountRestrictionInfo> {
  if (statusType === 'bloqueada') {
    return {
      status: 'blocked',
      title: 'Conta Temporariamente Bloqueada',
      reason: 'Identificamos tentativas sucessivas de login suspeitas a partir de uma localização incomum. Por segurança, o acesso foi bloqueado.',
      date: new Date().toLocaleDateString('pt-BR'),
      canAppeal: true,
    };
  }
  if (statusType === 'suspensa') {
    return {
      status: 'suspended',
      title: 'Conta Suspensa por Violação de Diretrizes',
      reason: 'Publicação de conteúdo incompatível com os Termos de Uso e Diretrizes da Comunidade FLOW.',
      date: new Date().toLocaleDateString('pt-BR'),
      canAppeal: true,
    };
  }
  return {
    status: 'deactivated',
    title: 'Conta Desativada a Pedido do Usuário',
    reason: 'Você solicitou a desativação voluntária desta conta. Seus dados estão preservados conforme a LGPD.',
    date: new Date().toLocaleDateString('pt-BR'),
    canAppeal: true,
  };
}

export async function submitAccountAppeal(ticketData: { email: string; reason: string; details: string }): Promise<string> {
  const ticketId = 'REC-' + Math.floor(100000 + Math.random() * 900000);
  const firestore = requireFirestore();
  // Falha de persistência = erro honesto (sem protocolo fictício).
  await setDoc(doc(collection(firestore, 'appeals')), {
    ticketId,
    email: ticketData.email.trim(),
    reason: ticketData.reason,
    details: ticketData.details,
    status: 'PENDING',
    createdAt: serverTimestamp(),
  });
  return ticketId;
}

// ==================== CENTRAL DE CONTAS ====================

export async function getLinkedAccounts(): Promise<LinkedAccount[]> {
  const auth = requireFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return [];

  const providers = user.providerData.map(p => ({
    providerId: p.providerId,
    providerName: p.providerId === 'google.com' ? 'Google' : p.providerId === 'password' ? 'E-mail e Senha' : p.providerId,
    email: p.email || undefined,
    linkedAt: 'Vinculado',
  }));

  if (!providers.some(p => p.providerId === 'google.com')) {
    providers.push({
      providerId: 'google.com',
      providerName: 'Google',
      email: undefined,
      linkedAt: 'Não conectado',
    });
  }

  return providers;
}

export function onFlowAuthChanged(callback: (user: FlowUser | null) => void): () => void {
  if (!firebaseAuth) {
    localStorage.removeItem('flow.auth');
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      localStorage.removeItem('flow.auth');
      callback(null);
      return;
    }
    try {
      localStorage.setItem('flow.auth', '1');
      callback(await toFlowUser(user));
    } catch (error) {
      console.error('[FLOW] Falha ao carregar perfil autenticado.', error);
      callback(null);
    }
  });
}
