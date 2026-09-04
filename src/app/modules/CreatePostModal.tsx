import React, { useState, useRef } from 'react';
import { Image, Video, Smile, MapPin, X, Loader2, Sparkles } from 'lucide-react';
import { createPost, uploadPostMedia } from '../../services/firebase/social';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreated }: CreatePostModalProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tag, setTag] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError(null);
    const url = URL.createObjectURL(selected);
    setFilePreview(url);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    const trimmed = text.trim();
    if (!trimmed && !file) {
      setError('Por favor, escreva um texto ou anexe uma foto/vídeo.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      let mediaResult = null;
      let mediaType: 'text' | 'image' | 'video' = 'text';

      if (file) {
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        mediaResult = await uploadPostMedia(file);
      }

      const finalText = tag ? `${trimmed}\n\n#${tag}` : trimmed;

      await createPost({
        text: finalText,
        type: mediaType,
        media: mediaResult,
      });

      setText('');
      handleRemoveFile();
      setTag('');
      if (onCreated) onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao publicar';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flow-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="flow-modal-card" style={{
        background: '#FFFFFF',
        borderRadius: 20,
        maxWidth: 580,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E2E8F0'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#2563EB" />
            <strong style={{ fontSize: 16, color: '#0F172A', fontWeight: 700 }}>Criar Publicação</strong>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              fontSize: 13,
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="No que você está pensando hoje? Compartilhe com a comunidade FLOW..."
            rows={4}
            style={{
              width: '100%',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: 14,
              fontSize: 15,
              color: '#0F172A',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              boxSizing: 'border-box'
            }}
          />

          {filePreview && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', maxHeight: 240, background: '#0F172A' }}>
              {file?.type.startsWith('video/') ? (
                <video src={filePreview} controls style={{ width: '100%', height: 'auto', maxHeight: 240 }} />
              ) : (
                <img src={filePreview} alt="Preview" style={{ width: '100%', height: 240, objectFit: 'cover' }} />
              )}
              <button
                onClick={handleRemoveFile}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Tag Selector */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Tópico:</span>
            {['tecnologia', 'musica', 'criatividade', 'fotografia', 'estilo', 'comunidade'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? '' : t)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: tag === t ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: tag === t ? '#EFF6FF' : '#F8FAFC',
                  color: tag === t ? '#2563EB' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                #{t}
              </button>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            style={{ display: 'none' }}
          />

          {/* Media bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            background: '#F8FAFC'
          }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Adicionar à sua publicação:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Foto ou Imagem"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}
              >
                <Image size={20} color="#2563EB" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Vídeo"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}
              >
                <Video size={20} color="#EA580C" />
              </button>
              <button
                type="button"
                onClick={() => setText(prev => prev + ' 😊')}
                title="Emoji"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}
              >
                <Smile size={20} color="#D97706" />
              </button>
              <button
                type="button"
                onClick={() => setText(prev => prev + ' 📍 São Paulo, Brasil')}
                title="Localização"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}
              >
                <MapPin size={20} color="#EC4899" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={busy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 24px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.7 : 1
            }}
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <span>Publicar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
