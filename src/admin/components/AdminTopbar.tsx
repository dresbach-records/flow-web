import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Search, Bell, LayoutGrid, ChevronDown, LogOut, Shield, User as UserIcon, ExternalLink } from 'lucide-react';

interface AdminTopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flow-admin-topbar">
      {/* Brand & Logo - Parte fixa no topo à esquerda */}
      <div className="topbar-brand-section">
        <img src="/logo.png" alt="FLOW Logo" className="topbar-brand-logo" />
        <span className="topbar-brand-title">Flow</span>
        <span className="sidebar-lts-badge">LTS</span>
        <span className="topbar-brand-sub">CONTROL CENTER</span>
      </div>

      {/* Search Bar */}
      <div className="topbar-search-wrapper">
        <Search className="topbar-search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="topbar-search-input"
          placeholder="Pesquisar usuários, posts, comunidades, denúncias..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="topbar-search-kbd">
          <span>Ctrl</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Side Items */}
      <div className="topbar-actions">
        {/* Brand Tagline in script font */}
        <span className="topbar-tagline">
          Conexões que importam <span>💕</span>
        </span>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notificações administrativas"
          >
            <Bell size={18} />
            <span className="topbar-badge-dot">3</span>
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                padding: '16px',
                zIndex: 110,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>Notificações da Plataforma</strong>
                <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}>Marcar lidas</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '8px', fontSize: '12px', color: '#991b1b' }}>
                  <strong>12 denúncias graves</strong> aguardando revisão de moderação.
                </div>
                <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#1e40af' }}>
                  <strong>Pico de tráfego detectado:</strong> +34% de novos posts nos últimos 60 min.
                </div>
                <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px', color: '#166534' }}>
                  <strong>Backup Firebase:</strong> Concluído com sucesso às 14:00.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Apps Grid */}
        <button
          type="button"
          className="topbar-icon-btn"
          title="Módulos da Plataforma"
          onClick={() => {
            window.location.href = '/admin/modulos';
          }}
        >
          <LayoutGrid size={18} />
        </button>

        {/* Profile Pill & Menu */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            className="topbar-user-profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="topbar-user-avatar" />
            ) : (
              <div className="topbar-user-avatar">
                {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AD'}
              </div>
            )}
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user?.displayName || 'Carlos Mendes'}</span>
              <span className="topbar-user-role">
                {user?.role === 'superadmin' ? 'Super Admin' : 'Administrador'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '220px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                padding: '8px',
                zIndex: 110,
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{user?.email}</div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 500 }}>● Sessão Firebase Ativa</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  window.location.href = '/app';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#475569',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ExternalLink size={15} />
                <span>Ir para Rede Social</span>
              </button>

              <button
                type="button"
                onClick={() => logout()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
