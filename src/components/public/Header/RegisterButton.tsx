import React from 'react';

export interface RegisterButtonProps {
  onClick: () => void;
  className?: string;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      className={`flow-header-register-btn ${className}`}
      onClick={onClick}
    >
      Criar conta
    </button>
  );
};

export default RegisterButton;
