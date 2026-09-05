import { Camera, ChevronRight, FileText, MessageCircle, Settings, Shield, Trash2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen360Admin({ onNavigate }: MemorialScreenProps) {
  const modules = [
    { title: 'Gerenciar homenagens', icon: <MessageCircle size={20} color="#8B5CF6" />, target: 353 },
    { title: 'Aprovar publicações', icon: <Shield size={20} color="#3B82F6" />, target: 352 },
    { title: 'Gerenciar fotos e vídeos', icon: <Camera size={20} color="#EC4899" />, target: 352 },
    { title: 'Configurar privacidade', icon: <Settings size={20} color="#F59E0B" />, target: 358 },
    { title: 'Solicitar remoção de conteúdo', icon: <Trash2 size={20} color="#EF4444" />, target: 362 },
    { title: 'Visualizar relatórios', icon: <FileText size={20} color="#10B981" />, target: 357 },
  ];

  return (
    <div style={{ padding: '40px 36px', maxWidth: 780, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Administração do Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Gerencie o perfil memorial de Carlos Eduardo.
      </p>

      <div className="m360-grid">
        {modules.map((m) => (
          <div key={m.title} className="m360-card" onClick={() => onNavigate(m.target)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{m.title}</span>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(352)}>
        Acessar painel
      </button>
    </div>
  );
}
