// FLOW — AdminDashboard (FASE 6: dados reais).
// Contagens e listas do Firestore; status do backend via /health real.
// Séries históricas sem fonte completa marcadas como parciais — sem números simulados.
import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  Activity,
  FileText,
  UsersRound,
  ShieldAlert,
  Trash2,
  Quote,
  ArrowRight,
  Server,
  Database,
  Flame,
  HardDrive,
  Bell,
  Cpu,
  Sparkles,
} from 'lucide-react';
import type { AdminRouteId } from '../components/AdminSidebar';
import { listDocuments } from '../../services/firebase/firestore';
import { listAuditEntries, type AuditEntry } from '../../services/firebase/audit';
import { getApiBaseUrl } from '../../services/api/client';
import { firebaseDiagnostics } from '../../services/firebase/config';

interface AdminDashboardProps {
  onNavigate: (route: AdminRouteId) => void;
}

interface DashboardData {
  users: number;
  posts: number;
  communities: number;
  openReports: number;
  recentUsers: Array<{ id: string; name: string; detail: string; avatar: string }>;
  recentReports: Array<{ id: string; category: string; reporter: string }>;
  recentActions: AuditEntry[];
  postsByType: Array<{ type: string; count: number; percent: number }>;
}

const EMPTY_DATA: DashboardData = {
  users: 0,
  posts: 0,
  communities: 0,
  openReports: 0,
  recentUsers: [],
  recentReports: [],
  recentActions: [],
  postsByType: [],
};

