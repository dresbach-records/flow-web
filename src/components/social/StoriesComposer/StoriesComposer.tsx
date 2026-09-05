// FLOW — StoriesComposer (publicação real de story com foto, expira em 24h).
import React, { useRef, useState } from 'react';
import { uploadMedia } from '../../../services/firebase/storage';
import { createStory } from '../../../services/firebase/stories';
import { requireFirebaseAuth } from '../../../services/firebase/config';

export default function StoriesComposer({ onPublished }: { onPublished: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (selected: File | undefined) => {
    if (!selected) return;
    setError(null);
    if (!selected.type.startsWith('image/')) {
      setError('Selecione uma foto.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('A foto deve ter no máximo 10 MB.');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const publish = () => {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const uid = requireFirebaseAuth().currentUser?.uid;
        if (!uid) throw new Error('Faça login para continuar.');
        const uploaded = await uploadMedia(`users/${uid}/stories`, file);
        await createStory({ mediaUrl: uploaded.url });
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        onPublished();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível publicar.');
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: 16, color: '#0F172A' }}>Novo story</h2>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => pick(e.target.files?.[0])}
        aria-label="Selecionar foto do story"
      />
      {preview ? (
        <img src={preview} alt="Prévia do story" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: '100%', padding: 22, borderRadius: 12, border: '1px dashed #CBD5E1', background: '#F8FAFC', color: '#475569', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}
        >
          Selecionar foto
        </button>
      )}
      {error && <p role="alert" style={{ margin: '0 0 8px 0', fontSize: 13, color: '#B91C1C' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        {preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
          >
            Trocar
          </button>
        )}
        <button
          type="button"
          onClick={publish}
          disabled={!file || busy}
          style={{ padding: '9px 22px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 13.5, cursor: !file || busy ? 'not-allowed' : 'pointer', opacity: !file || busy ? 0.6 : 1 }}
        >
          {busy ? 'Publicando…' : 'Publicar (24h)'}
        </button>
      </div>
    </div>
  );
}
