// FLOW — AdminRelatorios (exportações CSV reais).
// Cada relatório é gerado a partir das coleções reais do Firestore.
import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { listDocuments } from '../../services/firebase/firestore';
import { listAuditEntries } from '../../services/firebase/audit';

type DatasetKey = 'users' | 'posts' | 'communities' | 'reports' | 'audit' | 'memorials';

const DATASETS: Array<{ key: DatasetKey; label: string; description: string }> = [
  { key: 'users', label: 'Usuários', description: 'Base de usuários (id, nome, e-mail, papel, status).' },
  { key: 'posts', label: 'Conteúdo', description: 'Publicações (id, autor, tipo, curtidas, comentários).' },
  { key: 'communities', label: 'Comunidades', description: 'Comunidades (id, nome, membros).' },
  { key: 'reports', label: 'Denúncias', description: 'Denúncias com status OPEN.' },
  { key: 'audit', label: 'Auditoria', description: 'Trilha de ações administrativas.' },
  { key: 'memorials', label: 'Memoriais', description: 'Solicitações de memorialização.' },
];

function toCsvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const AdminRelatorios: React.FC = () => {
  const [busyKey, setBusyKey] = useState<DatasetKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [doneKey, setDoneKey] = useState<DatasetKey | null>(null);

  const fetchRows = async (key: DatasetKey): Promise<Array<Record<string, string>>> => {
    switch (key) {
      case 'users': {
        const docs = await listDocuments<Record<string, unknown>>('users', { max: 1000 });
        return docs.map((d) => ({
          id: d.id,
          nome: typeof d.displayName === 'string' ? d.displayName : '',
          email: typeof d.email === 'string' ? d.email : '',
          papel: typeof d.role === 'string' ? d.role : 'user',
          status: d.status === 'suspended' ? 'suspended' : 'active',
        }));
      }
      case 'posts': {
        const docs = await listDocuments<Record<string, unknown>>('posts', { max: 1000 });
        return docs.map((d) => ({
          id: d.id,
          autor: typeof d.authorId === 'string' ? d.authorId : '',
          tipo: typeof d.type === 'string' ? d.type : '',
          curtidas: String((d.likesCount as number) ?? 0),
          comentarios: String((d.commentsCount as number) ?? 0),
        }));
      }
      case 'communities': {
        const docs = await listDocuments<Record<string, unknown>>('communities', { max: 1000 });
        return docs.map((d) => ({
          id: d.id,
          nome: typeof d.name === 'string' ? d.name : '',
          membros: String((d.memberCount as number) ?? 0),
        }));
      }
      case 'reports': {
        const docs = await listDocuments<Record<string, unknown>>('reports', { field: 'status', value: 'OPEN', max: 1000 });
        return docs.map((d) => ({
          id: d.id,
          categoria: typeof d.category === 'string' ? d.category : '',
          denunciante: typeof d.reporterId === 'string' ? d.reporterId : '',
        }));
      }
      case 'audit': {
        const entries = await listAuditEntries(500);
        return entries.map((e) => ({ id: e.id, admin: e.adminEmail || e.adminUid, acao: e.action, alvo: e.target }));
      }
      case 'memorials': {
        const docs = await listDocuments<Record<string, unknown>>('memorial_requests', { max: 1000 });
        return docs.map((d) => ({
          id: d.id,
          solicitante: typeof d.requesterName === 'string' ? d.requesterName : '',
          status: typeof d.status === 'string' ? d.status : 'PENDING',
        }));
      }
    }
  };

  const exportDataset = (key: DatasetKey) => {
    setError(null);
    setDoneKey(null);
    setBusyKey(key);
    void fetchRows(key)
      .then((rows) => {
        if (rows.length === 0) {
          setError('Sem registros para exportar neste conjunto.');
          return;
        }
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => toCsvCell(r[h])).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flow-${key}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setDoneKey(key);
      })
      .catch(() => setError('Falha ao gerar. Verifique a permissão administrativa.'))
      .finally(() => setBusyKey(null));
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <FileSpreadsheet size={24} color="#6366f1" />
          <span>Relatórios</span>
        </h1>
        <p className="greeting-subtitle">Exportações CSV geradas de dados reais (limite de 1000 registros).</p>
      </div>

      {error && (
        <div role="alert" style={{ padding: '10px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Conjunto</th>
              <th>Conteúdo</th>
              <th>Exportar</th>
            </tr>
          </thead>
          <tbody>
            {DATASETS.map((d) => (
              <tr key={d.key}>
                <td style={{ fontWeight: 700 }}>{d.label}</td>
                <td style={{ fontSize: '12.5px', color: '#64748b' }}>{d.description}</td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn"
                    disabled={busyKey !== null}
                    onClick={() => exportDataset(d.key)}
                    title={`Exportar ${d.label} em CSV`}
                  >
                    <Download size={14} />
                    <span style={{ marginLeft: 6 }}>{busyKey === d.key ? 'Gerando…' : doneKey === d.key ? 'Exportado ✓' : 'CSV'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
