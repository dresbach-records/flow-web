/**
 * FLOW — AppLayout
 * Shell principal para todas as telas autenticadas.
 *
 * Estrutura:
 *   .flow-app-shell
 *     ├── .flow-sidebar          (position: fixed, left)
 *     ├── .flow-topbar           (position: fixed, top)
 *     ├── .flow-app-content      (margin offsets, body scrolls)
 *     ├── .flow-right-rail-column (position: fixed, right)
 *     ├── .flow-bottom-nav       (position: fixed, mobile)
 *     └── .flow-floating-player  (position: fixed, bottom-right)
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
      {/* Left sidebar — position: fixed */}
      <Sidebar
        path={path}
        go={go}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      {/* Top bar — position: fixed, full width */}
      <Topbar
        go={go}
        onMenuClick={openMobile}
        collapsed={collapsed}
      />

      {/* Main scrollable content */}
      <main className="flow-app-content" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* Right rail — position: fixed */}
      <div className="flow-right-rail-column" aria-label="Painel lateral direito">
        <RightRail go={go} />
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav path={path} go={go} />

      {/* Floating music player */}
      <FloatingPlayer />
    </div>
  );
}
