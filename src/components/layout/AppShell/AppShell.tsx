import React from 'react';
import TopBar from '../Topbar';
import Sidebar from '../Sidebar';
import RightRail from '../RightRail';
import './AppShell.css';

export interface AppShellProps {
  topBar?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightRail?: React.ReactNode;
  children: React.ReactNode;
  noRail?: boolean;
  path?: string;
  go?: (to: string) => void;
}

export default function AppShell({
  topBar,
  sidebar,
  rightRail,
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
    </div>
  );
}
