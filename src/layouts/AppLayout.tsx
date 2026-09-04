/**
 * FLOW — AppLayout
 * Shell principal para todas as telas autenticadas.
 *
 * Estrutura CSS Grid:
 *   .flow-app-shell (grid: 260px minmax(0, 1fr) 320px)
 *     ├── .flow-topbar           (grid-area: topbar, sticky 64px)
 *     ├── .flow-sidebar          (grid-area: sidebar, sticky)
 *     ├── .flow-app-content      (grid-area: main, natural scroll)
 *     ├── .flow-right-rail-column (grid-area: rail, sticky)
 *     ├── .flow-bottom-nav       (mobile fixed)
 *     └── .flow-floating-player  (floating player)
 */
import React, { useState, useCallback } from 'react';
import RightRail from '../components/layout/RightRail';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import FloatingPlayer from './FloatingPlayer';
import '../styles/app-layout.css';

interface AppLayoutProps {
  path: string;
  go: (to: string) => void;
  children: React.ReactNode;
}

export default function AppLayout({ path, go, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('flow.sidebar.collapsed') === '1'; }
    catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem('flow.sidebar.collapsed', next ? '1' : '0'); } catch { /* noop */ }
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className={`flow-app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Top bar — across full width */}
      <Topbar
        go={go}
        onMenuClick={openMobile}
        collapsed={collapsed}
      />

      {/* Left sidebar */}
      <Sidebar
        path={path}
        go={go}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      {/* Main content */}
      <main className="flow-app-content" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* Right rail */}
      <aside className="flow-right-rail-column" aria-label="Painel lateral direito">
        <RightRail go={go} />
      </aside>

      {/* Mobile bottom navigation */}
      <BottomNav path={path} go={go} />

      {/* Floating music player */}
      <FloatingPlayer />
    </div>
  );
}
