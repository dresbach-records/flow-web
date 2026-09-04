import React from 'react';

export interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flow-benefit-card">
      <div className="flow-benefit-card__icon">{icon}</div>
      <div className="flow-benefit-card__content">
        <h3 className="flow-benefit-card__title">{title}</h3>
        <p className="flow-benefit-card__desc">{description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
