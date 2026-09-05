import { ArrowRight, Award, Camera, Heart, HeartHandshake, MessageCircle } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen351Home({ onNavigate }: MemorialScreenProps) {
  return (
    <div className="m351-hero">
      <div className="m351-icon-badge">
        <HeartHandshake size={32} />
      </div>
      <h1 className="m351-title">Memorial do Usuário</h1>
      <div className="m351-subtitle">Preserve memórias. Mantenha histórias vivas.</div>
      <p className="m351-desc">
        O Memorial da Flow é um espaço para homenagear pessoas que fizeram parte da nossa comunidade.
      </p>

      <div className="m351-grid">
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Heart size={20} /></div>
          <span className="m351-feature-text">Mantém o perfil como homenagem</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Camera size={20} /></div>
          <span className="m351-feature-text">Preserva publicações autorizadas</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><MessageCircle size={20} /></div>
          <span className="m351-feature-text">Permite mensagens de amigos e familiares</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Award size={20} /></div>
          <span className="m351-feature-text">Mantém viva a história de quem fez parte da Flow</span>
        </div>
      </div>

      <div className="m351-actions">
        <button className="m-btn-secondary" onClick={() => onNavigate(364)}>Saiba mais</button>
        <button className="m-btn-primary" onClick={() => onNavigate(355)}>
          Solicitar memorial <ArrowRight size={18} />
        </button>
      </div>

      <div className="m351-quote">
        "Algumas pessoas nunca se vão, elas apenas vivem para sempre nas nossas memórias."
      </div>
    </div>
  );
}
