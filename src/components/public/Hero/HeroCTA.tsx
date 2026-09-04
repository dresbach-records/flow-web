import React from 'react';
import { ArrowRight } from 'lucide-react';
import CTAButton from '../common/CTAButton';

export interface HeroCTAProps {
  onLogin: () => void;
  onRegister: () => void;
  authenticated?: boolean;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  onLogin,
  onRegister,
  authenticated = false,
}) => {
  return (
    <div className="flow-hero-cta-group">
      <CTAButton
        size="lg"
        variant="gradient"
        onClick={authenticated ? onLogin : onLogin}
        icon={<ArrowRight size={18} />}
        iconPosition="right"
      >
        {authenticated ? 'Entrar no Flow' : 'Entrar no Flow'}
      </CTAButton>

      {!authenticated && (
        <CTAButton
          size="lg"
          variant="outline"
          onClick={onRegister}
        >
          Criar conta grátis
        </CTAButton>
      )}
    </div>
  );
};

export default HeroCTA;
