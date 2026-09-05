import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { navigate } from '../../../hooks/useRouter';
import './SiteHeader.css';

const NAV = [
  { label: 'Início', route: '/' },
  { label: 'Recursos', route: '/recursos' },
  { label: 'Comunidades', route: '/comunidades' },
  { label: 'Criadores', route: '/criadores' },
  { label: 'Segurança', route: '/seguranca' },
  { label: 'Baixar App', route: '/baixar-app' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="site-brand" onClick={() => go('/')} aria-label="FLOW — Início">
          <img src="/logo.png" alt="FLOW — Conecte, Compartilhe, Viva" />
        </button>

        <nav className="site-nav" aria-label="Navegação principal">
          {NAV.map((item) => (
            <button
              key={item.route}
              className={path === item.route ? 'active' : ''}
              onClick={() => go(item.route)}
              aria-current={path === item.route ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-header-actions">
          <button className="site-icon-btn" onClick={() => go('/app/pesquisa')} aria-label="Pesquisar na FLOW">
            <Search size={20} />
          </button>
          <button className="site-login-btn" onClick={() => go('/login')}>
            Entrar
          </button>
          <button className="site-register-btn" onClick={() => go('/cadastro')}>
            Criar conta
          </button>
          <button className="site-menu-btn" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="site-mobile-nav" aria-label="Navegação móvel">
          {NAV.map((item) => (
            <button key={item.route} onClick={() => go(item.route)}>
              {item.label}
            </button>
          ))}
          <div className="site-mobile-cta">
            <button className="site-login-btn" onClick={() => go('/login')}>
              Entrar
            </button>
            <button className="site-register-btn" onClick={() => go('/cadastro')}>
              Criar conta
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
