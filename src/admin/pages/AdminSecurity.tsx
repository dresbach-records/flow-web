import React from 'react';
import { Lock, ShieldCheck, Key, AlertOctagon, Terminal, Smartphone } from 'lucide-react';
import { firebaseDiagnostics } from '../../services/firebase/config';

export const AdminSecurity: React.FC = () => {
  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <Lock size={24} color="#6366f1" />
          <span>Segurança & Auditoria do Sistema</span>
        </h1>
        <p className="greeting-subtitle">
          Parâmetros de autenticação, diagnósticos do Firebase e integridade operacional.
        </p>
      </div>

      <div className="admin-row-grid-2" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
        {/* Firebase Auth Diagnostics Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <ShieldCheck size={18} color="#16a34a" />
              <span>Diagnóstico do Firebase Auth</span>
            </h3>
          </div>

          <div className="platform-status-list">
            <div className="status-row">
              <span>API Key Configurada</span>
              <span className="status-pill" style={{ backgroundColor: firebaseDiagnostics.apiKeyConfigured ? '#dcfce7' : '#fee2e2', color: firebaseDiagnostics.apiKeyConfigured ? '#15803d' : '#b91c1c' }}>
                {firebaseDiagnostics.apiKeyConfigured ? 'Válida' : 'Ausente / Demo'}
              </span>
            </div>

            <div className="status-row">
              <span>Project ID</span>
              <span className="status-pill" style={{ backgroundColor: firebaseDiagnostics.projectIdConfigured ? '#dcfce7' : '#fee2e2', color: firebaseDiagnostics.projectIdConfigured ? '#15803d' : '#b91c1c' }}>
                {firebaseDiagnostics.projectIdConfigured ? 'Conectado' : 'Não Configurado'}
              </span>
            </div>

            <div className="status-row">
              <span>App ID</span>
              <span className="status-pill" style={{ backgroundColor: firebaseDiagnostics.appIdConfigured ? '#dcfce7' : '#fee2e2', color: firebaseDiagnostics.appIdConfigured ? '#15803d' : '#b91c1c' }}>
                {firebaseDiagnostics.appIdConfigured ? 'Vinculado' : 'Não Vinculado'}
              </span>
            </div>

            <div className="status-row">
              <span>Criptografia de Sessão</span>
              <span className="status-pill">Ativa (TLS / SHA-256)</span>
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Key size={18} color="#6366f1" />
              <span>Políticas de Acesso Administrativo</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Exigência de Senha Forte</strong>
                <p style={{ margin: 0, color: '#64748b', fontSize: '11.5px' }}>Mínimo de 8 caracteres e caracteres especiais</p>
              </div>
              <span className="status-pill">Ativado</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Bloqueio por Tentativas Excessivas</strong>
                <p style={{ margin: 0, color: '#64748b', fontSize: '11.5px' }}>Trava temporária após 5 falhas consecutivas</p>
              </div>
              <span className="status-pill">Ativado</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Autenticação de Dois Fatores (2FA)</strong>
                <p style={{ margin: 0, color: '#64748b', fontSize: '11.5px' }}>Obrigatório para contas com papel Super Admin</p>
              </div>
              <span className="status-pill">Obrigatório</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
