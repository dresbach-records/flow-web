import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { FlowUser } from '../services/api/auth';

type AppContextValue = {
  authenticated: boolean;
  user: FlowUser | null;
  setSession: (user: FlowUser | null) => void;
  adminAuthenticated: boolean;
  adminUser: FlowUser | null;
  setAdminSession: (user: FlowUser | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [adminUser, setAdminUser] = useState<FlowUser | null>(null);
  const value = useMemo(() => ({
    authenticated: Boolean(user), user, setSession: setUser,
    adminAuthenticated: Boolean(adminUser), adminUser, setAdminSession: setAdminUser,
  }), [user, adminUser]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used inside AppProvider');
  return value;
}
