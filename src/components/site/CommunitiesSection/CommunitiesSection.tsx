import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { navigate } from '../../../hooks/useRouter';
import {
  getMyMemberships,
  joinCommunity,
  leaveCommunity,
  listCommunities,
  type Community,
} from '../../../services/firebase/communities';
import EmptyState from '../../ui/EmptyState';
import ErrorState from '../../ui/ErrorState';
import LoadingState from '../../ui/LoadingState';
import CommunityCard from '../CommunityCard';
import SectionHeading from '../SectionHeading';
import './CommunitiesSection.css';

type SectionState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; items: Community[] };

export default function CommunitiesSection() {
  const { user } = useAppContext();
  const [state, setState] = useState<SectionState>({ kind: 'loading' });
  const [memberships, setMemberships] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      const [items, mine] = await Promise.all([
        listCommunities(6),
        user ? getMyMemberships() : Promise.resolve(new Set<string>()),
      ]);
      setMemberships(mine);
      setState({ kind: 'ready', items });
    } catch (cause) {
      const raw = cause instanceof Error ? cause.message : '';
      const message = /permission/i.test(raw)
        ? 'As comunidades ainda não estão disponíveis neste ambiente. Tente novamente em instantes.'
        : raw || 'Não foi possível carregar as comunidades.';
      setState({ kind: 'error', message });
    }
  }, [user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (id: string, joined: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusyId(id);
    try {
      if (joined) {
        await leaveCommunity(id);
        setMemberships((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await joinCommunity(id);
        setMemberships((prev) => new Set(prev).add(id));
      }
      await load();
    } catch {
      setState({ kind: 'error', message: 'Não foi possível atualizar sua participação. Tente novamente.' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="site-communities">
      <div className="site-communities-inner">
        <SectionHeading
          eyebrow="Encontre os seus"
          highlight="Comunidades"
          title="para todos os interesses"
          description="Espaços para conversar com pessoas que compartilham a mesma paixão."
          align="center"
        />
        {state.kind === 'loading' && <LoadingState message="Carregando comunidades…" />}
        {state.kind === 'error' && <ErrorState description={state.message} onRetry={() => void load()} />}
        {state.kind === 'ready' &&
          (state.items.length === 0 ? (
            <EmptyState
              title="Nenhuma comunidade ainda"
              description="As primeiras comunidades da Flow aparecerão aqui assim que forem criadas."
            />
          ) : (
            <div className="site-communities-grid">
              {state.items.map((c) => (
                <CommunityCard
                  key={c.id}
                  community={c}
                  joined={memberships.has(c.id)}
                  busy={busyId === c.id}
                  onToggle={() => void handleToggle(c.id, memberships.has(c.id))}
                />
              ))}
            </div>
          ))}
      </div>
    </section>
  );
}
