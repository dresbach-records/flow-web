import { CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen359Representative({ onNavigate }: MemorialScreenProps) {
  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Meu papel como representante
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Você foi indicado como contato de legado de Carlos Eduardo.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 28 }}>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
          alt="Mariana Silva"
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <strong style={{ fontSize: 17, color: '#0F172A', display: 'block' }}>Mariana Silva</strong>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Contato de legado
          </span>
          <small style={{ color: '#64748B', display: 'block' }}>mariana.silva@email.com</small>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Permissões</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {[
          'Solicitar transformação em memorial',
          'Gerenciar homenagens',
          'Manter publicações autorizadas',
          'Solicitar remoção de conteúdo',
          'Receber comunicados da Flow',
        ].map((perm) => (
          <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#334155' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <span>{perm}</span>
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(364)}>
        Ver orientações
      </button>
    </div>
  );
}
