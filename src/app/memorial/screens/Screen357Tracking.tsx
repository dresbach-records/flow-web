// FLOW — Screen357Tracking (FASE 5: dados reais).
// Acompanhamento pelo protocolo real; timeline derivada do status.
// Sem "simular aprovação".
import { useState } from 'react';
import { CheckCircle2, Clock, Info, Search, XCircle } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { getMemorialRequest, type MemorialRequest } from '../../../services/firebase/memorial';
import { LAST_PROTOCOL_KEY } from './Screen356Verification';

function statusLabel(status: MemorialRequest['status']): string {
  if (status === 'APPROVED') return 'Aprovada';
  if (status === 'REJECTED') return 'Recusada';
  return 'Em análise';
}

export default function Screen357Tracking({ onNavigate }: MemorialScreenProps) {
  const [protocol, setProtocol] = useState(() => {
    try {
      return localStorage.getItem(LAST_PROTOCOL_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [request, setRequest] = useState<MemorialRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (!protocol.trim()) {
      setError('Informe o protocolo recebido no envio.');
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    void getMemorialRequest(protocol)
      .then((found) => {
        setRequest(found);
        if (!found) setError('Protocolo não encontrado ou sem permissão de leitura.');
      })
      .catch(() => {
        setRequest(null);
        setError('Não foi possível consultar. Verifique sua conexão.');
      })
      .finally(() => setLoading(false));
  };

  const decided = request?.status === 'APPROVED' || request?.status === 'REJECTED';

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Acompanhamento da Solicitação
      </h2>
      <p style={{ margin: '0 0 24px', color: '#64748B', fontSize: 15 }}>
        Consulte pelo protocolo recebido no envio.
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 13 }} />
          <input
            type="text"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            placeholder="Protocolo"
            style={{ width: '100%', height: 42, padding: '0 12px 0 38px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
        <button className="m-btn-primary" disabled={loading} onClick={search}>
          {loading ? 'Consultando…' : 'Consultar'}
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: '#B91C1C', fontSize: 14 }}>{error}</p>
      )}

      {searched && !loading && !error && request && (
        <>
          <div className="m357-timeline">
            <div className="m357-step-item">
              <div className="m357-line" />
              <div className="m357-icon completed"><CheckCircle2 size={20} /></div>
              <div>
                <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>Solicitação enviada</strong>
                <small style={{ color: '#64748B' }}>{request.requesterName}</small>
              </div>
            </div>

            <div className="m357-step-item">
              <div className="m357-line" />
              <div className={`m357-icon ${decided ? 'completed' : 'current'}`}>
                {decided ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              </div>
              <div>
                <strong style={{ fontSize: 15, color: decided ? '#0F172A' : '#3B82F6', display: 'block' }}>
                  {statusLabel(request.status)}
                </strong>
                {!decided && (
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#475569' }}>
                    Nossa equipe está analisando. Prazo médio: até 3 dias úteis.
                  </p>
                )}
                {request.status === 'REJECTED' && (
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <XCircle size={16} color="#EF4444" /> A solicitação não foi aprovada.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Info size={20} color="#0284C7" />
            <span style={{ fontSize: 14, color: '#0369A1' }}>
              Você será notificado por e-mail e na Flow sobre o resultado da análise.
            </span>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="m-btn-secondary" onClick={() => onNavigate(351)}>Voltar ao início</button>
      </div>
    </div>
  );
}
