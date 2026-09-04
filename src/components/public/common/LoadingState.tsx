import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  size?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  size = 28,
  className = '',
}) => {
  return (
    <div
      className={`flow-state flow-state--loading ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: 12,
        color: '#64748B',
      }}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={size} style={{ animation: 'flow-spin 1s linear infinite', color: '#3B82F6' }} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default LoadingState;
