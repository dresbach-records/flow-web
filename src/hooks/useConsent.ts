// FLOW — useConsent (guarda de contrato).
// Expõe o estado do aceite versionado para a guarda de rotas em src/App.tsx.
// O TermsGate é exibido UMA única vez: status sai de `pending` para
// `accepted` após persistência e nunca mais retorna.
import { useCallback, useEffect, useState } from 'react';
import {
  acceptContract,
  declineContractAndSignOut,
  hasAcceptedContract,
  type ConsentStatus,
} from '../services/firebase/consent';

export function useConsent(userUid: string | undefined) {
  const [status, setStatus] = useState<ConsentStatus>('loading');

  useEffect(() => {
    if (!userUid) {
      setStatus('loading');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    void hasAcceptedContract(userUid)
      .then((accepted) => {
        if (!cancelled) setStatus(accepted ? 'accepted' : 'pending');
      })
      .catch(() => {
        // Sem leitura (offline/regras): bloqueia por segurança até conseguir ler.
        if (!cancelled) setStatus('pending');
      });
    return () => {
      cancelled = true;
    };
  }, [userUid]);

  const accept = useCallback(async () => {
    await acceptContract();
    setStatus('accepted');
  }, []);

  const decline = useCallback(async () => {
    await declineContractAndSignOut();
  }, []);

  return { status, accept, decline };
}

export type { ConsentStatus };
