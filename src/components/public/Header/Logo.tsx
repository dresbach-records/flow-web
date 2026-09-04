import React from 'react';

export interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flow-logo-btn ${className}`}
      aria-label="FLOW — Ir para página inicial"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <img
        src="/flow-logo.svg"
        alt="FLOW"
        style={{ height: 38, width: 'auto', display: 'block', objectFit: 'contain' }}
      />
    </button>
  );
};

export default Logo;
