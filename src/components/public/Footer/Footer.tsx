import React from 'react';
import FooterColumn from './FooterColumn';
import SocialLinks from './SocialLinks';
import NewsletterForm from './NewsletterForm';
import Logo from '../Header/Logo';
import './Footer.css';

export interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const productLinks = [
    { label: 'Recursos', href: '/recursos' },
    { label: 'Comunidades', href: '/comunidades' },
    { label: 'Criadores', href: '/criadores' },
    { label: 'Stories & Reels', href: '/recursos' },
    { label: 'Download App', href: '/download' },
  ];

  const companyLinks = [
    { label: 'Sobre nós', href: '/sobre' },
    { label: 'Carreiras', href: '/carreiras', badge: 'Vagas' },
    { label: 'Imprensa', href: '/imprensa' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ];

  const legalLinks = [
    { label: 'Central de Segurança', href: '/seguranca' },
    { label: 'Termos de Uso', href: '/legal/termos' },
    { label: 'Política de Privacidade', href: '/legal/privacidade' },
    { label: 'Diretrizes da Comunidade', href: '/legal/diretrizes' },
    { label: 'Cookies & LGPD', href: '/legal/cookies' },
  ];

  return (
    <footer className="flow-footer" role="contentinfo">
      <div className="flow-footer__container">
        {/* Main 5-column grid */}
        <div className="flow-footer__grid">
          {/* Column 1: Brand & Bio */}
          <div className="flow-footer-brand-col">
            <Logo onClick={() => onNavigate('/')} />
            <p className="flow-footer-brand-desc">
              Conecte. Compartilhe. Viva. Uma rede social feita para pessoas reais,
              respeito mútuo e momentos autênticos.
            </p>
            <SocialLinks />
          </div>

          {/* Column 2: Product */}
          <FooterColumn
            title="Produto"
            links={productLinks}
            onNavigate={onNavigate}
          />

          {/* Column 3: Company */}
          <FooterColumn
            title="Empresa"
            links={companyLinks}
            onNavigate={onNavigate}
          />

          {/* Column 4: Legal & Security */}
          <FooterColumn
            title="Segurança & Legal"
            links={legalLinks}
            onNavigate={onNavigate}
          />

          {/* Column 5: Newsletter */}
          <div className="flow-footer-newsletter-col">
            <h4 className="flow-footer-col__title">Fique por dentro</h4>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom copyright & system info */}
        <div className="flow-footer__bottom">
          <div className="flow-footer__copyright">
            © {new Date().getFullYear()} FLOW Technologies Inc. Todos os direitos reservados.
          </div>

          <div className="flow-footer__status">
            <span className="flow-footer__status-dot" aria-hidden="true" />
            <span>Todos os sistemas operando normalmente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
