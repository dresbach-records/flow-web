// FLOW — Screen361Report (FASE 5: dados reais).
// Denúncia de memorial via coleção `reports` (fila real de moderação).
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { createDocument } from '../../../services/firebase/firestore';
import { requireFirebaseAuth } from '../../../services/firebase/config';

const REASONS = [
  'Perfil falso ou falsa memorialização',
  'Conteúdo ofensivo ou desrespeitoso',
  'Violação de privacidade da família',
  'Outro motivo',
];

export default function Screen361Report({ onNavigate }: MemorialScreenProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = () => {
    setFormError(null);
    if (!reason) {
      setFormError('Selecione o motivo da denúncia.');
      return;
    }
    setSending(true);
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid) {
        setFormError('Faça login para enviar uma denúncia.');
        setSending(false);
        return;
      }
      void createDocument('reports', {
        reporterId: uid,
        status: 'OPEN',
        category: `Memorial: ${reason}`,
        description: description.trim() || reason,
        url: '/memorial/denunciar',
      })
        .then((id) => setProtocol(id))
        .catch(() => setFormError('Não foi possível enviar. Tente novamente.'))
        .finally(() => setSending(false));
    } catch {
      setFormError('Faça login para enviar uma denúncia.');
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Denunciar memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Ajude-nos a manter um ambiente seguro e respeitoso.
      </p>

      {protocol ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Denúncia recebida</h3>
          <p style={{ color: '#64748B', marginBottom: 8 }}>Protocolo:</p>
          <p style={{ fontWeight: 800, margin: '0 0 24px' }}>{protocol}</p>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Nossa equipe de moderação irá avaliar.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da denúncia</label>
            <select
              className="m-select"
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Selecione o motivo...</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="m-form-group">
            <label>Descrição (opcional)</label>
            <textarea
              className="m-textarea"
              placeholder="Descreva o motivo da denúncia..."
              style={{ minHeight: 110 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {formError && (
            <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{formError}</p>
          )}

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            disabled={sending}
            onClick={submit}
          >
            {sending ? 'Enviando…' : 'Enviar denúncia'}
          </button>
        </>
      )}
    </div>
  );
}
