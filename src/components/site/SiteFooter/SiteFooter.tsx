import { navigate } from '../../../hooks/useRouter';
import NewsletterForm from '../NewsletterForm';
import './SiteFooter.css';

interface FooterColumn {
  title: string;
  links: { label: string; route: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Recursos', route: '/recursos' },
      { label: 'Comunidades', route: '/comunidades' },
      { label: 'Criadores', route: '/criadores' },
      { label: 'Baixar App', route: '/#baixar' },
      { label: 'For You', route: '/for-you' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', route: '/ajuda' },
      { label: 'Segurança', route: '/seguranca' },
      { label: 'Privacidade', route: '/legal/privacidade' },
      { label: 'Termos de uso', route: '/legal/termos' },
      { label: 'Fale conosco', route: '/contato' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre o Flow', route: '/sobre' },
      { label: 'Blog', route: '/blog' },
      { label: 'Carreiras', route: '/carreiras' },
      { label: 'Imprensa', route: '/imprensa' },
      { label: 'Contato', route: '/contato' },
    ],
  },
];

export default function SiteFooter() {
  const go = (route: string) => {
    if (route === '/#baixar') {
      navigate('/');
      window.setTimeout(() => document.getElementById('baixar')?.scrollIntoView({ behavior: 'smooth' }), 150);
      return;
    }
    navigate(route);
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <img src="/logo.png" alt="FLOW — Conecte, Compartilhe, Viva" />
          <p>Seu mundo. Em movimento.</p>
          <p>Uma experiência social para descobrir, criar e conectar.</p>
          <NewsletterForm />
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="site-footer-col" aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((link) => (
              <button key={link.label} onClick={() => go(link.route)}>
                {link.label}
              </button>
            ))}
          </nav>
        ))}
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 Flow Serviços Online LTDA. Todos os direitos reservados.</span>
        <span>Conecte. Compartilhe. Viva.</span>
      </div>
    </footer>
  );
}
