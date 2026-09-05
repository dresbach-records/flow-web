// FLOW — Screen358LegacySettings (FASE 5: dados reais).
// Preferências de legado persistidas no perfil (`users/{uid}`).
import { useEffect, useState } from 'react';
import type { MemorialScreenProps } from './types';
import {
  DEFAULT_LEGACY,
  loadLegacySettings,
  saveLegacySettings,
  type LegacySettings,
} from '../../../services/firebase/memorial';

const ROWS: Array<{ key: keyof LegacySettings; label: string }> = [
  { key: 'memorialize', label: 'Desejo que minha conta seja memorializada' },
  { key: 'legacyContact', label: 'Indicar um contato de legado' },
  { key: 'keepPosts', label: 'Permitir que minhas publicações permaneçam' },
  { key: 'keepMedia', label: 'Permitir fotos e vídeos' },
  { key: 'clearDMs', label: 'Remover minhas mensagens privadas' },
  { key: 'purgeAfterTime', label: 'Remover meus dados após determinado período' },
];

export default function Screen358LegacySettings(_props: MemorialScreenProps) {
  void _props;
  const [switches, setSwitches] = useState<LegacySettings>(DEFAULT_LEGACY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadLegacySettings()
      .then((s) => {
        if (!cancelled) setSwitches(s);
      })
      .catch(() => {
        if (!cancelled) setSwitches(DEFAULT_LEGACY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (key: keyof LegacySettings) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const save = () => {
    setError(null);
    setSaving(true);
    void saveLegacySettings(switches)
      .then(() => setSaved(true))
      .catch(() => setError('Não foi possível salvar. Verifique sua conexão.'))
      .finally(() => setSaving(false));
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Configurações de Legado
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Defina o que deve acontecer com sua conta no futuro.
      </p>

      {loading && <p style={{ color: '#64748B', fontSize: 14 }}>Carregando preferências…</p>}

      {!loading && (
        <>
          <div className="m358-switches">
            {ROWS.map(({ key, label }) => (
              <div className="m358-switch-row" key={key}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{label}</span>
                <label className="m-switch">
                  <input type="checkbox" checked={switches[key]} onChange={() => toggle(key)} />
                  <span className="m-slider" />
                </label>
              </div>
            ))}
          </div>

          {error && (
            <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{error}</p>
          )}

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={saving}
            onClick={save}
          >
            {saving ? 'Salvando…' : saved ? 'Configurações salvas!' : 'Salvar configurações'}
          </button>
        </>
      )}
    </div>
  );
}
