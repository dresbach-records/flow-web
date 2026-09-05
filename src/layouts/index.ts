// FLOW — layouts barrel (FASE 3).
// Runtime preservation: `AppLayout` alias still resolves to the canonical
// components/layout/AppShell (what src/App.tsx consumes today).
// The physical legacy files below are preserved untouched for FASE 4 visual
// decision and are now explicitly exported (no longer hidden/colliding).
export { default as AppLayout } from '../components/layout/AppShell';
export { default as AppShell } from '../components/layout/AppShell';
export { default as Sidebar } from '../components/layout/Sidebar';
export { default as Topbar } from '../components/layout/Topbar';
export { default as RightRail } from '../components/layout/RightRail';
export { default as PageContainer } from '../components/layout/PageContainer';
export { default as BottomNav } from './BottomNav';
export { default as FloatingPlayer } from './FloatingPlayer';
// Legacy full-featured shell (collapsed sidebar, mobile overlay, logout,
// BottomNav + FloatingPlayer composition). ORPHAN today; kept for FASE 4.
export { default as LegacyAppLayout } from './AppLayout';
export { default as LegacySidebar } from './Sidebar';
export { default as LegacyTopbar } from './Topbar';