function formatName(d: Record<string, unknown>): string {
  return (typeof d.displayName === 'string' && d.displayName) || 'Usuário';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [users, posts, communities, reports, audit] = await Promise.all([
        listDocuments<Record<string, unknown>>('users', { max: 1000 }).catch(() => []),
        listDocuments<Record<string, unknown>>('posts', { orderByField: 'createdAt', direction: 'desc', max: 200 }).catch(() => []),
        listDocuments('communities', { max: 1000 }).catch(() => []),
        listDocuments<Record<string, unknown>>('reports', { field: 'status', value: 'OPEN', max: 100 }).catch(() => []),
        listAuditEntries(5).catch(() => []),
      ]);
      const byType = new Map<string, number>();
      posts.forEach((p) => {
        const t = typeof p.type === 'string' ? p.type : 'post';
        byType.set(t, (byType.get(t) ?? 0) + 1);
      });
      const total = Math.max(posts.length, 1);
      setData({
        users: users.length,
        posts: posts.length,
        communities: communities.length,
        openReports: reports.length,
        recentUsers: users.slice(0, 5).map((u) => ({
          id: u.id,
          name: formatName(u),
          detail: (typeof u.email === 'string' && u.email) || u.id,
          avatar: (typeof u.photoURL === 'string' && u.photoURL) || '/logo.png',
        })),
        recentReports: reports.slice(0, 5).map((r) => ({
          id: r.id,
          category: typeof r.category === 'string' ? r.category : 'Denúncia',
          reporter: typeof r.reporterId === 'string' ? r.reporterId : '—',
        })),
        recentActions: audit,
        postsByType: [...byType.entries()].map(([type, count]) => ({
          type,
          count,
          percent: Math.round((count / total) * 100),
        })),
      });
    } catch {
      setLoadError('Não foi possível carregar o painel. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    const base = getApiBaseUrl();
    if (!base) {
      setBackendStatus('fail');
      return;
    }
    const root = base.replace(/\/api\/v1\/?$/, '');
    void fetch(`${root}/health`, { signal: AbortSignal.timeout(8000) })
      .then((res) => {
        if (!cancelled) setBackendStatus(res.ok ? 'ok' : 'fail');
      })
      .catch(() => {
        if (!cancelled) setBackendStatus('fail');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metric = (value: number) => value.toLocaleString('pt-BR');

  return (
    <div className="admin-dashboard-page">
      {/* Greeting */}
      <div className="greeting-section">
        <h1 className="greeting-title">
          Olá, Admin <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="greeting-subtitle">
          Aqui está um resumo do que está acontecendo na sua plataforma hoje.
        </p>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando painel…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="admin-hero-banner">
        <div className="hero-content">
          <div className="hero-title-prefix">Bem-vindo ao</div>
          <h2 className="hero-main-title">Painel Administrativo da Flow</h2>
          <p className="hero-description">
            Gerencie, proteja e impulsione uma comunidade mais segura e inspiradora.
          </p>
          <div
            style={{
              marginTop: '16px',
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif",
              fontSize: '18px',
              color: '#fbcfe8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Pessoas • Histórias • Impacto • Sempre 💕
          </div>
        </div>

        <div className="hero-quote-card">
          <Quote size={20} color="#c7d2fe" style={{ marginBottom: '8px' }} />
          <p className="hero-quote-text">
            “Uma rede social melhor começa com decisões conscientes todos os dias.”
          </p>
          <div className="hero-quote-author">— Equipe Flow</div>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="admin-metrics-grid">
        {/* 1. Usuários Totais */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box blue">
              <Users size={18} />
            </div>
            <span className="metric-title">Usuários Totais</span>
          </div>
          <div className="metric-value">{metric(data.users)}</div>
          <div className="metric-footer">
            <span>Base real do Firestore</span>
          </div>
        </div>

        {/* 2. Publicações */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box green">
              <Activity size={18} />
            </div>
            <span className="metric-title">Publicações</span>
          </div>
          <div className="metric-value">{metric(data.posts)}</div>
          <div className="metric-footer">
            <span>Posts reais (últimos 200)</span>
          </div>
        </div>

        {/* 3. Comunidades */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box purple">
              <FileText size={18} />
            </div>
            <span className="metric-title">Comunidades</span>
          </div>
          <div className="metric-value">{metric(data.communities)}</div>
          <div className="metric-footer">
            <span>Comunidades reais</span>
          </div>
        </div>

        {/* 4. Denúncias abertas */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box cyan">
              <UsersRound size={18} />
            </div>
            <span className="metric-title">Denúncias abertas</span>
          </div>
          <div className="metric-value">{metric(data.openReports)}</div>
          <div className="metric-footer">
            <span>Fila real de moderação</span>
          </div>
        </div>

        {/* 5. Ações auditadas */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box red">
              <ShieldAlert size={18} />
            </div>
            <span className="metric-title">Ações auditadas</span>
          </div>
          <div className="metric-value">{metric(data.recentActions.length)}</div>
          <div className="metric-footer">
            <span>Trilha real (últimas 5)</span>
          </div>
        </div>

        {/* 6. Tipos de conteúdo */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box orange">
              <Trash2 size={18} />
            </div>
            <span className="metric-title">Tipos de conteúdo</span>
          </div>
          <div className="metric-value">{metric(data.postsByType.length)}</div>
          <div className="metric-footer">
            <span>Distribuição real abaixo</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts and Platform Status */}
      <div className="admin-row-grid-2">
        {/* Card 1: Tipos de Conteúdo (Donut real) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <FileText size={16} color="#8b5cf6" />
                <span>Tipos de Conteúdo</span>
              </h3>
              <p className="admin-card-subtitle">Distribuição real dos posts</p>
            </div>
          </div>

          {data.postsByType.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Sem publicações para distribuir ainda.</p>
          ) : (
            <div className="donut-legend">
              {data.postsByType.map((row) => (
                <div className="donut-legend-item" key={row.type}>
                  <div className="donut-legend-left">
                    <span className="donut-legend-dot" style={{ backgroundColor: '#6366f1' }} />
                    <span style={{ textTransform: 'capitalize' }}>{row.type}</span>
                  </div>
                  <span className="donut-legend-percent">{row.percent}% ({row.count})</span>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 12, color: '#94a3b8' }}>
            Séries históricas de crescimento: pendentes (Fase 8) — nenhum dado simulado.
          </p>
        </div>

        {/* Card 2: Status da Plataforma (checks reais) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: backendStatus === 'ok' ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
                <span>Status da Plataforma</span>
              </h3>
              <p className="admin-card-subtitle">Verificação real de serviços</p>
            </div>
          </div>

          <div className="platform-status-list">
            <div className="status-row">
              <div className="status-row-info">
                <Server size={14} color="#64748b" />
                <span>API Backend (/health)</span>
              </div>
              <span className="status-pill">
                {backendStatus === 'checking' ? 'Verificando…' : backendStatus === 'ok' ? 'Operacional' : 'Inacessível'}
              </span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Database size={14} color="#64748b" />
                <span>Banco de Dados</span>
              </div>
              <span className="status-pill">{loadError ? 'Falha de leitura' : 'Leitura OK'}</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Flame size={14} color="#f59e0b" />
                <span>Firebase Auth</span>
              </div>
              <span className="status-pill">
                {firebaseDiagnostics.apiKeyConfigured ? 'Configurado' : 'Não configurado'}
              </span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <HardDrive size={14} color="#64748b" />
                <span>Armazenamento</span>
              </div>
              <span className="status-pill">Via Firebase Storage</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Bell size={14} color="#64748b" />
                <span>Notificações</span>
              </div>
              <span className="status-pill">Coleção por usuário</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Cpu size={14} color="#64748b" />
                <span>Guardian (moderação IA)</span>
              </div>
              <span className="status-pill">Ver /health do backend</span>
            </div>
          </div>

          {/* Promo LTS Banner */}
          <div className="promo-lts-card">
            <h4>Flow LTS</h4>
            <p>Mais controle. Mais segurança. Mais pessoas felizes.</p>
            <button
              type="button"
              className="promo-lts-btn"
              onClick={() => onNavigate('sistema' as AdminRouteId)}
            >
              <span>Ver novidades</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: 3-Column Activities Grid */}
      <div className="admin-activities-grid">
        {/* Col 1: Usuários Recentes */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Users size={16} color="#6366f1" />
                <span>Usuários Recentes</span>
              </h3>
            </div>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => onNavigate('usuarios')}
            >
              Ver todos
            </button>
          </div>

          <div className="activity-list">
            {data.recentUsers.length === 0 && (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Nenhum usuário carregado.</p>
            )}
            {data.recentUsers.map((u) => (
              <div key={u.id} className="activity-item">
                <img src={u.avatar} alt={u.name} className="activity-avatar" />
                <div className="activity-info">
                  <div className="activity-name">{u.name}</div>
                  <div className="activity-detail">{u.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Denúncias Recentes */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <ShieldAlert size={16} color="#ef4444" />
                <span>Denúncias Recentes</span>
              </h3>
            </div>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => onNavigate('moderacao')}
            >
              Ver todas
            </button>
          </div>

          <div className="activity-list">
            {data.recentReports.length === 0 && (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Nenhuma denúncia aberta.</p>
            )}
            {data.recentReports.map((d) => (
              <div key={d.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-name">{d.category}</div>
                  <div className="activity-detail">{d.id} • {d.reporter}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Ações Administrativas */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Activity size={16} color="#10b981" />
                <span>Ações Administrativas</span>
              </h3>
            </div>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => onNavigate('logs')}
            >
              Ver histórico
            </button>
          </div>

          <div className="activity-list">
            {data.recentActions.length === 0 && (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Nenhuma ação registrada ainda.</p>
            )}
            {data.recentActions.map((a) => (
              <div key={a.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-name">{a.action}</div>
                  <div className="activity-detail">{a.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={12} /> Séries temporais e comparativos mensais: pendentes (Fase 8).
      </p>
    </div>
  );
};
