import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, ArrowUpRight, Calendar, Download } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div>
      <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-title">
            <BarChart3 size={24} color="#6366f1" />
            <span>Métricas & Analytics da Plataforma</span>
          </h1>
          <p className="greeting-subtitle">
            Análise detalhada de crescimento, engajamento, retenção e consumo de mídia.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="admin-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 3 meses</option>
            <option value="1y">Este ano</option>
          </select>

          <button
            type="button"
            className="admin-action-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => alert('Relatório analítico exportado com sucesso em CSV.')}
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box blue">
              <Eye size={18} />
            </div>
            <span className="metric-title">Visualizações Totais</span>
          </div>
          <div className="metric-value">18.7M</div>
          <div className="metric-footer">
            <span className="metric-delta up"><TrendingUp size={13} /> 21,6%</span>
            <span>vs mês anterior</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box purple">
              <Heart size={18} />
            </div>
            <span className="metric-title">Taxa de Engajamento</span>
          </div>
          <div className="metric-value">14.2%</div>
          <div className="metric-footer">
            <span className="metric-delta up"><TrendingUp size={13} /> 3,4%</span>
            <span>Média da rede</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box green">
              <Users size={18} />
            </div>
            <span className="metric-title">Retenção D30</span>
          </div>
          <div className="metric-value">68.4%</div>
          <div className="metric-footer">
            <span className="metric-delta up"><TrendingUp size={13} /> 5,1%</span>
            <span>Cohorts de novos usuários</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <div className="metric-icon-box orange">
              <MessageCircle size={18} />
            </div>
            <span className="metric-title">Interações Diárias</span>
          </div>
          <div className="metric-value">2.14M</div>
          <div className="metric-footer">
            <span className="metric-delta up"><TrendingUp size={13} /> 11,8%</span>
            <span>Curtidas, comentários e shares</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="admin-row-grid-2" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        {/* Engagement Trend */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <TrendingUp size={16} color="#6366f1" />
              <span>Volume de Engajamento por Dia</span>
            </h3>
          </div>

          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingTop: '20px' }}>
            {[34, 42, 51, 48, 62, 75, 84, 91, 88, 96, 110, 105, 120, 134, 128, 142, 155, 168, 160, 175, 190, 185, 204, 215, 220, 238, 245, 260].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(v / 260) * 100}%`,
                  background: i >= 24 ? 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)' : '#e0e7ff',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                  cursor: 'pointer',
                }}
                title={`Dia ${i + 1}: ${v}k interações`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
            <span>Início do Mês</span>
            <span>Meio do Período</span>
            <span>Hoje (Pico)</span>
          </div>
        </div>

        {/* Device breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Distribuição por Dispositivo</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Mobile Android</span>
                <span style={{ color: '#6366f1', fontWeight: 700 }}>58%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', background: '#6366f1', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Mobile iOS</span>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>34%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '34%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Web Desktop</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>8%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
