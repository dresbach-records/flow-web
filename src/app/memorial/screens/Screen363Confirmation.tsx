import { CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen363Confirmation({ onNavigate }: MemorialScreenProps) {
  return (
    <div style={{ padding: '60px 36px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
        <CheckCircle2 size={42} />
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', color: '#0F172A' }}>
        Conta transformada em Memorial
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#475569', margin: '0 0 18px' }}>
        O perfil de Carlos Eduardo agora é um memorial.
      </p>
      <p style={{ fontSize: 15, color: '#64748B', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
        Suas memórias continuarão vivas na Flow. Agradecemos por fazer parte dessa história.
      </p>

      <button className="m-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => onNavigate(352)}>
        Ver memorial
      </button>
    </div>
  );
}
