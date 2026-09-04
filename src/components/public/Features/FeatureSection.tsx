import React from 'react';
import {
  Sparkles,
  Users,
  Zap,
  MessageSquare,
  TrendingUp,
  Smartphone,
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionHeading from '../common/SectionHeading';
import './Features.css';

export interface FeatureSectionProps {
  onNavigate: (path: string) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <Sparkles size={24} color="#3B82F6" />,
      iconBgColor: '#EFF6FF',
      title: 'Feed Inteligente & Cronológico',
      description:
        'Você escolhe o que vê. Alterne entre algoritmo personalizado e ordem cronológica pura a qualquer momento sem pegadinhas.',
      actionText: 'Saiba mais',
      route: '/recursos',
    },
    {
      icon: <Users size={24} color="#8B5CF6" />,
      iconBgColor: '#F5F3FF',
      title: 'Comunidades Vibrantes',
      description:
        'Encontre seus grupos, debata sobre suas paixões e construa laços reais com milhares de pessoas que pensam como você.',
      actionText: 'Explorar comunidades',
      route: '/comunidades',
    },
    {
      icon: <Zap size={24} color="#EC4899" />,
      iconBgColor: '#FDF2F8',
      title: 'Stories & Momentos Rápidos',
      description:
        'Compartilhe o seu dia a dia em fotos e vídeos que duram 24 horas, com privacidade ajustável e interações sem julgamentos.',
      actionText: 'Conhecer stories',
      route: '/recursos',
    },
    {
      icon: <MessageSquare size={24} color="#06B6D4" />,
      iconBgColor: '#ECFEFF',
      title: 'Mensagens Diretas Seguras',
      description:
        'Converse em tempo real com criptografia, chamadas de voz e compartilhamento de mídia sem intermediários rastreando suas conversas.',
      actionText: 'Ver segurança',
      route: '/seguranca',
    },
    {
      icon: <TrendingUp size={24} color="#10B981" />,
      iconBgColor: '#ECFDF5',
      title: 'Monetização de Criadores',
      description:
        'Receba apoio direto da sua audiência, crie publicações exclusivas para assinantes e retenha até 90% da sua receita.',
      actionText: 'Programa de criadores',
      route: '/criadores',
    },
    {
      icon: <Smartphone size={24} color="#F59E0B" />,
      iconBgColor: '#FFFBEB',
      title: 'Multiplataforma & PWA',
      description:
        'Acesse pelo navegador, no desktop ou instale no celular como um app ultra leve com suporte offline e notificações instantâneas.',
      actionText: 'Como instalar',
      route: '/ajuda',
    },
  ];

  return (
    <section className="flow-features-section" id="recursos" aria-labelledby="features-title">
      <div className="flow-features-container">
        <SectionHeading
          id="features-title"
          tag="TUDO QUE VOCÊ PRECISA EM UM SÓ LUGAR"
          title="Explore os recursos do Flow"
          subtitle="Uma plataforma completa pensada para conectar pessoas de forma genuína, produtiva e sem ruídos desnecessários."
          align="center"
        />

        <div className="flow-features-grid">
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              iconBgColor={item.iconBgColor}
              title={item.title}
              description={item.description}
              actionText={item.actionText}
              onAction={() => onNavigate(item.route)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
