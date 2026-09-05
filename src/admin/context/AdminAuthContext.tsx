import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase/config';
import { toFlowUser, type FlowUser } from '../../services/firebase/auth';

export type AdminUser = {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'superadmin' | 'moderator';
  photoURL?: string | null;
  lastLogin?: string;
  isDemo?: boolean;
};

type AdminAuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_ROLES: Array<FlowUser['role']> = ['admin', 'moderator'];

function toAdminInfo(
  fbUser: FirebaseUser,
  flowUser: FlowUser,
): AdminUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email || 'admin@flow.social',
    displayName: fbUser.displayName || flowUser.displayName || 'Administrador',
    role: flowUser.role === 'moderator' ? 'moderator' : 'admin',
    photoURL: fbUser.photoURL || flowUser.photoURL,
    lastLogin: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    isDemo: false,
  };
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('flow.admin.session_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};

    if (firebaseAuth) {
      try {
        unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            try {
              const flowUser: FlowUser = await toFlowUser(fbUser);
              // Autorização real: só perfis admin/moderator recebem sessão admin.
              if (!ADMIN_ROLES.includes(flowUser.role)) {
                setUser(null);
                localStorage.removeItem('flow.admin.session_user');
                localStorage.removeItem('flow.admin.session');
              } else {
                const adminInfo = toAdminInfo(fbUser, flowUser);
                setUser(adminInfo);
                localStorage.setItem('flow.admin.session_user', JSON.stringify(adminInfo));
                localStorage.setItem('flow.admin.session', '1');
              }
            } catch {
              // Sem perfil no Firestore = sem permissão (nunca concede demo).
              setUser(null);
              localStorage.removeItem('flow.admin.session_user');
              localStorage.removeItem('flow.admin.session');
            }
          }
          setLoading(false);
        });
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim();

    // Somente Firebase Auth + papel administrativo real. Sem sessão demo.
    if (!firebaseAuth) {
      setError('Autenticação indisponível: Firebase não configurado.');
      return false;
    }

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, pass);
      const fbUser = credential.user;
      const flowUser = await toFlowUser(fbUser);
      if (!ADMIN_ROLES.includes(flowUser.role)) {
        await firebaseSignOut(firebaseAuth);
        setError('Esta conta não possui permissão administrativa.');
        return false;
      }
      const adminInfo = toAdminInfo(fbUser, flowUser);
      setUser(adminInfo);
      localStorage.setItem('flow.admin.session_user', JSON.stringify(adminInfo));
      localStorage.setItem('flow.admin.session', '1');
      return true;
    } catch (fbErr: unknown) {
      console.warn('[FlowAdmin] Firebase Auth tentativa:', fbErr);
      const code =
        typeof fbErr === 'object' && fbErr !== null && 'code' in fbErr
          ? String((fbErr as { code: unknown }).code)
          : '';
      const msg =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'E-mail ou senha incorretos.'
          : `Erro de login Firebase: ${code || 'falha na autenticação'}`;
      setError(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (firebaseAuth) {
        await firebaseSignOut(firebaseAuth);
      }
    } catch (e) {
      console.error('[FlowAdmin] Erro ao fazer logout:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('flow.admin.session_user');
      localStorage.removeItem('flow.admin.session');
    }
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
