import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Download, UserCheck, Check, KeyRound, HeartHandshake } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { navigate } from '../../hooks/useRouter';
import { CURRENT_CONSENT_VERSION, CURRENT_DOCUMENT_VERSION } from '../../services/firebase/consent';

export default function SettingsModule() {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'notifications' | 'legacy'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || 'Criador FLOW');
  const [bio, setBio] = useState('Criador de conteúdo e apaixonado por música e tecnologia.');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user: {
        uid: user?.uid,
        email: user?.email,
        displayName,
        bio,
      },
      consent: {
        version: CURRENT_CONSENT_VERSION,
        document: CURRENT_DOCUMENT_VERSION,
        status: 'accepted',
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-dados-usuario-${user?.uid || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Settings size={26} color="#2563EB" />
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Configurações</h1>
      </div>
      <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#64748B' }}>
        Gerencie suas preferências de conta, privacidade, segurança e notificações.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: 12,
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { key: 'profile', label: 'Perfil & Dados' },
          { key: 'security', label: 'Segurança & 2FA' },
          { key: 'privacy', label: 'Privacidade & LGPD' },
          { key: 'notifications', label: 'Notificações' },
          { key: 'legacy', label: 'Legado & Memorial' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === tab.key ? '#2563EB' : 'transparent',
              color: activeTab === tab.key ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 12,
          background: '#ECFDF5',
          border: '1px solid #6EE7B7',
          color: '#065F46',
          fontSize: 13.5,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20
        }}>
          <Check size={18} />
          <span>Preferências salvas com sucesso!</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              Nome de Exibição
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                padding: '0 14px',
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              E-mail da Conta
            </label>
            <input
              type="email"
              value={user?.email || 'usuario@flow.app'}
              disabled
              style={{
                width: '100%',
                height: 42,
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                padding: '0 14px',
                fontSize: 14,
                background: '#F8FAFC',
                color: '#64748B',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              Biografia
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                padding: 14,
                fontSize: 14,
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Salvar alterações
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 15, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                Segundo Fator de Autenticação (2FA)
              </strong>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
                Proteja sua conta com confirmação por código em novo dispositivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: twoFactorEnabled ? '1px solid #10B981' : '1px solid #CBD5E1',
                background: twoFactorEnabled ? '#ECFDF5' : '#F8FAFC',
                color: twoFactorEnabled ? '#059669' : '#64748B',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {twoFactorEnabled ? 'Ativado' : 'Desativado'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <KeyRound size={18} color="#2563EB" />
              <strong style={{ fontSize: 14, color: '#0F172A' }}>Códigos de Backup & Recuperação</strong>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#64748B' }}>
              Gere códigos de segurança de uso único caso perca o acesso ao seu e-mail ou autenticador.
            </p>
            <button
              type="button"
              onClick={() => alert('Códigos de backup verificados e ativos no seu cofre de segurança.')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Visualizar códigos de reserva
            </button>
          </div>
        </div>
      )}

      {/* Privacy & LGPD Tab */}
      {activeTab === 'privacy' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Shield size={20} color="#2563EB" />
              <strong style={{ fontSize: 16, color: '#0F172A' }}>Seus Direitos de Titular de Dados (LGPD)</strong>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: '#64748B', lineHeight: 1.5 }}>
              A FLOW está em estrita conformidade com a Lei 13.709/2018 (Lei Geral de Proteção de Dados). Seus dados são criptografados e você tem total controle sobre sua privacidade.
            </p>
          </div>

          <div style={{
            padding: 16,
            borderRadius: 12,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', marginBottom: 2 }}>
                Status de Consentimento Obrigatório
              </strong>
              <span style={{ fontSize: 12.5, color: '#059669', fontWeight: 600 }}>
                Termos {CURRENT_CONSENT_VERSION} Aceitos e Válidos
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{CURRENT_DOCUMENT_VERSION}</span>
          </div>

          <div style={{
            padding: 16,
            borderRadius: 12,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', marginBottom: 2 }}>
                Exportar Meus Dados Pessoais
              </strong>
              <span style={{ fontSize: 12.5, color: '#64748B' }}>
                Baixe um arquivo JSON contendo seu histórico de conta e consentimentos.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                border: '1px solid #2563EB',
                background: '#EFF6FF',
                color: '#2563EB',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', marginBottom: 2 }}>
                Notificações Push no Navegador
              </strong>
              <span style={{ fontSize: 12.5, color: '#64748B' }}>
                Receba alertas instantâneos de novas curtidas e comentários.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={e => setPushNotifications(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: '#2563EB', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
            <div>
              <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', marginBottom: 2 }}>
                Resumo por E-mail
              </strong>
              <span style={{ fontSize: 12.5, color: '#64748B' }}>
                Receba novidades e atualizações das suas comunidades favoritas semanalmente.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={e => setEmailNotifications(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: '#2563EB', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      {/* Legacy & Memorial Tab — memorial vive nas Configurações (sub-item) */}
      {activeTab === 'legacy' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 44, height: 44, borderRadius: 12, background: '#F5F3FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <HeartHandshake size={22} color="#8B5CF6" />
            </span>
            <div>
              <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>
                Legado e Memorial
              </strong>
              <span style={{ fontSize: 12.5, color: '#64748B' }}>
                Defina o que acontece com sua conta no futuro e gerencie memoriais.
              </span>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: '#475569' }}>
            Nas configurações de legado você escolhe se a conta será memorializada,
            indica um contato de legado e define permissões de publicações, fotos e mensagens.
          </p>
          <div>
            <button
              type="button"
              onClick={() => navigate('/configuracoes/memorial')}
              style={{
                padding: '10px 22px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Abrir configurações de legado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
