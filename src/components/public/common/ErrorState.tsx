import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import CTAButton from './CTAButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu uma instabilidade',
  message = 'Não foi possível carregar as informações. Verifique sua conexão e tente novamente.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flow-state flow-state--error ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 24px',
        gap: 12,
        borderRadius: 16,
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        maxWidth: 480,
        margin: '0 auto',
      }}
      role="alert"
    >
      <AlertCircle size={32} color="#EF4444" />
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#991B1B' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>{message}</p>
      {onRetry && (
        <CTAButton
          size="sm"
          variant="outline"
          onClick={onRetry}
          icon={<RefreshCw size={14} />}
          iconPosition="left"
          style={{ marginTop: 6 }}
        >
          Tentar novamente
        </CTAButton>
      )}
    </div>
  );
};

export default ErrorState;
