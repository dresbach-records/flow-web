/**
 * FLOW — BottomNav
 * Barra de navegação inferior para dispositivos móveis.
 * Tátil, com botão central de criar e indicação de rota ativa.
 */
import { Bell, Compass, House, Plus, UserRound } from 'lucide-react';

interface BottomNavProps {
  path: string;
  go: (to: string) => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  match: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: <House size={24} />,
    label: 'Início',
    route: '/app',
    match: (p) => p === '/app' || p === '/app/for-you' || p === '/app/seguindo',
  },
  {
    icon: <Compass size={24} />,
    label: 'Explorar',
    route: '/app/explorar',
    match: (p) => p.startsWith('/app/explorar'),
  },
];

const NAV_ITEMS_RIGHT: NavItem[] = [
  {
    icon: <Bell size={24} />,
    label: 'Notificações',
    route: '/app/notificacoes',
    match: (p) => p.startsWith('/app/notificacoes'),
  },
  {
    icon: <UserRound size={24} />,
    label: 'Perfil',
    route: '/app/perfil',
    match: (p) => p.startsWith('/app/perfil'),
  },
];

export default function BottomNav({ path, go }: BottomNavProps) {
  return (
    <nav className="flow-bottom-nav" aria-label="Navegação mobile" role="navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = item.match(path);
        return (
          <button
            key={item.route}
            className={`flow-bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => go(item.route)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Create — center CTA */}
      <button
        className="flow-bottom-nav-create"
        onClick={() => go('/app/criar')}
        aria-label="Criar publicação"
        id="bottom-nav-create-btn"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {NAV_ITEMS_RIGHT.map((item) => {
        const isActive = item.match(path);
        return (
          <button
            key={item.route}
            className={`flow-bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => go(item.route)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
