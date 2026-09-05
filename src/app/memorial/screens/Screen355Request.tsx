import { Shield } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen355Request({ onNavigate }: MemorialScreenProps) {
  return (
    <div style={{ padding: '44px 36px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
        Solicitar transformação em Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Solicite a transformação da conta de um membro falecido em um perfil memorial.
      </p>

      <div className="m355-steps">
        <div className="m355-step-card">
          <div className="m355-step-num">1</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Preencha o formulário</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">2</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Envie a documentação comprobatória</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">3</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Nossa equipe analisará a solicitação</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">4</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Você será informado sobre o resultado</span>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}
        onClick={() => onNavigate(356)}
      >
        Iniciar solicitação
      </button>

      <div style={{ marginTop: 24, fontSize: 13, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Shield size={16} /> A conta só será transformada em memorial depois da análise e aprovação da nossa equipe.
      </div>
    </div>
  );
}
