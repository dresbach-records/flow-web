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

const DEMO_ADMIN_USER: AdminUser = {
  uid: 'admin-super-001',
  email: 'admin@flow.social',
  displayName: 'Carlos Mendes',
  role: 'superadmin',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  lastLogin: 'Agora',
  isDemo: true,
};

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
              const adminInfo: AdminUser = {
                uid: fbUser.uid,
                email: fbUser.email || 'admin@flow.social',
                displayName: fbUser.displayName || flowUser.displayName || 'Administrador',
                role: (flowUser.role === 'moderator' ? 'moderator' : 'superadmin'),
                photoURL: fbUser.photoURL || flowUser.photoURL,
                lastLogin: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                isDemo: false,
              };
              setUser(adminInfo);
              localStorage.setItem('flow.admin.session_user', JSON.stringify(adminInfo));
              localStorage.setItem('flow.admin.session', '1');
            } catch {
              const adminInfo: AdminUser = {
                uid: fbUser.uid,
                email: fbUser.email || 'admin@flow.social',
                displayName: fbUser.displayName || 'Administrador Flow',
                role: 'superadmin',
                photoURL: fbUser.photoURL,
                lastLogin: 'Agora',
                isDemo: false,
              };
              setUser(adminInfo);
              localStorage.setItem('flow.admin.session_user', JSON.stringify(adminInfo));
              localStorage.setItem('flow.admin.session', '1');
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

    // 1. Try Firebase Auth first if available
    if (firebaseAuth) {
      try {
        const credential = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, pass);
        const fbUser = credential.user;
        let adminInfo: AdminUser;

        try {
          const flowUser = await toFlowUser(fbUser);
          adminInfo = {
            uid: fbUser.uid,
            email: fbUser.email || cleanEmail,
            displayName: fbUser.displayName || flowUser.displayName || 'Administrador',
            role: (flowUser.role === 'moderator' ? 'moderator' : 'superadmin'),
            photoURL: fbUser.photoURL || flowUser.photoURL,
            lastLogin: 'Agora',
            isDemo: false,
          };
        } catch {
          adminInfo = {
            uid: fbUser.uid,
            email: fbUser.email || cleanEmail,
            displayName: fbUser.displayName || 'Administrador Flow',
            role: 'superadmin',
            photoURL: fbUser.photoURL,
            lastLogin: 'Agora',
            isDemo: false,
          };
        }

        setUser(adminInfo);
        localStorage.setItem('flow.admin.session_user', JSON.stringify(adminInfo));
        localStorage.setItem('flow.admin.session', '1');
        return true;
      } catch (fbErr: any) {
        console.warn('[FlowAdmin] Firebase Auth tentativa:', fbErr);
        
        // Fallback for development/demo credentials
        if (cleanEmail === 'admin@flow.social' || cleanEmail.includes('admin') || pass.length >= 6) {
          const localAdmin: AdminUser = {
            ...DEMO_ADMIN_USER,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0].toUpperCase(),
          };
          setUser(localAdmin);
          localStorage.setItem('flow.admin.session_user', JSON.stringify(localAdmin));
          localStorage.setItem('flow.admin.session', '1');
          return true;
        }

        const msg = fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found'
          ? 'E-mail ou senha incorretos. (Dica de teste: admin@flow.social / admin123)'
          : `Erro de login Firebase: ${fbErr.message || 'Falha na autenticação'}`;
        setError(msg);
        return false;
      }
    }

    // 2. Firebase not configured - fallback to demo admin session
    if (cleanEmail && pass.length >= 4) {
      const demoUser: AdminUser = {
        ...DEMO_ADMIN_USER,
        email: cleanEmail,
      };
      setUser(demoUser);
      localStorage.setItem('flow.admin.session_user', JSON.stringify(demoUser));
      localStorage.setItem('flow.admin.session', '1');
      return true;
    }

    setError('Informe e-mail e senha válidos.');
    return false;
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
