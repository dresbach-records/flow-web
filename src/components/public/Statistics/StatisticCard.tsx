import React from 'react';

export interface StatisticCardProps {
  value: string;
  label: string;
  subtitle: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  value,
  label,
  subtitle,
}) => {
  return (
    <div className="flow-stat-card">
      <div className="flow-stat-card__value">{value}</div>
      <div className="flow-stat-card__label">{label}</div>
      <div className="flow-stat-card__subtitle">{subtitle}</div>
    </div>
  );
};

export default StatisticCard;
