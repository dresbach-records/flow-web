import { Heart, ShieldCheck, Users, UsersRound } from 'lucide-react';
import './BenefitsBar.css';

const BENEFITS = [
  { icon: UsersRound, title: 'Pessoas reais', text: 'Conexões que fazem sentido' },
  { icon: Heart, title: 'Histórias incríveis', text: 'Compartilhe seus momentos' },
  { icon: Users, title: 'Comunidades', text: 'Encontre o seu lugar' },
  { icon: ShieldCheck, title: 'Ambiente seguro', text: 'Sua privacidade em primeiro lugar' },
];

export default function BenefitsBar() {
  return (
    <section className="site-benefits" aria-label="Benefícios da Flow">
      <div className="site-benefits-inner">
        {BENEFITS.map((b) => (
          <div key={b.title} className="site-benefit">
            <span className="site-benefit-icon" aria-hidden="true">
              <b.icon size={26} />
            </span>
            <div>
              <strong>{b.title}</strong>
              <small>{b.text}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
