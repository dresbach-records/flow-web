import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { completeGoogleSignIn, onFlowAuthChanged, type FlowUser } from '../services/firebase/auth';
import { checkUserConsent, recordUserConsent } from '../services/firebase/consent';

type AppContextValue = {
  authenticated: boolean;
  user: FlowUser | null;
  loading: boolean;
  adminAuthenticated: boolean;
  adminUser: FlowUser | null;
  setAdminUser: (user: FlowUser | null) => void;
  needsConsent: boolean;
  checkingConsent: boolean;
  acceptConsent: () => Promise<void>;
  declineConsent: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<FlowUser | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(false);

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
      if (!next) {
        setAdminUser(null);
        setNeedsConsent(false);
        setCheckingConsent(false);
      }
    });
    return unsubscribe;
  }, []);

  // When user is authenticated, check their consent status against Firestore
  useEffect(() => {
    if (!user) {
      setNeedsConsent(false);
      setCheckingConsent(false);
      return;
    }

    let isMounted = true;
    setCheckingConsent(true);

    void checkUserConsent(user.uid)
      .then((res) => {
        if (!isMounted) return;
        setNeedsConsent(!res.hasAccepted);
      })
      .catch((err) => {
        console.warn('[FLOW] Erro ao checar consentimento:', err);
        if (isMounted) setNeedsConsent(false);
      })
      .finally(() => {
        if (isMounted) setCheckingConsent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const acceptConsent = useCallback(async () => {
    if (!user) return;
    await recordUserConsent(user.uid, true);
    setNeedsConsent(false);
  }, [user]);

  const declineConsent = useCallback(async () => {
    if (!user) return;
    await recordUserConsent(user.uid, false);
    setNeedsConsent(false);
    setUser(null);
    history.pushState({}, '', '/login?reason=consent_declined');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [user]);

  const value = useMemo<AppContextValue>(
    () => ({
      authenticated: Boolean(user),
      user,
      loading,
      adminAuthenticated: Boolean(adminUser),
      adminUser,
      setAdminUser,
      needsConsent,
      checkingConsent,
      acceptConsent,
      declineConsent,
    }),
    [user, loading, adminUser, needsConsent, checkingConsent, acceptConsent, declineConsent],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppContext must be used inside AppProvider');
  return value;
}
