import type { ReactNode } from 'react';
import { navigate } from '../../../hooks/useRouter';
import './FeatureCard.css';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  text: string;
  route: string;
}

export default function FeatureCard({ icon, title, text, route }: FeatureCardProps) {
  return (
    <button className="site-feature-card" onClick={() => navigate(route)} aria-label={`${title} — abrir`}>
      <span className="site-feature-icon" aria-hidden="true">
        {icon}
      </span>
      <strong>{title}</strong>
      <p>{text}</p>
    </button>
  );
}
