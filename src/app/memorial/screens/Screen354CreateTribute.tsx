import { useState } from 'react';
import { Camera, CheckCircle2, Paperclip, Video } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen354CreateTribute({ onNavigate }: MemorialScreenProps) {
  const [msg, setMsg] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [sent, setSent] = useState(false);

  return (
    <div className="m354-form">
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Criar homenagem</h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>Compartilhe uma mensagem especial.</p>

      {sent ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Homenagem enviada com sucesso!</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Sua mensagem já está disponível no mural memorial.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(353)}>Ver homenagens</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Sua mensagem</label>
              <small style={{ color: '#94A3B8' }}>{msg.length}/500</small>
            </div>
            <textarea
              className="m-textarea"
              placeholder="Escreva aqui sua homenagem..."
              maxLength={500}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          <div className="m-form-group">
            <label>Adicionar mídia (opcional)</label>
            <div className="m-media-buttons">
              <button className="m-media-btn" type="button"><Camera size={18} /> Foto</button>
              <button className="m-media-btn" type="button"><Video size={18} /> Vídeo</button>
              <button className="m-media-btn" type="button"><Paperclip size={18} /> Arquivo</button>
            </div>
          </div>

          <div className="m-form-group">
            <label>Privacidade</label>
            <select
              className="m-select"
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="public">Pública (visível para todos)</option>
              <option value="friends">Apenas amigos conectados</option>
            </select>
          </div>

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            onClick={() => {
              if (msg.trim()) setSent(true);
            }}
          >
            Publicar homenagem
          </button>
        </>
      )}
    </div>
  );
}
