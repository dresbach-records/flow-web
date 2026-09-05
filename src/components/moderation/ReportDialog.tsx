// FLOW — ReportDialog (denúncia real via backend POST /api/v1/reports).
// Corpo completo exigido pelo backend (reporterId/targetType/targetId/category).
import { useState } from 'react';
import { apiRequest } from '../../services/api/client';
import { requireFirebaseAuth } from '../../services/firebase/config';

const reasons = ['Pirataria ou falsificação', 'Golpe ou fraude', 'Conteúdo sexual', 'Violência', 'Produto proibido', 'Outro'];

export function ReportDialog({ targetId, onClose }: { targetId: string; onClose: () => void }) {
  const [reason, setReason] = useState(reasons[0]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid) throw new Error('Faça login para denunciar.');
      await apiRequest({
        path: '/api/v1/reports',
        method: 'POST',
        body: { reporterId: uid, targetType: 'post', targetId, category: reason },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Denunciar publicação"
      style={{
        position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,23,42,0.65)', padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, maxWidth: 420, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 12px 0', fontSize: 18, color: '#0F172A' }}>Denunciar</h2>
        {done ? (
          <p style={{ color: '#065F46' }}>Denúncia enviada com sucesso.</p>
        ) : (
          <>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 12 }}
            >
              {reasons.map((r) => <option key={r}>{r}</option>)}
            </select>
            {error && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
            <button
              disabled={sending}
              onClick={() => void submit()}
              style={{ width: '100%', padding: '10px 16px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {sending ? 'Enviando…' : 'Enviar denúncia'}
            </button>
          </>
        )}
        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: 8, padding: '10px 16px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
