import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import type { MemorialScreenProps } from './types';

const faqs = [
  {
    q: 'O que é o Memorial da Flow?',
    a: 'O Memorial da Flow é um recurso permanente projetado para homenagear membros falecidos da nossa comunidade, congelando seu perfil e preservando suas publicações autorizadas como legado afetivo.',
  },
  {
    q: 'Quem pode solicitar?',
    a: 'Familiares de primeiro grau (cônjuge, filhos, pais), herdeiros legais ou representantes indicados pelo próprio usuário em vida.',
  },
  {
    q: 'Quais documentos são necessários?',
    a: 'Certidão de óbito emitida em cartório oficial, obituário idôneo ou documento legal expedido por autoridade competente.',
  },
  {
    q: 'O que acontece com os dados do usuário?',
    a: 'As credenciais de login são desativadas definitivamente. Se configurado previamente pelo titular, conversas privadas são removidas e apenas postagens públicas selecionadas são mantidas.',
  },
  {
    q: 'É possível remover o memorial?',
    a: 'Sim. Familiares imediatos ou representantes legais podem solicitar a exclusão integral do memorial por meio do canal dedicado de solicitação de remoção.',
  },
  {
    q: 'Como indicar um contato de legado?',
    a: 'Nas Configurações de Legado (/configuracoes/memorial), o titular pode selecionar qualquer amigo ou familiar e registrá-lo como seu representante pós-vida.',
  },
];

export default function Screen364Help({ onNavigate }: MemorialScreenProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 740, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Ajuda sobre o Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Tire suas dúvidas sobre o processo de memorialização.
      </p>

      <div className="m364-faq-list">
        {faqs.map((f, i) => (
          <div key={f.q} className="m364-faq-item">
            <div className="m364-faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} color="#8B5CF6" /> {f.q}
              </span>
              <ChevronDown
                size={18}
                color="#94A3B8"
                style={{ transform: openIdx === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </div>
            {openIdx === i && <div className="m364-faq-answer">{f.a}</div>}
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(351)}>
        Falar com o suporte
      </button>
    </div>
  );
}
