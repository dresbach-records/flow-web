import type { CreatorPeriod } from '../types';

export interface CreatorFollowersProps {
  period: CreatorPeriod;
  count?: number;
}

export default function CreatorFollowers({ period, count = 0 }: CreatorFollowersProps) {
  void period;
  return (
    <section className="followers-grid">
      <article className="panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">AUDIÊNCIA</span>
            <h3>Seguidores</h3>
          </div>
        </div>
        <div className="big-number">
          {count} <small>seguidores</small>
        </div>
        <p className="chart-pending">Série histórica e distribuição demográfica em implementação — nenhum dado simulado.</p>
        <div className="chart-labels">
          <span>Total atual</span>
          <span>Hoje</span>
        </div>
      </article>
    </section>
  );
}
