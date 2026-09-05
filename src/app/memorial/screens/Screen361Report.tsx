import { useState } from 'react';
import { Camera, CheckCircle2, Paperclip, Video } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen361Report({ onNavigate }: MemorialScreenProps) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Denunciar memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Ajude-nos a manter um ambiente seguro e respeitoso.
      </p>

      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Denúncia recebida</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Nossa equipe de moderação irá avaliar as evidências apresentadas.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da denúncia</label>
            <select className="m-select" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}>
              <option value="">Selecione o motivo...</option>
              <option value="fake">Perfil falso ou falsa memorialização</option>
              <option value="hate">Conteúdo ofensivo ou desrespeitoso</option>
              <option value="privacy">Violação de privacidade da família</option>
              <option value="other">Outro motivo</option>
            </select>
          </div>

          <div className="m-form-group">
            <label>Descrição (opcional)</label>
            <textarea className="m-textarea" placeholder="Descreva o motivo da denúncia..." style={{ minHeight: 110 }} />
          </div>

          <div className="m-form-group">
            <label>Adicionar evidências (opcional)</label>
            <div className="m-media-buttons">
              <button className="m-media-btn" type="button"><Camera size={18} /> Foto</button>
              <button className="m-media-btn" type="button"><Video size={18} /> Vídeo</button>
              <button className="m-media-btn" type="button"><Paperclip size={18} /> Arquivo</button>
            </div>
          </div>

          <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setDone(true)}>
            Enviar denúncia
          </button>
        </>
      )}
    </div>
  );
}
