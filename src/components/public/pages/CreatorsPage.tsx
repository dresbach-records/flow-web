import React from 'react';
import PublicPageLayout from './PublicPageLayout';
import { DollarSign, Award, BarChart3, Users, Sparkles, HeartHandshake } from 'lucide-react';
import CTAButton from '../common/CTAButton';

export interface CreatorsPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const CreatorsPage: React.FC<CreatorsPageProps> = ({
  currentPath,
  onNavigate,
  authenticated,
}) => {
  const perks = [
    {
      icon: <DollarSign size={24} color="#10B981" />,
      iconBg: '#ECFDF5',
      title: 'Repasse de 90% da Receita',
      desc: 'O Flow repassa a maior fatia de receita do mercado diretamente para o criador, sem taxas escondidas ou taxas abusivas.',
    },
    {
      icon: <Award size={24} color="#F59E0B" />,
      iconBg: '#FFFBEB',
      title: 'Assinaturas & Apoio Mensal',
      desc: 'Crie níveis de apoio personalizados para sua comunidade e ofereça postagens, áudios e badges exclusivos.',
    },
    {
      icon: <BarChart3 size={24} color="#3B82F6" />,
      iconBg: '#EFF6FF',
      title: 'Painel de Estatísticas em Tempo Real',
      desc: 'Métricas claras de alcance, engajamento e retenção de público com dados transparentes e sem intermediários.',
    },
    {
      icon: <Users size={24} color="#8B5CF6" />,
      iconBg: '#F5F3FF',
      title: 'Comunidades Próprias',
      desc: 'Modere e conduza grupos dedicados aos seus seguidores com ferramentas avançadas de publicação e moderação.',
    },
    {
      icon: <Sparkles size={24} color="#EC4899" />,
      iconBg: '#FDF2F8',
      title: 'Destaque no Feed & Descoberta',
      desc: 'Algoritmo de recomendação ético focado em premiar criatividade e autenticidade, e não sensacionalismo.',
    },
    {
      icon: <HeartHandshake size={24} color="#06B6D4" />,
      iconBg: '#ECFEFF',
      title: 'Suporte Dedicado a Parceiros',
      desc: 'Equipe especializada pronta para orientar seu crescimento, resolver dúvidas e apoiar lançamentos.',
    },
  ];

  return (
    <PublicPageLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      authenticated={authenticated}
      tag="PROGRAMA DE CRIADORES"
      title="Monetize seu talento no Flow"
      subtitle="Uma economia criativa feita para valorizar quem realmente produz conteúdo que agrega e inspira."
    >
      <div className="flow-page-grid">
        {perks.map((p) => (
          <div key={p.title} className="flow-page-card">
            <div className="flow-page-card__icon" style={{ background: p.iconBg }}>
              {p.icon}
            </div>
            <h3 className="flow-page-card__title">{p.title}</h3>
            <p className="flow-page-card__desc">{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56, textAlign: 'center' }}>
        <CTAButton
          size="lg"
          variant="gradient"
          onClick={() => onNavigate(authenticated ? '/app' : '/cadastro')}
        >
          {authenticated ? 'Acessar Creator Studio' : 'Tornar-se Criador'}
        </CTAButton>
      </div>
    </PublicPageLayout>
  );
};

export default CreatorsPage;
