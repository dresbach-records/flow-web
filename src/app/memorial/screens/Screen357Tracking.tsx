import { CheckCircle2, Clock, Info } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen357Tracking({ onNavigate }: MemorialScreenProps) {
  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Acompanhamento da Solicitação
      </h2>
      <p style={{ margin: '0 0 32px', color: '#64748B', fontSize: 15 }}>
        Veja o status da sua solicitação.
      </p>

      <div className="m357-timeline">
        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon completed"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>Solicitação enviada</strong>
            <small style={{ color: '#64748B' }}>20/06/2026 14:32</small>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon completed"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>Documentação recebida</strong>
            <small style={{ color: '#64748B' }}>20/06/2026 14:35</small>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon current"><Clock size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#3B82F6', display: 'block' }}>Em análise</strong>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#475569' }}>
              Nossa equipe está analisando os documentos. Prazo médio: até 3 dias úteis.
            </p>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon pending"><Clock size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#94A3B8', display: 'block' }}>Aguardando aprovação</strong>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-icon pending"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#94A3B8', display: 'block' }}>Conclusão</strong>
          </div>
        </div>
      </div>

      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Info size={20} color="#0284C7" />
        <span style={{ fontSize: 14, color: '#0369A1' }}>
          Você será notificado por e-mail e na Flow sobre o resultado da análise.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="m-btn-secondary" onClick={() => onNavigate(351)}>Voltar ao início</button>
        <button className="m-btn-primary" onClick={() => onNavigate(363)}>Simular aprovação</button>
      </div>
    </div>
  );
}
