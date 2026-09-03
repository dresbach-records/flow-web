import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  getRedirectResult,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from './config';

export type AccountType = 'individual' | 'business';

export type FlowUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
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

export async function toFlowUser(user: User): Promise<FlowUser> {
  const snapshot = await getDoc(doc(firestore, 'users', user.uid));
  const profile = snapshot.exists() ? snapshot.data() : {};
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? (profile.name as string) ?? null,
    role: (profile.role as FlowUser['role']) ?? 'user',
    accountType: (profile.accountType as AccountType) ?? 'individual',
    emailVerified: user.emailVerified,
  };
}

export async function registerUser(input: RegisterInput): Promise<FlowUser> {
  if (!input.acceptedTerms) throw new Error('É necessário aceitar os termos para criar a conta.');
  const credential = await createUserWithEmailAndPassword(firebaseAuth, input.email.trim(), input.password);
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
  const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  const flowUser = await toFlowUser(credential.user);
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

const googleSignupStorageKey = 'flow-google-signup';

export async function loginWithGoogle(accountType: AccountType = 'individual', acceptedTerms = false): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  sessionStorage.setItem(googleSignupStorageKey, JSON.stringify({ accountType, acceptedTerms }));
  await signInWithRedirect(firebaseAuth, provider);
}

export async function completeGoogleSignIn(): Promise<FlowUser | null> {
  const credential = await getRedirectResult(firebaseAuth);
  if (!credential) return null;

  const signupData = sessionStorage.getItem(googleSignupStorageKey);
  sessionStorage.removeItem(googleSignupStorageKey);
  const { accountType = 'individual', acceptedTerms = false } = signupData
    ? JSON.parse(signupData) as { accountType?: AccountType; acceptedTerms?: boolean }
    : {};
  const userRef = doc(firestore, 'users', credential.user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: credential.user.displayName ?? null,
      email: credential.user.email,
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
  const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  const flowUser = await toFlowUser(credential.user);
  if (flowUser.role !== 'admin' && flowUser.role !== 'moderator') {
    await signOut(firebaseAuth);
    localStorage.removeItem('flow.auth');
    throw new Error('Esta conta não tem permissão administrativa.');
  }
  localStorage.setItem('flow.auth', '1');
  return flowUser;
}

export async function logout(): Promise<void> {
  await signOut(firebaseAuth);
  localStorage.removeItem('flow.auth');
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth, email.trim());
}

export async function resendVerification(): Promise<void> {
  if (firebaseAuth.currentUser) await sendEmailVerification(firebaseAuth.currentUser);
}

export function onFlowAuthChanged(callback: (user: FlowUser | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      localStorage.removeItem('flow.auth');
      callback(null);
      return;
    }
    localStorage.setItem('flow.auth', '1');
    callback(await toFlowUser(user));
  });
}
