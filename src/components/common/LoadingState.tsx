export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return <div role="status" aria-live="polite" className="flow-loading">{label}</div>;
}
