import { useState } from 'react';
import type { MemorialScreenProps } from './types';

export default function Screen358LegacySettings(_props: MemorialScreenProps) {
  void _props;
  const [switches, setSwitches] = useState({
    memorialize: true,
    contact: true,
    posts: true,
    media: true,
    clearDMs: true,
    purgeAfterTime: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Configurações de Legado
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Defina o que deve acontecer com sua conta no futuro.
      </p>

      <div className="m358-switches">
        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Desejo que minha conta seja memorializada</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.memorialize} onChange={() => toggle('memorialize')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Indicar um contato de legado</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.contact} onChange={() => toggle('contact')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Permitir que minhas publicações permaneçam</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.posts} onChange={() => toggle('posts')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Permitir fotos e vídeos</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.media} onChange={() => toggle('media')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Remover minhas mensagens privadas</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.clearDMs} onChange={() => toggle('clearDMs')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Remover meus dados após determinado período</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.purgeAfterTime} onChange={() => toggle('purgeAfterTime')} />
            <span className="m-slider" />
          </label>
        </div>
      </div>

      <div className="m-form-group" style={{ marginBottom: 28 }}>
        <label>Contato de legado</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="m-input"
            placeholder="Nome e e-mail do contato"
            defaultValue="Mariana Silva (mariana.silva@email.com)"
            style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
          />
          <button className="m-btn-primary" type="button" style={{ padding: '10px 20px' }}>Adicionar</button>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        {saved ? 'Configurações salvas!' : 'Salvar configurações'}
      </button>
    </div>
  );
}
