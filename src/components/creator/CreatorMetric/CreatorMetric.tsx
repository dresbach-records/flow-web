import type { CreatorMetricProps } from './CreatorMetric.types';

export default function CreatorMetric({ icon: Icon, label, value, delta }: CreatorMetricProps) {
  return (
    <article className="metric">
      <span>
        <Icon />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {delta && <em>{delta}</em>}
      </div>
    </article>
  );
}
