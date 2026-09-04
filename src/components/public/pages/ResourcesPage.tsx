import React from 'react';
import PublicPageLayout from './PublicPageLayout';
import { Sparkles, SlidersHorizontal, ShieldCheck, Zap, MessageSquare, Smartphone } from 'lucide-react';
import CTAButton from '../common/CTAButton';

export interface ResourcesPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  currentPath,
  onNavigate,
  authenticated,
}) => {
  const items = [
    {
      icon: <Sparkles size={24} color="#3B82F6" />,
      iconBg: '#EFF6FF',
      title: 'Feed Duplo: Cronológico ou Algoritmo',
      desc: 'No Flow você tem o poder de escolha: alterne entre o feed algorítmico e a ordem cronológica estrita sem ruídos ou publicidade invasiva.',
    },
    {
      icon: <SlidersHorizontal size={24} color="#8B5CF6" />,
      iconBg: '#F5F3FF',
      title: 'Controle Fino de Conteúdo',
      desc: 'Filtre temas, bloqueie palavras-chave indesejadas e ajuste as recomendações de acordo com seu bem-estar digital.',
    },
    {
      icon: <Zap size={24} color="#EC4899" />,
      iconBg: '#FDF2F8',
      title: 'Stories Sem Filtros Distorcidos',
      desc: 'Publique momentos autênticos do seu dia que expiram em 24h. Recursos de áudio, stickers de perguntas e enquetes integradas.',
    },
    {
      icon: <MessageSquare size={24} color="#06B6D4" />,
      iconBg: '#ECFEFF',
      title: 'Chat & Mensagens Diretas',
      desc: 'Troque mensagens instantâneas com reações rápidas, compartilhamento de fotos de alta resolução e privacidade garantida.',
    },
    {
      icon: <ShieldCheck size={24} color="#10B981" />,
      iconBg: '#ECFDF5',
      title: 'Privacidade Reforçada & LGPD',
      desc: 'Seus dados não são vendidos para anunciantes terceiros. Você pode exportar ou deletar sua conta e arquivos a qualquer momento.',
    },
    {
      icon: <Smartphone size={24} color="#F59E0B" />,
      iconBg: '#FFFBEB',
      title: 'Experiência PWA Ultra Rápida',
      desc: 'Navegação instantânea, consumo reduzido de bateria e dados, e suporte nativo a instalação em iOS e Android.',
    },
  ];

  return (
    <PublicPageLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      authenticated={authenticated}
      tag="RECURSOS DA PLATAFORMA"
      title="Feito para o que realmente importa"
      subtitle="Descubra as ferramentas e inovações que tornam o Flow o espaço ideal para conectar pessoas de forma genuína."
    >
      <div className="flow-page-grid">
        {items.map((item) => (
          <div key={item.title} className="flow-page-card">
            <div className="flow-page-card__icon" style={{ background: item.iconBg }}>
              {item.icon}
            </div>
            <h3 className="flow-page-card__title">{item.title}</h3>
            <p className="flow-page-card__desc">{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56, textAlign: 'center' }}>
        <CTAButton
          size="lg"
          variant="gradient"
          onClick={() => onNavigate(authenticated ? '/app' : '/cadastro')}
        >
          {authenticated ? 'Ir para o Feed' : 'Começar a usar agora'}
        </CTAButton>
      </div>
    </PublicPageLayout>
  );
};

export default ResourcesPage;
