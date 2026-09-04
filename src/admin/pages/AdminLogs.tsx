import React, { useState } from 'react';
import { Terminal, Filter, RefreshCw, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  target: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}

const INITIAL_LOGS: LogItem[] = [
  { id: 'LOG-9921', timestamp: 'Hoje, 15:28:12', adminUser: 'carlos.mendes@flow.social', action: 'SUSPEND_USER', target: '@infrator_9 (USR-1019)', ip: '189.40.12.94', status: 'success' },
  { id: 'LOG-9920', timestamp: 'Hoje, 15:14:03', adminUser: 'carlos.mendes@flow.social', action: 'REMOVE_POST', target: 'Post #845732', ip: '189.40.12.94', status: 'success' },
  { id: 'LOG-9919', timestamp: 'Hoje, 14:52:45', adminUser: 'sistema.automod', action: 'QUARANTINE_MEDIA', target: 'Short #82929', ip: '127.0.0.1', status: 'warning' },
  { id: 'LOG-9918', timestamp: 'Hoje, 14:20:19', adminUser: 'carlos.mendes@flow.social', action: 'VERIFY_COMMUNITY', target: 'Criadores & Tech (@comunidade.tech)', ip: '189.40.12.94', status: 'success' },
  { id: 'LOG-9917', timestamp: 'Hoje, 13:45:00', adminUser: 'sistema.backup', action: 'FIREBASE_BACKUP', target: 'Firestore DB Users & Posts', ip: '10.0.4.12', status: 'success' },
  { id: 'LOG-9916', timestamp: 'Hoje, 12:11:34', adminUser: 'desconhecido', action: 'FAILED_ADMIN_LOGIN', target: 'Tentativa com senha incorreta', ip: '45.162.22.10', status: 'error' },
];

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = logs.filter((l) => statusFilter === 'all' || l.status === statusFilter);

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
          onClick={() => alert('Logs atualizados em tempo real do stream Firebase.')}
        >
          <RefreshCw size={14} />
          <span>Atualizar Stream</span>
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Filter size={16} color="#64748b" />
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="success">Sucesso</option>
              <option value="warning">Alerta</option>
              <option value="error">Falha / Erro</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID & Horário</th>
              <th>Operador</th>
              <th>Ação Executada</th>
              <th>Alvo da Ação</th>
              <th>Endereço IP</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{l.id}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{l.timestamp}</div>
                </td>
                <td style={{ fontWeight: 600, color: '#334155' }}>{l.adminUser}</td>
                <td>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                    {l.action}
                  </code>
                </td>
                <td style={{ color: '#0f172a', fontSize: '13px' }}>{l.target}</td>
                <td style={{ color: '#64748b', fontSize: '12px' }}>{l.ip}</td>
                <td>
                  <span className={`badge-tag ${l.status === 'success' ? 'novo' : l.status === 'error' ? 'alta' : 'media'}`}>
                    {l.status === 'success' ? 'Sucesso' : l.status === 'error' ? 'Falha' : 'Atenção'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
