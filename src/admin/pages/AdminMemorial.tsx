// FLOW — AdminMemorial (moderação de memoriais, dados reais).
// Solicitações de `memorial_requests` com aprovação/rejeição persistidas
// (regra: update admin só em status) + trilha em `admin_audit`.
import React, { useCallback, useEffect, useState } from 'react';
import { HeartHandshake, CheckCircle, X } from 'lucide-react';
import { listDocuments, updateDocument } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';
import type { MemorialRequestStatus } from '../../services/firebase/memorial';

interface MemorialRow {
  id: string;
  requesterName: string;
  relationship: string;
  deceasedDate: string;
  status: MemorialRequestStatus;
}

export const AdminMemorial: React.FC = () => {
  const [rows, setRows] = useState<MemorialRow[]>([]);
  const [filter, setFilter] = useState<'ALL' | MemorialRequestStatus>('ALL');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('memorial_requests', { max: 100 });
      setRows(
        docs.map((d) => ({
          id: d.id,
          requesterName: typeof d.requesterName === 'string' ? d.requesterName : '—',
          relationship: typeof d.relationship === 'string' ? d.relationship : '—',
          deceasedDate: typeof d.deceasedDate === 'string' ? d.deceasedDate : '—',
          status: d.status === 'APPROVED' ? 'APPROVED' : d.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar as solicitações. Conta sem permissão ou sem conexão.');
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

  const decide = (id: string, status: MemorialRequestStatus) => {
    const previous = rows;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    void updateDocument('memorial_requests', id, { status })
      .then(() => {
        showToast(`Solicitação ${id}: ${status === 'APPROVED' ? 'aprovada' : 'rejeitada'}.`);
        void logAdminAction(status === 'APPROVED' ? 'APPROVE_MEMORIAL' : 'REJECT_MEMORIAL', `MemorialRequest ${id}`);
      })
      .catch(() => {
        setRows(previous);
        showToast('Falha ao decidir. Verifique a permissão.');
      });
  };

  const filtered = rows.filter((r) => filter === 'ALL' || r.status === filter);

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <HeartHandshake size={24} color="#6366f1" />
          <span>Moderação de Memoriais</span>
        </h1>
        <p className="greeting-subtitle">Análise, aprovação e rejeição de solicitações com persistência real.</p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando solicitações…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendentes</option>
            <option value="APPROVED">Aprovadas</option>
            <option value="REJECTED">Rejeitadas</option>
          </select>
          <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} solicitações</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Solicitante</th>
              <th>Relação</th>
              <th>Status</th>
              <th>Decisão</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  Nenhuma solicitação encontrada.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700 }}>{r.id}</td>
                <td>{r.requesterName}</td>
                <td style={{ fontSize: '12px' }}>{r.relationship}</td>
                <td>
                  <span className={`badge-tag ${r.status === 'APPROVED' ? 'novo' : r.status === 'REJECTED' ? 'alta' : 'media'}`}>
                    {r.status === 'APPROVED' ? 'Aprovada' : r.status === 'REJECTED' ? 'Rejeitada' : 'Pendente'}
                  </span>
                </td>
                <td>
                  {r.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" className="admin-action-btn" onClick={() => decide(r.id, 'APPROVED')} title="Aprovar memorial">
                        <CheckCircle size={14} />
                      </button>
                      <button type="button" className="admin-action-btn danger" onClick={() => decide(r.id, 'REJECTED')} title="Rejeitar solicitação">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Decidida</span>
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
