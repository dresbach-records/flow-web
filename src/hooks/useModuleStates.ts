// FLOW — useModuleStates (estados reais dos módulos, aplicados pelo app).
// Lê `platform_settings/modules` (leitura pública). Falha = tudo habilitado
// (fail-open honesto documentado; nunca bloqueia por erro de leitura).
import { useEffect, useState } from 'react';
import { getDocument } from '../services/firebase/firestore';

export type ModuleState = 'enabled' | 'maintenance' | 'disabled';

const VALID: ModuleState[] = ['enabled', 'maintenance', 'disabled'];

export function useModuleStates() {
  const [states, setStates] = useState<Record<string, ModuleState>>({});

  useEffect(() => {
    let cancelled = false;
    void getDocument<Record<string, unknown>>('platform_settings', 'modules')
      .then((doc) => {
        if (cancelled || !doc?.states || typeof doc.states !== 'object') return;
        const saved = doc.states as Record<string, unknown>;
        const valid: Record<string, ModuleState> = {};
        for (const [key, value] of Object.entries(saved)) {
          if (VALID.includes(value as ModuleState)) valid[key] = value as ModuleState;
        }
        setStates(valid);
      })
      .catch(() => {
        /* fail-open: mantém tudo habilitado */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return states;
}

/** Rota /app/* → chave de módulo correspondente. */
export function moduleKeyForPath(path: string): string | null {
  if (path === '/app' || path === '/app/criar' || path.startsWith('/app/perfil')) return 'feed';
  if (path.startsWith('/app/explorar')) return 'feed';
  if (path.startsWith('/app/shorts')) return 'shorts';
  if (path.startsWith('/app/comunidades')) return 'communities';
  if (path.startsWith('/app/mensagens')) return 'messaging';
  if (path.startsWith('/app/salvos')) return 'feed';
  if (path.startsWith('/app/configuracoes')) return null;
  if (path.startsWith('/app/criador')) return 'feed';
  if (path.startsWith('/app/memorial')) return null;
  if (path.startsWith('/app/agendamento')) return null;
  if (path.startsWith('/app/shop') || path.startsWith('/app/loja') || path.startsWith('/app/pedidos')) return 'shop';
  if (path.startsWith('/app/rewards')) return 'rewards';
  if (path.startsWith('/app/anunciar') || path.startsWith('/app/ads')) return 'ads';
  if (path.startsWith('/app/denunciar') || path.startsWith('/app/seguranca')) return 'moderation';
  return null;
}
