// FLOW — Screen354CreateTribute (FASE 5: dados reais).
// Publica homenagem no Firestore (texto 1..500 + foto/vídeo opcional via Storage).
import { useRef, useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { DEFAULT_MEMORIAL_ID, createTribute } from '../../../services/firebase/memorial';
import { uploadMedia } from '../../../services/firebase/storage';
import { requireFirebaseAuth } from '../../../services/firebase/config';

export default function Screen354CreateTribute({ onNavigate }: MemorialScreenProps) {
  const [msg, setMsg] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const attach = async (file: File | undefined) => {
    if (!file) return;
    setFormError(null);
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setFormError('Selecione uma foto ou vídeo.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setFormError('O arquivo deve ter no máximo 100 MB.');
      return;
    }
    setUploading(true);
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid) throw new Error('Faça login para continuar.');
      const result = await uploadMedia(`users/${uid}/tributes`, file);
      setMediaUrl(result.url);
    } catch {
      setFormError('Não foi possível enviar a mídia. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const publish = () => {
    setFormError(null);
    if (!msg.trim()) {
      setFormError('Escreva sua homenagem antes de publicar.');
      return;
    }
    setSending(true);
    void createTribute({ memorialId: DEFAULT_MEMORIAL_ID, text: msg, mediaUrl })
      .then((id) => setProtocol(id))
      .catch((err: unknown) => setFormError(err instanceof Error ? err.message : 'Não foi possível publicar.'))
      .finally(() => setSending(false));
  };

  return (
    <div className="m354-form">
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Criar homenagem</h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>Compartilhe uma mensagem especial. As homenagens são públicas.</p>

      {protocol ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Homenagem publicada!</h3>
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
            <label>Foto ou vídeo (opcional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={(e) => void attach(e.target.files?.[0])}
            />
            <div className="m-media-buttons">
              <button className="m-media-btn" type="button" disabled={uploading} onClick={() => fileRef.current?.click()}>
                <Camera size={18} /> {uploading ? 'Enviando…' : mediaUrl ? 'Trocar mídia' : 'Anexar'}
              </button>
            </div>
            {mediaUrl && <small style={{ color: '#10B981' }}>Mídia anexada.</small>}
          </div>

          {formError && (
            <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{formError}</p>
          )}

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            disabled={sending || uploading}
            onClick={publish}
          >
            {sending ? 'Publicando…' : 'Publicar homenagem'}
          </button>
        </>
      )}
    </div>
  );
}
