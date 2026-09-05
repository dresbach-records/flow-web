import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen362Removal({ onNavigate }: MemorialScreenProps) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Solicitar remoção do memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Se você acredita que este memorial deve ser removido, solicite uma análise.
      </p>

      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Solicitação enviada</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>A análise jurídica será realizada com prioridade.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da solicitação</label>
            <select className="m-select" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}>
              <option value="">Selecione o motivo...</option>
              <option value="family">Decisão expressa da família imediata</option>
              <option value="will">Vontade prévia do titular antes do falecimento</option>
              <option value="court">Ordem judicial ou determinação legal</option>
            </select>
          </div>

          <div className="m-form-group">
            <label>Descrição</label>
            <textarea className="m-textarea" placeholder="Explique o motivo da solicitação..." style={{ minHeight: 120 }} />
          </div>

          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <AlertTriangle size={20} color="#EF4444" />
            <span style={{ fontSize: 14, color: '#B91C1C', fontWeight: 600 }}>
              Todas as solicitações serão analisadas pela nossa equipe.
            </span>
          </div>

          <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDone(true)}>
            Enviar solicitação
          </button>
        </>
      )}
    </div>
  );
}
