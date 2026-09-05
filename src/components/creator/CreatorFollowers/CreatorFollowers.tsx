import type { CreatorPeriod } from '../types';

export interface CreatorFollowersProps {
  period: CreatorPeriod;
}

export default function CreatorFollowers({ period }: CreatorFollowersProps) {
  return (
    <section className="followers-grid">
      <article className="panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">AUDIÊNCIA</span>
            <h3>Crescimento de seguidores</h3>
          </div>
          <span className="positive">+{period === '7' ? '4' : '11'}</span>
        </div>
        <div className="big-number">
          {period === '7' ? '117' : '128'} <small>seguidores</small>
        </div>
        <div className="bars">
          {[35, 42, 38, 57, 51, 69, 82, 74, 91, 88, 95, 100].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="chart-labels">
          <span>Início</span>
          <span>Hoje</span>
        </div>
      </article>
      <article className="panel audience">
        <div className="panel-head">
          <div>
            <span className="eyebrow">DISTRIBUIÇÃO</span>
            <h3>Seu público</h3>
          </div>
        </div>
        <div className="donut">
          <div>
            <b>100%</b>
            <small>Brasil</small>
          </div>
        </div>
        <div className="audience-lines">
          <span>
            <i />
            Brasil <b>98%</b>
          </span>
          <span>
            <i />
            Outros <b>2%</b>
          </span>
        </div>
      </article>
    </section>
  );
}
