// FLOW — AdminLogs (FASE 6: dados reais).
// Trilha de auditoria de `admin_audit` (ações administrativas reais com autor e
// data do Firestore). Sem logs fictícios, sem IP inventado, sem alert().
import React, { useCallback, useEffect, useState } from 'react';
import { Terminal, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import { listAuditEntries, type AuditEntry } from '../../services/firebase/audit';

function formatDate(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('pt-BR');
    }
  } catch {
    /* sem data */
  }
  return '—';
}

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setLogs(await listAuditEntries());
    } catch {
      setLoadError('Não foi possível carregar a trilha. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const actions = Array.from(new Set(logs.map((l) => l.action))).sort();
  const filtered = logs.filter((l) => actionFilter === 'all' || l.action === actionFilter);

  return (
    <div>
      <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-title">
            <Terminal size={24} color="#6366f1" />
            <span>Logs de Auditoria & Segurança</span>
          </h1>
          <p className="greeting-subtitle">
            Trilha de auditoria em tempo real de todas as ações administrativas realizadas no FLOW.
          </p>
        </div>

        <button
          type="button"
          className="admin-action-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => reload()}
        >
          <RefreshCw size={14} />
          <span>Atualizar</span>
        </button>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando trilha…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Filter size={16} color="#64748b" />
            <select
              className="admin-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">Todas as Ações</option>
              {actions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Data & Hora</th>
              <th>Operador</th>
              <th>Ação Executada</th>
              <th>Alvo da Ação</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhuma ação administrativa registrada ainda.
                </td>
              </tr>
            )}
            {filtered.map((l) => (
              <tr key={l.id}>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(l.createdAt)}</td>
                <td style={{ fontWeight: 600, color: '#334155' }}>{l.adminEmail || l.adminUid}</td>
                <td>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                    {l.action}
                  </code>
                </td>
                <td style={{ color: '#0f172a', fontSize: '13px' }}>{l.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
