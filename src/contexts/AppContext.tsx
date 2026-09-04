 v0/flow-db-structure
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { FlowUser } from '../services/api/auth';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { completeGoogleSignIn, onFlowAuthChanged, type FlowUser } from '../services/firebase/auth';
 main

type AppContextValue = {
  authenticated: boolean;
  user: FlowUser | null;
 v0/flow-db-structure
  setSession: (user: FlowUser | null) => void;
  adminAuthenticated: boolean;
  adminUser: FlowUser | null;
  setAdminSession: (user: FlowUser | null) => void;

  loading: boolean;
  adminAuthenticated: boolean;
  adminUser: FlowUser | null;
  setAdminUser: (user: FlowUser | null) => void;
 main
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
 v0/flow-db-structure
  const [adminUser, setAdminUser] = useState<FlowUser | null>(null);
  const value = useMemo(() => ({
    authenticated: Boolean(user), user, setSession: setUser,
    adminAuthenticated: Boolean(adminUser), adminUser, setAdminSession: setAdminUser,
  }), [user, adminUser]);

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<FlowUser | null>(null);

  useEffect(() => {
    void completeGoogleSignIn().then((next) => {
      if (next && window.location.pathname !== '/app') {
        history.replaceState({}, '', '/app');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }).catch(() => undefined);
    const unsubscribe = onFlowAuthChanged((next) => {
      setUser(next);
      setLoading(false);
      // Keep the admin session in sync: if Firebase signs out, drop admin too.
      if (!next) setAdminUser(null);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      authenticated: Boolean(user),
      user,
      loading,
      adminAuthenticated: Boolean(adminUser),
      adminUser,
      setAdminUser,
    }),
    [user, loading, adminUser],
  );

 main
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used inside AppProvider');
  return value;
}
