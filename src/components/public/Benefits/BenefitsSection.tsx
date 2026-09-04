import React from 'react';
import { Users, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import BenefitCard from './BenefitCard';
import './Benefits.css';

export const BENEFITS_DATA = [
  {
    icon: <Users size={22} className="flow-benefit-icon--blue" />,
    title: 'Conexões Autênticas',
    description: 'Pessoas que compartilham seus interesses',
  },
  {
    icon: <ShieldCheck size={22} className="flow-benefit-icon--cyan" />,
    title: 'Privacidade em Primeiro Lugar',
    description: 'Você no controle total dos seus dados',
  },
  {
    icon: <SlidersHorizontal size={22} className="flow-benefit-icon--purple" />,
    title: 'Sem Algoritmos Tóxicos',
    description: 'Feed cronológico, saudável e relevante',
  },
  {
    icon: <Sparkles size={22} className="flow-benefit-icon--pink" />,
    title: 'Feito para Criadores',
    description: 'Ferramentas completas para crescer e monetizar',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section className="flow-benefits-section" aria-label="Benefícios do FLOW">
      <div className="flow-benefits-container">
        <div className="flow-benefits-grid">
          {BENEFITS_DATA.map((b) => (
            <BenefitCard
              key={b.title}
              icon={b.icon}
              title={b.title}
              description={b.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
