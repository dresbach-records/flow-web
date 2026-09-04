import React from 'react';
import './CTAButton.css';

export interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'outline' | 'primary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flow-cta-btn flow-cta-btn--${variant} flow-cta-btn--${size} ${
        fullWidth ? 'flow-cta-btn--full' : ''
      } ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flow-cta-btn__icon">{icon}</span>}
      <span className="flow-cta-btn__text">{children}</span>
      {icon && iconPosition === 'right' && <span className="flow-cta-btn__icon">{icon}</span>}
    </button>
  );
};

export default CTAButton;
