import React from 'react';
import TopBar from '../Topbar';
import Sidebar from '../Sidebar';
import RightRail from '../RightRail';
import BottomNav from '../../../layouts/BottomNav';
import FloatingPlayer from '../../../layouts/FloatingPlayer';
import './AppShell.css';

export interface AppShellProps {
  topBar?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightRail?: React.ReactNode;
  bottomNav?: React.ReactNode;
  floatingPlayer?: React.ReactNode;
  children: React.ReactNode;
  noRail?: boolean;
  path?: string;
  go?: (to: string) => void;
}

export default function AppShell({
  topBar,
  sidebar,
  rightRail,
  bottomNav,
  floatingPlayer,
  children,
  noRail = false,
  path = typeof window !== 'undefined' ? window.location.pathname : '/app',
  go = (to) => {
    history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  },
}: AppShellProps) {
  const resolvedTopBar = topBar !== undefined ? topBar : <TopBar go={go} />;
  const resolvedSidebar = sidebar !== undefined ? sidebar : <Sidebar path={path} go={go} />;
  const resolvedRightRail = rightRail !== undefined ? rightRail : (!noRail ? <RightRail go={go} /> : null);
  const hasRail = Boolean(resolvedRightRail);
  // FASE 3: BottomNav (mobile-only via CSS) + FloatingPlayer (null sem track)
  // passam a compor o shell canônico — elimina ORPHAN sem alterar o desktop.
  // Requer PlayerProvider acima (garantido em src/App.tsx para /app e /memorial).
  const resolvedBottomNav = bottomNav !== undefined ? bottomNav : <BottomNav path={path} go={go} />;
  const resolvedFloatingPlayer = floatingPlayer !== undefined ? floatingPlayer : <FloatingPlayer />;

  return (
    <div className={`flow-app-shell ${!hasRail ? 'no-rail' : ''}`}>
      {resolvedTopBar && <header className="flow-shell-topbar-slot">{resolvedTopBar}</header>}
      {resolvedSidebar && <aside className="flow-shell-sidebar-slot">{resolvedSidebar}</aside>}
      <main className="flow-shell-content-slot" id="main-content" tabIndex={-1}>
        <div className="flow-shell-content-inner">
          {children}
        </div>
      </main>
      {hasRail && <aside className="flow-shell-rightrail-slot">{resolvedRightRail}</aside>}
      {resolvedBottomNav}
      {resolvedFloatingPlayer}
    </div>
  );
}
