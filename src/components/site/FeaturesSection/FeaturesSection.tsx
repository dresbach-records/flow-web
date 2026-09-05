import { Share2, Star, Users, Zap } from 'lucide-react';
import FeatureCard from '../FeatureCard';
import SectionHeading from '../SectionHeading';
import './FeaturesSection.css';

export default function FeaturesSection() {
  return (
    <section className="site-features">
      <div className="site-features-inner">
        <SectionHeading
          eyebrow="Explore um novo mundo"
          highlight="Muito mais"
          title="que uma rede social"
          description="O Flow combina criatividade, comunidades e oportunidades em um só lugar, para você se conectar com o que realmente importa."
        />
        <div className="site-features-grid">
          <FeatureCard
            icon={<Share2 size={26} color="#2563EB" />}
            title="Compartilhe"
            text="Posts, fotos, vídeos e muito mais. Mostre quem você é para o mundo."
            route="/cadastro"
          />
          <FeatureCard
            icon={<Users size={26} color="#8B5CF6" />}
            title="Participe"
            text="Comunidades para todos os interesses. Encontre suas pessoas."
            route="/comunidades"
          />
          <FeatureCard
            icon={<Zap size={26} color="#06B6D4" />}
            title="Descubra"
            text="Conteúdos incríveis e criadores talentosos todos os dias."
            route="/explorar"
          />
          <FeatureCard
            icon={<Star size={26} color="#D97706" />}
            title="Cresça"
            text="Construa sua audiência, compartilhe suas ideias e alcance novas oportunidades."
            route="/criadores"
          />
        </div>
      </div>
    </section>
  );
}
