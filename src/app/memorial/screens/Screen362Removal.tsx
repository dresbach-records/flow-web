// FLOW — Screen362Removal (FASE 5: dados reais).
// Solicitação de remoção via coleção `reports` (análise real da equipe).
import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { createDocument } from '../../../services/firebase/firestore';
import { requireFirebaseAuth } from '../../../services/firebase/config';

const REASONS = [
  'Decisão expressa da família imediata',
  'Vontade prévia do titular antes do falecimento',
  'Ordem judicial ou determinação legal',
];

export default function Screen362Removal({ onNavigate }: MemorialScreenProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = () => {
    setFormError(null);
    if (!reason) {
      setFormError('Selecione o motivo da solicitação.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Explique o motivo com pelo menos 10 caracteres.');
      return;
    }
    setSending(true);
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid) {
        setFormError('Faça login para enviar a solicitação.');
        setSending(false);
        return;
      }
      void createDocument('reports', {
        reporterId: uid,
        status: 'OPEN',
        category: `Remoção de memorial: ${reason}`,
        description: description.trim(),
        url: '/memorial/remocao',
      })
        .then((id) => setProtocol(id))
        .catch(() => setFormError('Não foi possível enviar. Tente novamente.'))
        .finally(() => setSending(false));
    } catch {
      setFormError('Faça login para enviar a solicitação.');
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Solicitar remoção do memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Se você acredita que este memorial deve ser removido, solicite uma análise.
      </p>

      {protocol ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Solicitação enviada</h3>
          <p style={{ fontWeight: 800, margin: '0 0 8px' }}>{protocol}</p>
          <p style={{ color: '#64748B', marginBottom: 24 }}>A análise jurídica será realizada com prioridade.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da solicitação</label>
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
            <label>Descrição</label>
            <textarea
              className="m-textarea"
              placeholder="Explique o motivo da solicitação..."
              style={{ minHeight: 120 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <AlertTriangle size={20} color="#EF4444" />
            <span style={{ fontSize: 14, color: '#B91C1C', fontWeight: 600 }}>
              Todas as solicitações serão analisadas pela nossa equipe.
            </span>
          </div>

          {formError && (
            <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{formError}</p>
          )}

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={sending}
            onClick={submit}
          >
            {sending ? 'Enviando…' : 'Enviar solicitação'}
          </button>
        </>
      )}
    </div>
  );
}
