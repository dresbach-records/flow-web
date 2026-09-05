// FLOW — Screen356Verification (FASE 5: dados reais).
// Envia solicitação real de memorialização (protocolo = ID do documento).
import { useRef, useState } from 'react';
import { Calendar, CheckCircle2, Upload } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { createMemorialRequest } from '../../../services/firebase/memorial';
import { uploadMedia } from '../../../services/firebase/storage';
import { requireFirebaseAuth } from '../../../services/firebase/config';

export const LAST_PROTOCOL_KEY = 'flow.memorial.lastProtocol';

export default function Screen356Verification({ onNavigate }: MemorialScreenProps) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const attach = async (file: File | undefined) => {
    if (!file) return;
    setFormError(null);
    setUploading(true);
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid) throw new Error('Faça login para continuar.');
      const result = await uploadMedia(`users/${uid}/memorial-docs`, file);
      setDocUrl(result.url);
    } catch {
      setFormError('Não foi possível enviar o documento. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    setFormError(null);
    setSending(true);
    void createMemorialRequest({ requesterName: name, relationship: relation, deceasedDate: date, docUrl })
      .then((id) => {
        setProtocol(id);
        try {
          localStorage.setItem(LAST_PROTOCOL_KEY, id);
        } catch {
          /* sem storage local: protocolo exibido na tela */
        }
      })
      .catch((err: unknown) => setFormError(err instanceof Error ? err.message : 'Não foi possível enviar.'))
      .finally(() => setSending(false));
  };

  if (protocol) {
    return (
      <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>Solicitação enviada</h2>
        <p style={{ color: '#64748B', marginBottom: 8 }}>Guarde seu protocolo para acompanhar a análise:</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 24px' }}>{protocol}</p>
        <button className="m-btn-primary" onClick={() => onNavigate(357)}>Acompanhar solicitação</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Verificação da solicitação
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Para garantir a segurança, precisamos de algumas informações.
      </p>

      <div className="m-form-group">
        <label>Nome do solicitante</label>
        <input
          type="text"
          className="m-input"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        />
      </div>

      <div className="m-form-group">
        <label>Relação com o usuário falecido</label>
        <select
          className="m-select"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        >
          <option value="">Selecione...</option>
          <option value="parent">Familiar de 1º grau (Cônjuge, Filho, Pai/Mãe)</option>
          <option value="relative">Outro familiar</option>
          <option value="legal">Representante legal / inventariante</option>
          <option value="friend">Amigo próximo</option>
        </select>
      </div>

      <div className="m-form-group">
        <label>Data do falecimento</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="m-input"
            placeholder="DD / MM / AAAA"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
          />
          <Calendar size={18} color="#94A3B8" style={{ position: 'absolute', right: 12, top: 14 }} />
        </div>
      </div>

      <div className="m-form-group">
        <label>Documentação comprobatória</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => void attach(e.target.files?.[0])}
        />
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: '24px 16px', textAlign: 'center', background: '#F8FAFC' }}>
          <Upload size={28} color="#8B5CF6" style={{ marginBottom: 8 }} />
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#475569' }}>
            Certidão de óbito, notícia, obituário ou documento oficial.
          </p>
          <button className="m-btn-secondary" type="button" disabled={uploading} style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => fileRef.current?.click()}>
            {uploading ? 'Enviando…' : docUrl ? 'Documento anexado ✓' : 'Selecionar arquivo'}
          </button>
        </div>
      </div>

      {formError && (
        <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{formError}</p>
      )}

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
        disabled={sending || uploading}
        onClick={submit}
      >
        {sending ? 'Enviando…' : 'Enviar para análise'}
      </button>
    </div>
  );
}
