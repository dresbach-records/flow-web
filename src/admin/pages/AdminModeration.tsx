// FLOW — AdminModeration (FASE 6: dados reais).
// Fila de `reports` com status OPEN. Resolver/descartar persiste de verdade;
// remoção de conteúdo usa AdminContent; banimento via suspensão em Usuários.
// Trilha em `admin_audit`. Sem denúncias fictícias.
import React, { useCallback, useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, X } from 'lucide-react';
import { listDocuments, updateDocument } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';

interface ReportItem {
  id: string;
  category: string;
  description: string;
  reporterId: string;
  url: string | null;
  createdAt: unknown;
}

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

export const AdminModeration: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('reports', {
        field: 'status',
        value: 'OPEN',
        max: 100,
      });
      setReports(
        docs.map((d) => ({
          id: d.id,
          category: typeof d.category === 'string' ? d.category : 'Denúncia',
          description: typeof d.description === 'string' ? d.description : '',
          reporterId: typeof d.reporterId === 'string' ? d.reporterId : '—',
          url: typeof d.url === 'string' ? d.url : null,
          createdAt: d.createdAt,
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar as denúncias. Conta sem permissão ou sem conexão.');
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

  const resolve = (id: string, status: 'RESOLVED' | 'DISMISSED') => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    void updateDocument('reports', id, { status })
      .then(() => {
        showToast(`Denúncia ${id}: ${status === 'RESOLVED' ? 'resolvida' : 'descartada'}.`);
        void logAdminAction(status === 'RESOLVED' ? 'RESOLVE_REPORT' : 'DISMISS_REPORT', `Report ${id}`);
      })
      .catch(() => {
        showToast('Falha ao atualizar. Recarregando fila…');
        void reload();
      });
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <ShieldAlert size={24} color="#ef4444" />
          <span>Fila de Moderação e Denúncias</span>
        </h1>
        <p className="greeting-subtitle">
          Gerenciamento proativo de segurança e conformidade da comunidade FLOW.
        </p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando denúncias…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
              Denúncias Pendentes ({reports.length})
            </span>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID & Categoria</th>
              <th>Descrição</th>
              <th>Denunciante & URL</th>
              <th>Recebido</th>
              <th>Ações Imediatas</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && reports.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhuma denúncia pendente no momento! A comunidade está em conformidade.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.id}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.category}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{r.description}</div>
                  </td>

                  <td>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.reporterId}</div>
                    {r.url && <div style={{ fontSize: '11.5px', color: '#6366f1' }}>{r.url}</div>}
                  </td>

                  <td style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(r.createdAt)}</td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => resolve(r.id, 'RESOLVED')}
                        title="Marcar como resolvida"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn danger"
                        onClick={() => resolve(r.id, 'DISMISSED')}
                        title="Descartar denúncia"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
