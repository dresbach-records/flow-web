// FLOW — AdminAnalytics (FASE 6/8: dados reais + CSV real).
// KPIs calculados de coleções reais (usuários, posts, comunidades, denúncias).
// Métricas sem fonte (views, retenção, dispositivos) marcadas como pendentes —
// nenhum número simulado. Exportação CSV gera arquivo a partir dos dados reais.
import React, { useCallback, useEffect, useState } from 'react';
import { BarChart3, Users, FileText, UsersRound, ShieldAlert, Download } from 'lucide-react';
import { listDocuments } from '../../services/firebase/firestore';

interface Kpis {
  users: number;
  posts: number;
  communities: number;
  openReports: number;
  likes: number;
  comments: number;
}

const EMPTY: Kpis = { users: 0, posts: 0, communities: 0, openReports: 0, likes: 0, comments: 0 };

export const AdminAnalytics: React.FC = () => {
  const [kpis, setKpis] = useState<Kpis>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [users, posts, communities, reports] = await Promise.all([
        listDocuments('users', { max: 1000 }).catch(() => []),
        listDocuments<Record<string, unknown>>('posts', { max: 1000 }).catch(() => []),
        listDocuments('communities', { max: 1000 }).catch(() => []),
        listDocuments('reports', { field: 'status', value: 'OPEN', max: 1000 }).catch(() => []),
      ]);
      setKpis({
        users: users.length,
        posts: posts.length,
        communities: communities.length,
        openReports: reports.length,
        likes: posts.reduce((acc, p) => acc + (((p.likesCount as number) || (p.likes as number) || 0) as number), 0),
        comments: posts.reduce((acc, p) => acc + (((p.commentsCount as number) || (p.comments as number) || 0) as number), 0),
      });
    } catch {
      setLoadError('Não foi possível carregar as métricas. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const exportCsv = () => {
    const rows = [
      ['metrica', 'valor'],
      ['usuarios', String(kpis.users)],
      ['posts', String(kpis.posts)],
      ['comunidades', String(kpis.communities)],
      ['denuncias_abertas', String(kpis.openReports)],
      ['curtidas_totais', String(kpis.likes)],
      ['comentarios_totais', String(kpis.comments)],
      ['exportado_em', new Date().toISOString()],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { icon: Users, title: 'Usuários', value: String(kpis.users), hint: 'Base real do Firestore' },
    { icon: FileText, title: 'Publicações', value: String(kpis.posts), hint: 'Posts reais' },
    { icon: UsersRound, title: 'Comunidades', value: String(kpis.communities), hint: 'Comunidades reais' },
    { icon: ShieldAlert, title: 'Denúncias abertas', value: String(kpis.openReports), hint: 'Fila real de moderação' },
  ];

  return (
    <div>
      <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-title">
            <BarChart3 size={24} color="#6366f1" />
            <span>Métricas & Analytics da Plataforma</span>
          </h1>
          <p className="greeting-subtitle">
            Contagens reais das coleções do Firestore. Séries históricas chegam na Fase 8.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="admin-action-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={exportCsv}
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando métricas…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      {/* KPI Row */}
      <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {cards.map((c) => (
          <div className="admin-metric-card" key={c.title}>
            <div className="metric-header">
              <div className="metric-icon-box blue">
                <c.icon size={18} />
              </div>
              <span className="metric-title">{c.title}</span>
            </div>
            <div className="metric-value">{c.value}</div>
            <div className="metric-footer">
              <span>{c.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Engajamento agregado (real)</h3>
        </div>
        <p style={{ fontSize: 13, color: '#475569' }}>
          {kpis.likes} curtidas · {kpis.comments} comentários somados das publicações reais.
        </p>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>
          Visualizações, retenção D30 e distribuição por dispositivo: pendentes (Fase 8) — nenhum número simulado.
        </p>
      </div>
    </div>
  );
};
