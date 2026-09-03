import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AppContextValue = {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (value: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('flow.auth') === '1');
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => localStorage.getItem('flow.admin.session') === '1');
  const value = useMemo(() => ({ authenticated, setAuthenticated, adminAuthenticated, setAdminAuthenticated }), [authenticated, adminAuthenticated]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used inside AppProvider');
  return value;
}
