import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[FLOW] Erro de runtime não tratado.', error, info.componentStack);
  }

  private reload = () => window.location.reload();

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: 'var(--flow-background, #f7f9fc)',
          color: 'var(--flow-text, #172033)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <section
          style={{
            width: 'min(560px, 100%)',
            padding: 28,
            borderRadius: 20,
            background: 'var(--flow-surface, #fff)',
            border: '1px solid var(--flow-border, #e5e7eb)',
            boxShadow: '0 18px 50px rgba(15, 23, 42, .10)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 24 }}>A Flow encontrou um problema</h1>
          <p style={{ margin: '12px 0 20px', lineHeight: 1.6, color: 'var(--flow-text-secondary, #667085)' }}>
            A aplicação continua protegida contra tela branca. Recarregue a página para tentar novamente.
          </p>
          <button
            type="button"
            onClick={this.reload}
            style={{
              border: 0,
              borderRadius: 12,
              padding: '11px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #2563eb, #8b3dff, #f21bb4)',
              color: '#fff',
            }}
          >
            Recarregar Flow
          </button>
        </section>
      </main>
    );
  }
}
