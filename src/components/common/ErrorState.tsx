export function ErrorState({ message = 'Não foi possível carregar este conteúdo.', onRetry }: { message?: string; onRetry?: () => void }) {
  return <div role="alert" className="flow-error"><p>{message}</p>{onRetry && <button type="button" onClick={onRetry}>Tentar novamente</button>}</div>;
}
