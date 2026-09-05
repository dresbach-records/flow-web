// FLOW — InstallAppPrompt (MEGA §29: componente reutilizável real).
// Usa o evento real beforeinstallprompt; dispensa = preferência de UI local.
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePwaInstall } from '../../../hooks/usePwaInstall';

const DISMISS_KEY = 'flow.pwa.dismissed';

export default function InstallAppPrompt() {
  const { canInstall, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      /* sem storage: exibe quando instalável */
    }
  }, []);

  if (!canInstall || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* preferência de UI: falha silenciosa */
    }
  };

  const doInstall = () => {
    setBusy(true);
    void install().finally(() => setBusy(false));
  };

  return (
    <div
      role="dialog"
      aria-label="Instalar o FLOW"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 99999,
        maxWidth: 320,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 12px 32px rgba(15,23,42,0.16)',
      }}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dispensar instalação"
        style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}
      >
        <X size={16} />
      </button>
      <strong style={{ display: 'block', fontSize: 15, color: '#0F172A', marginBottom: 4 }}>
        Instale o FLOW
      </strong>
      <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#64748B', lineHeight: 1.45 }}>
        Tenha uma experiência mais rápida e completa no seu celular.
      </p>
      <button
        type="button"
        onClick={doInstall}
        disabled={busy}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {busy ? 'Aguarde…' : 'Instalar FLOW'}
      </button>
    </div>
  );
}
