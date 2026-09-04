import React from 'react';
import './IconButton.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'soft' | 'outline' | 'solid';
  'aria-label': string;
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  variant = 'ghost',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flow-icon-btn flow-icon-btn--${size} flow-icon-btn--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
