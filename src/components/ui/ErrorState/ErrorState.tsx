import './ErrorState.css';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function ErrorState({
  title = 'Algo não saiu como esperado',
  description,
  onRetry,
  retryLabel = 'Tentar novamente',
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flow-ui-error ${className}`} role="alert">
      <h2 className="flow-ui-error-title">{title}</h2>
      {description && <p className="flow-ui-error-description">{description}</p>}
      {onRetry && (
        <button type="button" className="flow-ui-error-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
