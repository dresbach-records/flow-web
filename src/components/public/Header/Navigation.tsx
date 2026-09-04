import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Comunidades', href: '/comunidades' },
  { label: 'Criadores', href: '/criadores' },
  { label: 'Segurança', href: '/seguranca' },
  { label: 'Blog', href: '/blog' },
  { label: 'Ajuda', href: '/ajuda' },
];

export interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  className = '',
}) => {
  return (
    <nav className={`flow-header-nav ${className}`} aria-label="Navegação Principal">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? currentPath === '/'
            : currentPath.startsWith(item.href);

        return (
          <button
            key={item.href}
            type="button"
            className={`flow-header-nav__link ${isActive ? 'flow-header-nav__link--active' : ''}`}
            onClick={() => onNavigate(item.href)}
          >
            {item.label}
            {isActive && <span className="flow-header-nav__indicator" />}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
