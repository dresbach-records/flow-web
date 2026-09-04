import React from 'react';

export interface HeroPhonesProps {
  className?: string;
}

export const HeroPhones: React.FC<HeroPhonesProps> = ({ className = '' }) => {
  return (
    <div className={`flow-hero-phones ${className}`}>
      {/* Ambient background glow behind the phones */}
      <div className="flow-hero-phones__glow" aria-hidden="true" />

      {/* Main reference phones graphic */}
      <div className="flow-hero-phones__stage">
        <img
          src="/flow-assets/hero-phones.png"
          alt="Visualização do FLOW em smartphones: feed, vídeos e comunidades"
          className="flow-hero-phones__image"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default HeroPhones;
