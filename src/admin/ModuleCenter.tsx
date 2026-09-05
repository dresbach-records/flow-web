// FLOW — ModuleCenter (MODO REAL).
// Estados dos módulos persistem em `platform_settings/modules` (leitura pública,
// escrita só admin) e são aplicados pelo app (manutenção bloqueia a rota).
import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2, Wrench, Power, Shield, Globe, Store, Gift, Megaphone, Video, Users, MessageCircle, Settings2,
} from 'lucide-react';
import { getDocument, upsertDocument } from '../services/firebase/firestore';
import { logAdminAction } from '../services/firebase/audit';
import './module-center.css';

export type ModuleState = 'enabled' | 'maintenance' | 'disabled';

const initial: Array<readonly [string, string, string, React.ComponentType]> = [
  ['site', 'Site institucional', 'Site e conteúdo público', Globe],
  ['feed', 'For You / Feed', 'Descoberta e Following', Video],
  ['shorts', 'Shorts', 'Vídeos curtos', Video],
  ['stories', 'Stories', 'Conteúdo temporário', Video],
  ['live', 'Live', 'Transmissões ao vivo', Video],
  ['social', 'Interações', 'Curtidas, comentários e compartilhamentos', MessageCircle],
  ['communities', 'Comunidades', 'Grupos e participação', Users],
  ['messaging', 'Mensagens', 'Conversas privadas', MessageCircle],
  ['shop', 'FLOW Shop', 'Marketplace e pedidos', Store],
  ['seller', 'Vendedores', 'Lojas e onboarding', Store],
  ['ads', 'FLOW Ads', 'Campanhas e anunciantes', Megaphone],
  ['rewards', 'FLOW Rewards', 'Tarefas e recompensas', Gift],
  ['moderation', 'Moderação', 'Fila e políticas', Shield],
  ['reports', 'Denúncias', 'Reports e apelações', Shield],
  ['antiPiracy', 'Antipirataria', 'Fingerprint e propriedade intelectual', Shield],
  ['trust', 'Trust & Safety', 'Segurança e conformidade', Shield],
];

const DEFAULTS: Record<string, ModuleState> = Object.fromEntries(initial.map((x) => [x[0], 'enabled']));

export default function ModuleCenter() {
  const [state, setState] = useState<Record<string, ModuleState>>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const doc = await getDocument<Record<string, unknown>>('platform_settings', 'modules');
      if (doc?.states && typeof doc.states === 'object') {
        const saved = doc.states as Record<string, unknown>;
        const valid = Object.fromEntries(
          Object.entries(saved).filter(([, v]) => v === 'enabled' || v === 'maintenance' || v === 'disabled'),
        ) as Record<string, ModuleState>;
        setState({ ...DEFAULTS, ...valid });
      }
    } catch {
      /* sem config salva: mantém padrões */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const persist = async (next: Record<string, ModuleState>) => {
    await upsertDocument('platform_settings', 'modules', { states: next });
  };

  const flip = (id: string) => {
    const nextState: ModuleState = state[id] === 'enabled' ? 'maintenance' : 'enabled';
    const previous = state;
    const next = { ...state, [id]: nextState };
    setState(next);
    setError(null);
    setSavingId(id);
    void persist(next)
      .then(() => {
        void logAdminAction(nextState === 'maintenance' ? 'MODULE_MAINTENANCE' : 'MODULE_ENABLE', `Module ${id}`);
      })
      .catch(() => {
        setState(previous);
        setError('Falha ao salvar. Verifique a permissão administrativa.');
      })
      .finally(() => setSavingId(null));
  };

  return (
    <div className="module-center">
      <div className="mc-head">
        <div>
          <span>FLOW CONTROL CENTER</span>
          <h1>Módulos da plataforma</h1>
          <p>Estados reais persistidos e aplicados pelo app: manutenção bloqueia a rota do módulo.</p>
        </div>
        <Settings2 />
      </div>
      <div className="mc-note">
        <Power />
        <div>
          <b>Configuração aplicada</b>
          <p>{loading ? 'Carregando estados…' : 'Estados lidos de platform_settings/modules.'}</p>
        </div>
      </div>
      {error && (
        <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>
      )}
      <div className="mc-grid">
        {initial.map(([id, name, desc, Icon]) => (
          <article className="mc-card" key={id}>
            <div className="mc-icon"><Icon /></div>
            <div className="mc-main">
              <div className="mc-title">
                <h3>{name}</h3>
                <span className={`mc-status ${state[id]}`}>
                  {state[id] === 'enabled' ? 'ATIVO' : state[id] === 'maintenance' ? 'MANUTENÇÃO' : 'DESATIVADO'}
                </span>
              </div>
              <p>{desc}</p>
              <small>Módulo: {id}</small>
            </div>
            <button onClick={() => flip(id)} disabled={savingId === id || loading}>
              {state[id] === 'enabled' ? <Wrench /> : <CheckCircle2 />}
              {savingId === id ? 'Salvando…' : state[id] === 'enabled' ? 'Manutenção' : 'Ativar'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
