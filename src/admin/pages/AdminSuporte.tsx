// FLOW — AdminSuporte (recursos de conta, dados reais).
// Fila de `appeals` com decisão persistida (regra: update admin só em status)
// + trilha em `admin_audit`.
import React, { useCallback, useEffect, useState } from 'react';
import { LifeBuoy, CheckCircle, X } from 'lucide-react';
import { listDocuments, updateDocument } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';

interface Appeal {
  id: string;
  ticketId: string;
  email: string;
  reason: string;
  details: string;
  status: string;
}

export const AdminSuporte: React.FC = () => {
  const [rows, setRows] = useState<Appeal[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('appeals', { max: 100 });
      setRows(
        docs.map((d) => ({
          id: d.id,
          ticketId: typeof d.ticketId === 'string' ? d.ticketId : d.id,
          email: typeof d.email === 'string' ? d.email : '—',
          reason: typeof d.reason === 'string' ? d.reason : '—',
          details: typeof d.details === 'string' ? d.details : '',
          status: typeof d.status === 'string' ? d.status : 'PENDING',
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar os recursos. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const decide = (id: string, ticket: string, status: 'RESOLVED' | 'REJECTED') => {
    const previous = rows;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    void updateDocument('appeals', id, { status })
      .then(() => {
        showToast(`Recurso ${ticket}: ${status === 'RESOLVED' ? 'atendido' : 'indeferido'}.`);
        void logAdminAction(status === 'RESOLVED' ? 'RESOLVE_APPEAL' : 'REJECT_APPEAL', `Appeal ${ticket}`);
      })
      .catch(() => {
        setRows(previous);
        showToast('Falha ao decidir. Verifique a permissão.');
      });
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <LifeBuoy size={24} color="#6366f1" />
          <span>Suporte — Recursos de Conta</span>
        </h1>
        <p className="greeting-subtitle">Fila real de recursos (contas bloqueadas, suspensas, desativadas).</p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando recursos…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>E-mail</th>
              <th>Motivo & Detalhes</th>
              <th>Status</th>
              <th>Decisão</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhum recurso pendente.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700 }}>{r.ticketId}</td>
                <td style={{ fontSize: '12.5px' }}>{r.email}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.reason}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.details}</div>
                </td>
                <td>
                  <span className={`badge-tag ${r.status === 'PENDING' ? 'media' : r.status === 'RESOLVED' ? 'novo' : 'alta'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" className="admin-action-btn" onClick={() => decide(r.id, r.ticketId, 'RESOLVED')} title="Atender recurso">
                        <CheckCircle size={14} />
                      </button>
                      <button type="button" className="admin-action-btn danger" onClick={() => decide(r.id, r.ticketId, 'REJECTED')} title="Indeferir recurso">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Decidido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
