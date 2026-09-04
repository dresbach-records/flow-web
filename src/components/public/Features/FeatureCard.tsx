import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  iconBgColor = '#EFF6FF',
  title,
  description,
  actionText = 'Saiba mais',
  onAction,
}) => {
  return (
    <div className="flow-feature-card">
      <div className="flow-feature-card__icon" style={{ background: iconBgColor }}>
        {icon}
      </div>
      <h3 className="flow-feature-card__title">{title}</h3>
      <p className="flow-feature-card__desc">{description}</p>
      {actionText && (
        <button
          type="button"
          className="flow-feature-card__action"
          onClick={onAction}
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

export default FeatureCard;
