// FLOW — AdminSettings (FASE 6: persistência real).
// Config global em `platform_settings/global` (regra: só admin).
import React, { useCallback, useEffect, useState } from 'react';
import { Settings, Save, Sliders, Globe } from 'lucide-react';
import { getDocument, upsertDocument } from '../../services/firebase/firestore';

export const AdminSettings: React.FC = () => {
  const [platformName, setPlatformName] = useState('Flow Social');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowPublicSignup, setAllowPublicSignup] = useState(true);
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState('250');
  const [autoModSensitivity, setAutoModSensitivity] = useState('medium');
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const doc = await getDocument<Record<string, unknown>>('platform_settings', 'global');
      if (doc) {
        if (typeof doc.platformName === 'string') setPlatformName(doc.platformName);
        if (typeof doc.maintenanceMode === 'boolean') setMaintenanceMode(doc.maintenanceMode);
        if (typeof doc.allowPublicSignup === 'boolean') setAllowPublicSignup(doc.allowPublicSignup);
        if (typeof doc.maxUploadSizeMb === 'string') setMaxUploadSizeMb(doc.maxUploadSizeMb);
        if (typeof doc.autoModSensitivity === 'string') setAutoModSensitivity(doc.autoModSensitivity);
      }
    } catch {
      /* sem config salva: mantém padrões */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    void upsertDocument('platform_settings', 'global', {
      platformName,
      maintenanceMode,
      allowPublicSignup,
      maxUploadSizeMb,
      autoModSensitivity,
    })
      .then(() => {
        setToast('Configurações da plataforma salvas com sucesso.');
        setTimeout(() => setToast(null), 3000);
      })
      .catch(() => setFormError('Falha ao salvar. Verifique a permissão administrativa.'))
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <Settings size={24} color="#6366f1" />
          <span>Configurações Gerais da Plataforma</span>
        </h1>
        <p className="greeting-subtitle">
          Parâmetros globais do sistema, regras de registro, limites de mídia e moderação automatizada.
        </p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}
      {formError && (
        <div role="alert" style={{ padding: '10px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          {formError}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64748b', fontSize: 13 }}>Carregando configurações…</p>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
          {/* General Settings Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Globe size={16} color="#6366f1" />
                <span>Identidade & Acesso</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nome da Plataforma</label>
                <input
                  type="text"
                  className="admin-input"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Permitir Novos Cadastros Públicos</strong>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Quando desativado, apenas usuários convidados podem criar conta.</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowPublicSignup}
                  onChange={(e) => setAllowPublicSignup(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#dc2626' }}>Modo de Manutenção Geral</strong>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Sinaliza manutenção; a aplicação pelo app chega na Fase 8.</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#ef4444', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Media & Moderation Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Sliders size={16} color="#6366f1" />
                <span>Armazenamento & Moderação Automática</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tamanho Máximo de Vídeo / Short (MB)</label>
                <input
                  type="number"
                  className="admin-input"
                  value={maxUploadSizeMb}
                  onChange={(e) => setMaxUploadSizeMb(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Sensibilidade do Filtro de Conteúdo IA</label>
                <select
                  className="admin-select"
                  value={autoModSensitivity}
                  onChange={(e) => setAutoModSensitivity(e.target.value)}
                >
                  <option value="low">Baixa (Apenas violações flagrantes)</option>
                  <option value="medium">Média (Recomendado para rede social ativa)</option>
                  <option value="high">Alta (Quarentena preventiva rigorosa)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            style={{ alignSelf: 'flex-start', padding: '12px 28px', width: 'auto' }}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Salvando…' : 'Salvar Alterações Globais'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
