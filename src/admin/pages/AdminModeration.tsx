import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Trash2, Eye, Flag } from 'lucide-react';

interface ReportItem {
  id: string;
  type: string;
  reason: string;
  reporter: string;
  target: string;
  severity: 'alta' | 'media' | 'baixa';
  time: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: '#DEN-1042',
    type: 'Post',
    reason: 'Conteúdo impróprio / Violação de diretrizes',
    reporter: '@carlos_88',
    target: 'Post #82929 (@infrator_9)',
    severity: 'alta',
    time: 'há 12 min',
    status: 'pending',
  },
  {
    id: '#DEN-1041',
    type: 'Comentário',
    reason: 'Assédio direcionado e ofensas graves',
    reporter: '@maria_silva',
    target: 'Comentário em Live #402',
    severity: 'alta',
    time: 'há 34 min',
    status: 'pending',
  },
  {
    id: '#DEN-1040',
    type: 'Mensagem',
    reason: 'Discurso de ódio e discriminação',
    reporter: '@lucas_tech',
    target: 'Chat da Comunidade Devs',
    severity: 'media',
    time: 'há 1 hora',
    status: 'pending',
  },
  {
    id: '#DEN-1039',
    type: 'Comunidade',
    reason: 'Spam comercial e links suspeitos',
    reporter: '@ana_digital',
    target: 'Comunidade "Ganhos Rápidos"',
    severity: 'baixa',
    time: 'há 2 horas',
    status: 'pending',
  },
  {
    id: '#DEN-1038',
    type: 'Foto de Perfil',
    reason: 'Falsa identidade de personalidade pública',
    reporter: '@flow_oficial',
    target: 'Perfil @fake_flow',
    severity: 'media',
    time: 'há 3 horas',
    status: 'pending',
  },
];

export const AdminModeration: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (id: string, actionName: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setToast(`Denúncia ${id}: ação "${actionName}" aplicada.`);
    setTimeout(() => setToast(null), 3000);
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
              <th>ID & Tipo</th>
              <th>Motivo & Detalhes</th>
              <th>Alvo da Denúncia</th>
              <th>Severidade</th>
              <th>Recebido</th>
              <th>Ações Imediatas</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhuma denúncia pendente no momento! A comunidade está em conformidade.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.id}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.type}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{r.reason}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Reportado por: {r.reporter}</div>
                  </td>

                  <td style={{ fontWeight: 600, color: '#334155' }}>{r.target}</td>

                  <td>
                    <span className={`badge-tag ${r.severity}`}>
                      {r.severity === 'alta' ? 'Alta' : r.severity === 'media' ? 'Média' : 'Baixa'}
                    </span>
                  </td>

                  <td style={{ fontSize: '12px', color: '#64748b' }}>{r.time}</td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="admin-action-btn danger"
                        onClick={() => handleAction(r.id, 'Conteúdo Removido')}
                        title="Remover Conteúdo"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="admin-action-btn danger"
                        onClick={() => handleAction(r.id, 'Usuário Suspenso')}
                        title="Suspender / Banir Autor"
                      >
                        <Ban size={14} />
                      </button>

                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleAction(r.id, 'Denúncia Ignorada')}
                        title="Descartar Denúncia"
                      >
                        <CheckCircle size={14} />
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
