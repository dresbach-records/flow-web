import { ArrowRight, Heart, MessageCircle, Search, Send } from 'lucide-react';
import { navigate } from '../../../hooks/useRouter';
import CTAButton from '../CTAButton';
import './HeroSection.css';

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=70',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=70',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&q=70',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=70',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=70',
];

const POST_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=75';

export default function HeroSection() {
  return (
    <section className="site-hero">
      <div className="site-hero-inner">
        <div className="site-hero-copy">
          <span className="site-eyebrow">Uma rede social feita para pessoas reais</span>
          <h1>
            Conecte.
            <br />
            <span className="site-gradient-text">Compartilhe.</span>
            <br />
            Viva.
          </h1>
          <p>
            No <strong>Flow</strong>, cada história importa. Descubra pessoas, explore comunidades, compartilhe seus momentos e faça
            parte de algo maior.
          </p>
          <div className="site-hero-cta">
            <CTAButton variant="gradient" onClick={() => navigate('/login')}>
              Entrar no Flow <ArrowRight size={18} />
            </CTAButton>
            <CTAButton variant="outline" onClick={() => navigate('/cadastro')}>
              Criar conta grátis
            </CTAButton>
          </div>
          <div className="site-hero-proof">
            <div className="site-hero-avatars" aria-hidden="true">
              {AVATARS.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
            <p>
              Junte-se a <strong>pessoas reais</strong>
              <br />
              que já vivem o Flow
            </p>
          </div>
        </div>

        <div className="site-hero-visual" aria-hidden="true">
          <div className="site-phone site-phone-back">
            <div className="site-phone-notch" />
            <p className="site-phone-title">Comunidades</p>
            <div className="site-phone-search">
              <Search size={14} /> Buscar comunidades
            </div>
            {['Amantes de Viagem', 'Fotografia', 'Vida Saudável'].map((name) => (
              <div key={name} className="site-phone-community">
                <span className="site-phone-community-info">
                  <strong>{name}</strong>
                </span>
                <span className="site-phone-join">Participar</span>
              </div>
            ))}
          </div>

          <div className="site-phone site-phone-front">
            <div className="site-phone-notch" />
            <div className="site-phone-appbar">
              <img src="/logo.png" alt="" />
            </div>
            <div className="site-phone-stories">
              {AVATARS.slice(0, 4).map((src) => (
                <span key={src}>
                  <img src={src} alt="" loading="lazy" />
                </span>
              ))}
            </div>
            <div className="site-phone-post">
              <div className="site-phone-post-head">
                <img src={AVATARS[0]} alt="" loading="lazy" />
                <strong>Mariana Silva</strong>
              </div>
              <p>Viver bons momentos é o que torna a vida incrível! ✨</p>
              <img className="site-phone-post-img" src={POST_IMG} alt="" loading="lazy" />
              <div className="site-phone-post-actions">
                <Heart size={16} /> <MessageCircle size={16} /> <Send size={16} />
              </div>
            </div>
          </div>

          <aside className="site-hero-badge">
            Mais que
            <br />
            uma rede social.
            <br />
            <strong>É o seu lugar.</strong>
          </aside>
        </div>
      </div>
    </section>
  );
}
