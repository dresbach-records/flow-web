import React from 'react';
import PublicPageLayout from './PublicPageLayout';
import { ShieldCheck, Lock, EyeOff, UserCheck, KeyRound, AlertTriangle } from 'lucide-react';
import CTAButton from '../common/CTAButton';

export interface SecurityPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({
  currentPath,
  onNavigate,
  authenticated,
}) => {
  const securityFeatures = [
    {
      icon: <Lock size={24} color="#3B82F6" />,
      iconBg: '#EFF6FF',
      title: 'Criptografia em Trânsito e Repouso',
      desc: 'Todas as comunicações e mídias no Flow utilizam criptografia de ponta (TLS 1.3 e AES-256) garantindo sigilo absoluto.',
    },
    {
      icon: <EyeOff size={24} color="#8B5CF6" />,
      iconBg: '#F5F3FF',
      title: 'Sem Rastreamento Entre Sites',
      desc: 'Nós não monitoramos sua navegação fora da plataforma e não utilizamos trackers de publicidade invasiva de terceiros.',
    },
    {
      icon: <UserCheck size={24} color="#10B981" />,
      iconBg: '#ECFDF5',
      title: 'Conformidade com a LGPD & GDPR',
      desc: 'Você possui direitos claros de acesso, retificação, portabilidade e exclusão completa dos seus dados em poucos cliques.',
    },
    {
      icon: <KeyRound size={24} color="#F59E0B" />,
      iconBg: '#FFFBEB',
      title: 'Autenticação Segura & MFA',
      desc: 'Controle de acesso por verificação em duas etapas e monitoramento de sessões ativas com encerramento remoto.',
    },
    {
      icon: <AlertTriangle size={24} color="#EF4444" />,
      iconBg: '#FEF2F2',
      title: 'Moderação Ética & Denúncias Rápidas',
      desc: 'Canal de denúncias ágil contra assédio, spam, desinformação e violação de direitos autorais com resolução transparente.',
    },
    {
      icon: <ShieldCheck size={24} color="#06B6D4" />,
      iconBg: '#ECFEFF',
      title: 'Transparência Algorítmica',
      desc: 'Entenda exatamente por que cada postagem aparece para você. Sem manipulações emocionais ou testes psicológicos velados.',
    },
  ];

  return (
    <PublicPageLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      authenticated={authenticated}
      tag="CENTRAL DE SEGURANÇA"
      title="Sua segurança e privacidade em primeiro lugar"
      subtitle="Conheça nossos compromissos, arquitetura de proteção de dados e diretrizes de convivência comunitária."
    >
      <div className="flow-page-grid">
        {securityFeatures.map((f) => (
          <div key={f.title} className="flow-page-card">
            <div className="flow-page-card__icon" style={{ background: f.iconBg }}>
              {f.icon}
            </div>
            <h3 className="flow-page-card__title">{f.title}</h3>
            <p className="flow-page-card__desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <CTAButton
          size="md"
          variant="outline"
          onClick={() => onNavigate('/legal/privacidade')}
        >
          Ler Política de Privacidade Completa
        </CTAButton>
      </div>
    </PublicPageLayout>
  );
};

export default SecurityPage;
