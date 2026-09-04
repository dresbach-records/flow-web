import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { completeGoogleSignIn, onFlowAuthChanged, logout as firebaseLogout, type FlowUser } from '../services/firebase/auth';

type AppContextValue = {
  authenticated: boolean;
  user: FlowUser | null;
  loading: boolean;
  adminAuthenticated: boolean;
  adminUser: FlowUser | null;
  setAdminUser: (user: FlowUser | null) => void;
  logout: () => Promise<void>;
};

const AppContext = React.createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<FlowUser | null>(null);

  useEffect(() => {
    let mounted = true;
    void completeGoogleSignIn().catch(() => undefined);
    const unsubscribe = onFlowAuthChanged((next) => {
      if (!mounted) return;
      setUser(next);
      setLoading(false);
      if (!next) setAdminUser(null);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    authenticated: Boolean(user),
    user,
    loading,
    adminAuthenticated: Boolean(adminUser),
    adminUser,
    setAdminUser,
    logout: async () => {
      await firebaseLogout();
      setUser(null);
      setAdminUser(null);
    },
  }), [user, loading, adminUser]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used inside AppProvider');
  return value;
}
