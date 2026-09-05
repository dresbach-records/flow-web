import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, error, loading, clearError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <img src="/logo.png" alt="FLOW Logo" />
          <span className="sidebar-lts-badge">ADMIN LTS</span>
        </div>

        <div className="admin-login-header">
          <h1>Painel Administrativo</h1>
          <p>Área restrita de controle e moderação da plataforma FLOW.</p>
        </div>

        {error && (
          <div className="admin-error-alert">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-form-label">E-mail Administrativo</label>
            <div className="admin-input-wrap">
              <input
                type="email"
                required
                className="admin-input"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Senha de Acesso</label>
            <div className="admin-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
              />
              <button
                type="button"
                className="admin-input-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Alternar visibilidade da senha"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={submitting || loading}
          >
            {submitting ? 'Autenticando via Firebase...' : 'Entrar no Control Center'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="admin-login-notice">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6, fontWeight: 600, color: '#0f172a' }}>
            <CheckCircle2 size={15} color="#16a34a" />
            <span>Autenticação Firebase Integrada</span>
          </div>
          <p style={{ margin: 0 }}>
            Utilize as credenciais de administrador cadastradas no Firebase Authentication do projeto.
            O acesso é controlado por papel (role) validado pelo backend e pelas regras do Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};
