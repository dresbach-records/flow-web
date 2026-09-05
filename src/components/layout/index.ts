// FLOW — Canonical layout barrel (FASE 3).
// Source of truth for AppShell/Sidebar/Topbar/RightRail/PageContainer.
// BottomNav + FloatingPlayer live in src/layouts/ (no canonical duplicate)
// and are re-exported here to eliminate ORPHAN status without runtime change.
export { default as AppShell } from './AppShell';
export { default as AppLayout } from './AppShell';
export { default as Sidebar } from './Sidebar';
export { default as Topbar } from './Topbar';
export { default as TopBar } from './Topbar';
export { default as RightRail } from './RightRail';
export { default as PageContainer } from './PageContainer';
export { default as BottomNav } from '../../layouts/BottomNav';
export { default as FloatingPlayer } from '../../layouts/FloatingPlayer';
