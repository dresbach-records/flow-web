import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({ message = 'Carregando…', className = '' }: LoadingStateProps) {
  return (
    <div className={`flow-ui-loading ${className}`} role="status" aria-live="polite">
      <span className="flow-ui-loading-spinner" aria-hidden="true" />
      <span className="flow-ui-loading-message">{message}</span>
    </div>
  );
}
