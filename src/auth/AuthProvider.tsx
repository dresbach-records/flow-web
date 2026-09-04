import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { completeGoogleSignIn, onFlowAuthChanged, logout as firebaseLogout, type FlowUser } from '../services/firebase/auth';

type AuthContextValue = {
  user: FlowUser | null;
  loading: boolean;
  authenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void completeGoogleSignIn().catch(() => undefined);
    const unsubscribe = onFlowAuthChanged((next) => {
      if (!mounted) return;
      setUser(next);
      setLoading(false);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    authenticated: Boolean(user),
    logout: async () => {
      await firebaseLogout();
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
