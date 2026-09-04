import React, { useState } from 'react';
import {
  Users,
  Activity,
  FileText,
  UsersRound,
  ShieldAlert,
  Trash2,
  TrendingUp,
  TrendingDown,
  Quote,
  CheckCircle2,
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

interface AdminDashboardProps {
  onNavigate: (route: AdminRouteId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [chartPeriod, setChartPeriod] = useState('30');

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
          <div className="metric-value">1.248.532</div>
          <div className="metric-footer">
            <span className="metric-delta up">
              <TrendingUp size={13} /> 12,5%
            </span>
            <span>+138.421 este mês</span>
          </div>
        </div>

        {/* 2. Usuários Ativos */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box green">
              <Activity size={18} />
            </div>
            <span className="metric-title">Usuários Ativos</span>
          </div>
          <div className="metric-value">892.341</div>
          <div className="metric-footer">
            <span className="metric-delta up">
              <TrendingUp size={13} /> 8,2%
            </span>
            <span>62% da base total</span>
          </div>
        </div>

        {/* 3. Posts */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box purple">
              <FileText size={18} />
            </div>
            <span className="metric-title">Posts</span>
          </div>
          <div className="metric-value">3.421.892</div>
          <div className="metric-footer">
            <span className="metric-delta up">
              <TrendingUp size={13} /> 15,3%
            </span>
            <span>+455.230 este mês</span>
          </div>
        </div>

        {/* 4. Comunidades */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box cyan">
              <UsersRound size={18} />
            </div>
            <span className="metric-title">Comunidades</span>
          </div>
          <div className="metric-value">12.843</div>
          <div className="metric-footer">
            <span className="metric-delta up">
              <TrendingUp size={13} /> 6,1%
            </span>
            <span>+742 este mês</span>
          </div>
        </div>

        {/* 5. Denúncias */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box red">
              <ShieldAlert size={18} />
            </div>
            <span className="metric-title">Denúncias</span>
          </div>
          <div className="metric-value">1.238</div>
          <div className="metric-footer">
            <span className="metric-delta down">
              <TrendingDown size={13} /> 4,5%
            </span>
            <span>312 em análise</span>
          </div>
        </div>

        {/* 6. Conteúdo Removido */}
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box orange">
              <Trash2 size={18} />
            </div>
            <span className="metric-title">Conteúdo Removido</span>
          </div>
          <div className="metric-value">892</div>
          <div className="metric-footer">
            <span className="metric-delta down">
              <TrendingDown size={13} /> 18,2%
            </span>
            <span>Hoje: 24 itens</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts and Platform Status */}
      <div className="admin-row-grid-2">
        {/* Card 1: Crescimento de Usuários (Line/Area Chart) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Users size={16} color="#6366f1" />
                <span>Crescimento de Usuários</span>
              </h3>
              <p className="admin-card-subtitle">Novos usuários nos últimos 30 dias</p>
            </div>
            <select
              className="admin-select"
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '10px' }}>
            {/* Tooltip demonstration badge */}
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: '52%',
                transform: 'translateX(-50%)',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '11.5px',
                zIndex: 5,
                textAlign: 'center',
              }}
            >
              <span style={{ color: '#64748b', display: 'block' }}>18 Mai</span>
              <strong style={{ color: '#0f172a' }}>24.532 novos usuários</strong>
            </div>

            {/* SVG Interactive Area Chart */}
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="userGrowthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />

              {/* Area fill */}
              <path
                d="M 0 140 Q 50 120, 100 130 T 200 95 T 265 60 T 350 100 T 430 85 T 500 45 L 500 170 L 0 170 Z"
                fill="url(#userGrowthGradient)"
              />

              {/* Line path */}
              <path
                d="M 0 140 Q 50 120, 100 130 T 200 95 T 265 60 T 350 100 T 430 85 T 500 45"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Peak indicator dot */}
              <circle cx="265" cy="60" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2.5" />
            </svg>

            {/* X-Axis labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#94a3b8',
                marginTop: '6px',
              }}
            >
              <span>1 Mai</span>
              <span>5 Mai</span>
              <span>10 Mai</span>
              <span>15 Mai</span>
              <span>20 Mai</span>
              <span>25 Mai</span>
              <span>30 Mai</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tipos de Conteúdo (Donut Chart) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <FileText size={16} color="#8b5cf6" />
                <span>Tipos de Conteúdo</span>
              </h3>
              <p className="admin-card-subtitle">Distribuição na plataforma</p>
            </div>
          </div>

          <div className="donut-widget">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Fotos 42% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="105 251" strokeDashoffset="0" />
                {/* Vídeos 28% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" strokeWidth="12" strokeDasharray="70 251" strokeDashoffset="-105" />
                {/* Textos 15% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="38 251" strokeDashoffset="-175" />
                {/* Stories 8% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="20 251" strokeDashoffset="-213" />
                {/* Links 4% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="10 251" strokeDashoffset="-233" />
                {/* Outros 3% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#94a3b8" strokeWidth="12" strokeDasharray="8 251" strokeDashoffset="-243" />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-value">3.4M</span>
                <span className="donut-center-label">publicações</span>
              </div>
            </div>

            <div className="donut-legend">
              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#3b82f6' }} />
                  <span>Fotos</span>
                </div>
                <span className="donut-legend-percent">42%</span>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#6366f1' }} />
                  <span>Vídeos</span>
                </div>
                <span className="donut-legend-percent">28%</span>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#8b5cf6' }} />
                  <span>Textos</span>
                </div>
                <span className="donut-legend-percent">15%</span>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#f59e0b' }} />
                  <span>Stories</span>
                </div>
                <span className="donut-legend-percent">8%</span>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#06b6d4' }} />
                  <span>Links</span>
                </div>
                <span className="donut-legend-percent">4%</span>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-left">
                  <span className="donut-legend-dot" style={{ backgroundColor: '#94a3b8' }} />
                  <span>Outros</span>
                </div>
                <span className="donut-legend-percent">3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Status da Plataforma */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                <span>Status da Plataforma</span>
              </h3>
              <p className="admin-card-subtitle">Última verificação: há 2 minutos</p>
            </div>
          </div>

          <div className="platform-status-list">
            <div className="status-row">
              <div className="status-row-info">
                <Server size={14} color="#64748b" />
                <span>API Backend</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Database size={14} color="#64748b" />
                <span>Banco de Dados</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Flame size={14} color="#f59e0b" />
                <span>Serviços Firebase</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <HardDrive size={14} color="#64748b" />
                <span>Armazenamento</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Bell size={14} color="#64748b" />
                <span>Sistema de Notificações</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>

            <div className="status-row">
              <div className="status-row-info">
                <Cpu size={14} color="#64748b" />
                <span>Fila de Processamento</span>
              </div>
              <span className="status-pill">Operacional</span>
            </div>
          </div>

          {/* Promo LTS Banner */}
          <div className="promo-lts-card">
            <h4>Flow LTS</h4>
            <p>Mais controle. Mais segurança. Mais pessoas felizes.</p>
            <button
              type="button"
              className="promo-lts-btn"
              onClick={() => onNavigate('sistema')}
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
            {[
              { name: 'Juliana Castro', handle: '@julianacastro', time: 'há 5 minutos', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
              { name: 'Rafael Lima', handle: '@rafaellima', time: 'há 12 minutos', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
              { name: 'Marina Souza', handle: '@marinasouza', time: 'há 28 minutos', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
              { name: 'Lucas Pereira', handle: '@lucaspereira', time: 'há 41 minutos', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
              { name: 'Fernanda Alves', handle: '@fealves', time: 'há 1 hora', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face' },
            ].map((u, i) => (
              <div key={i} className="activity-item">
                <img src={u.img} alt={u.name} className="activity-avatar" />
                <div className="activity-info">
                  <div className="activity-name">{u.name}</div>
                  <div className="activity-detail">{u.handle}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className="badge-tag novo">Novo</span>
                  <span className="activity-time">{u.time}</span>
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
            {[
              { type: 'Conteúdo impróprio', target: 'Post • @usuario123', time: 'há 12 minutos', badge: 'alta' },
              { type: 'Assédio', target: 'Comentário • @user_abcd', time: 'há 34 minutos', badge: 'alta' },
              { type: 'Discurso de ódio', target: 'Mensagem • @usuario_xyz', time: 'há 1 hora', badge: 'media' },
              { type: 'Spam', target: 'Comunidade • @comunidade123', time: 'há 2 horas', badge: 'baixa' },
              { type: 'Violação de direitos', target: 'Imagem • @usuario789', time: 'há 3 horas', badge: 'media' },
            ].map((d, i) => (
              <div key={i} className="activity-item">
                <div className="activity-info">
                  <div className="activity-name">{d.type}</div>
                  <div className="activity-detail">{d.target}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`badge-tag ${d.badge}`}>
                    {d.badge === 'alta' ? 'Alta' : d.badge === 'media' ? 'Média' : 'Baixa'}
                  </span>
                  <span className="activity-time">{d.time}</span>
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
            {[
              { action: 'Usuário suspenso', detail: '@user_infrator', time: 'há 15 minutos' },
              { action: 'Post removido', detail: 'ID: #845732', time: 'há 32 minutos' },
              { action: 'Comunidade arquivada', detail: '@comunidade_antiga', time: 'há 1 hora' },
              { action: 'Comentário ocultado', detail: 'ID: #934721', time: 'há 2 horas' },
              { action: 'Usuário verificado', detail: '@influencer_top', time: 'há 3 horas' },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-info">
                  <div className="activity-name">{a.action}</div>
                  <div className="activity-detail">{a.detail}</div>
                </div>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
