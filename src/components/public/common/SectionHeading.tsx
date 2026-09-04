import React from 'react';
import './SectionHeading.css';

export interface SectionHeadingProps {
  id?: string;
  tag?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  tag,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  return (
    <div id={id} className={`flow-section-heading flow-section-heading--${align} ${className}`}>
      {tag && <span className="flow-section-heading__tag">{tag}</span>}
      <h2 className="flow-section-heading__title">{title}</h2>
      {subtitle && <p className="flow-section-heading__subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
