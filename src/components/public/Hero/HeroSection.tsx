import React from 'react';
import HeroCTA from './HeroCTA';
import SocialProof from './SocialProof';
import HeroPhones from './HeroPhones';
import './Hero.css';

export interface HeroSectionProps {
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  authenticated = false,
}) => {
  return (
    <section className="flow-hero" aria-labelledby="flow-hero-title">
      <div className="flow-hero__container">
        {/* Left Column: Copy & Actions */}
        <div className="flow-hero__copy">
          <span className="flow-hero__eyebrow">
            UMA REDE SOCIAL FEITA PARA PESSOAS REAIS
          </span>

          <h1 id="flow-hero-title" className="flow-hero__title">
            <span>Conecte.</span>{' '}
            <span className="flow-hero__title-gradient">Compartilhe.</span>{' '}
            <span>Viva.</span>
          </h1>

          <p className="flow-hero__subtitle">
            No Flow, cada história importa. Descubra pessoas, explore comunidades,
            compartilhe seus momentos e faça parte de algo maior.
          </p>

          <HeroCTA
            authenticated={authenticated}
            onLogin={() => onNavigate(authenticated ? '/app' : '/login')}
            onRegister={() => onNavigate('/cadastro')}
          />

          <SocialProof className="flow-hero__proof" />
        </div>

        {/* Right Column: Phones Mockup */}
        <div className="flow-hero__visual">
          <HeroPhones />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
