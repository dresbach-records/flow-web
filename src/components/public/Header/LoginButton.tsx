import React from 'react';

export interface LoginButtonProps {
  onClick: () => void;
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      className={`flow-header-login-btn ${className}`}
      onClick={onClick}
    >
      Entrar
    </button>
  );
};

export default LoginButton;
