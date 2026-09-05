import { ChevronRight, Eye, Heart, TrendingUp, Users, Wallet } from 'lucide-react';
import { creatorVideos } from '../data';
import CreatorMetric from '../CreatorMetric';
import CreatorVideoRow from '../CreatorVideoRow';
import type { CreatorOverviewProps } from './CreatorOverview.types';

export default function CreatorOverview({ totals, period, onPeriodChange, chart, range, onRangeChange, onSeeAll }: CreatorOverviewProps) {
  return (
    <>
      <section className="metrics">
        <CreatorMetric icon={Eye} label="Visualizações" value={totals.views} delta={totals.delta} />
        <CreatorMetric icon={Users} label="Seguidores" value={totals.followers} delta={totals.fdelta} />
        <CreatorMetric icon={Wallet} label="Renda" value={totals.income} />
        <CreatorMetric icon={Heart} label="Curtidas" value={period === '7' ? '896' : '2.418'} delta={period === '7' ? '+14' : '+87'} />
      </section>
      <div className="period-row">
        <div>
          <button className={period === '7' ? 'active' : ''} onClick={() => onPeriodChange('7')}>
            7 dias
          </button>
          <button className={period === '30' ? 'active' : ''} onClick={() => onPeriodChange('30')}>
            30 dias
          </button>
        </div>
        <span>Atualizado agora</span>
      </div>
      <section className="analytics-grid">
        <article className="panel chart-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">DESEMPENHO</span>
              <h3>Visão geral das publicações</h3>
            </div>
            <select value={range} onChange={(e) => onRangeChange(e.target.value as CreatorOverviewProps['range'])}>
              <option value="views">Visualizações</option>
              <option value="likes">Curtidas</option>
            </select>
          </div>
          <div className="chart">
            <div className="chart-grid">
              <i />
              <i />
              <i />
              <i />
            </div>
            <svg viewBox="0 0 600 220" preserveAspectRatio="none">
              <polyline
                points={chart.map((v, i) => `${i * (600 / (chart.length - 1))},${210 - v * 2}`).join(' ')}
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="flowGrad">
                  <stop stopColor="#2663eb" />
                  <stop offset=".5" stopColor="#00d2be" />
                  <stop offset="1" stopColor="#f24882" />
                </linearGradient>
              </defs>
            </svg>
            <div className="chart-labels">
              <span>7 dias atrás</span>
              <span>Hoje</span>
            </div>
          </div>
        </article>
        <article className="panel insight">
          <div className="insight-icon">
            <TrendingUp />
          </div>
          <span className="eyebrow">INSIGHT FLOW</span>
          <h3>Seu conteúdo está ganhando alcance.</h3>
          <p>Continue publicando com consistência. Seus resultados recentes mostram evolução de visualizações e seguidores.</p>
          <button>
            Ver recomendações <ChevronRight />
          </button>
        </article>
      </section>
      <section className="panel quick-posts">
        <div className="panel-head">
          <div>
            <span className="eyebrow">PUBLICAÇÕES</span>
            <h3>Seus conteúdos recentes</h3>
          </div>
          <button onClick={onSeeAll}>
            Ver todos <ChevronRight />
          </button>
        </div>
        <div className="video-list">
          {creatorVideos.slice(0, 2).map((v) => (
            <CreatorVideoRow key={v.title} video={v} />
          ))}
        </div>
      </section>
    </>
  );
}
