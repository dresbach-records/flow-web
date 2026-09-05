import { useEffect, useState } from 'react';
import { formatCompact, getPlatformStats, type PlatformStats } from '../../../services/firebase/stats';
import './StatsSection.css';

type StatsState = { kind: 'loading' } | { kind: 'ready'; stats: PlatformStats } | { kind: 'unavailable' };

export default function StatsSection() {
  const [state, setState] = useState<StatsState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    void getPlatformStats()
      .then((stats) => {
        if (!cancelled) setState(stats ? { kind: 'ready', stats } : { kind: 'unavailable' });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'unavailable' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sem backend para o indicador: seção honesta, sem números falsos.
  if (state.kind === 'unavailable') return null;

  const cards =
    state.kind === 'ready'
      ? [
          { value: formatCompact(state.stats.users), label: 'pessoas conectadas' },
          { value: formatCompact(state.stats.communities), label: 'comunidades ativas' },
          { value: formatCompact(state.stats.posts), label: 'histórias compartilhadas' },
          { value: formatCompact(state.stats.creators), label: 'criadores' },
        ]
      : null;

  return (
    <section className="site-stats" aria-label="Flow em números">
      <div className="site-stats-inner">
        {cards
          ? cards.map((c) => (
              <div key={c.label} className="site-stat">
                <strong>{c.value}</strong>
                <span>{c.label}</span>
              </div>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div key={i} className="site-stat is-loading" aria-hidden="true">
                <strong>—</strong>
                <span>carregando…</span>
              </div>
            ))}
      </div>
    </section>
  );
}
