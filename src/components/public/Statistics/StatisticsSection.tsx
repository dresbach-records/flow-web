import React from 'react';
import StatisticCard from './StatisticCard';
import './Statistics.css';

export interface StatisticsSectionProps {
  stats?: Array<{
    value: string;
    label: string;
    subtitle: string;
  }>;
}

export const DEFAULT_STATS = [
  {
    value: '1M+',
    label: 'Usuários Ativos',
    subtitle: 'Pessoas reais conectadas todos os dias',
  },
  {
    value: '50K+',
    label: 'Comunidades',
    subtitle: 'Grupos dos mais variados temas',
  },
  {
    value: '10M+',
    label: 'Publicações por Mês',
    subtitle: 'Histórias, fotos e momentos compartilhados',
  },
  {
    value: '99.9%',
    label: 'Tempo de Atividade',
    subtitle: 'Infraestrutura rápida, estável e segura',
  },
];

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  stats = DEFAULT_STATS,
}) => {
  return (
    <section className="flow-stats-section" aria-label="Estatísticas da Rede Flow">
      <div className="flow-stats-container">
        <div className="flow-stats-grid">
          {stats.map((s) => (
            <StatisticCard
              key={s.label}
              value={s.value}
              label={s.label}
              subtitle={s.subtitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
