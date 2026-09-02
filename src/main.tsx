import React from 'react';
import { createRoot } from 'react-dom/client';
import FlowWeb from './app/FlowWeb';
import CreatorCenter from './app/CreatorCenter';
import AdminApp from './admin/AdminApp';
import AuthPage from './app/AuthPage';
import PlatformModules from './app/PlatformModules';
import './styles.css';
import './app/flow.css';
import './app/auth.css';
import './app/creator.css';
import './admin/admin.css';
import './responsive.css';
import './app/platform-modules.css';

const root = createRoot(document.getElementById('root')!);
const authRoutes = ['/auth/login', '/login', '/cadastro', '/recuperar-senha', '/redefinir-senha', '/verificar-conta'];
const go = (next: string) => { history.pushState({}, '', next); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); };
function Router() {
  const [currentPath, setCurrentPath] = React.useState(location.pathname);
  React.useEffect(() => { const onPopState=()=>setCurrentPath(location.pathname); window.addEventListener('popstate',onPopState); return()=>window.removeEventListener('popstate',onPopState); },[]);
  if (currentPath.startsWith('/admin')) return <AdminApp />;
  if (authRoutes.includes(currentPath)) return <AuthPage path={currentPath} go={go} />;
  if (currentPath.startsWith('/app/criador')) return <CreatorCenter />;
  if (currentPath === '/app/shop' || currentPath === '/app/loja') return <PlatformModules screen={currentPath === '/app/shop' ? 'shop' : 'seller'} />;
  if (currentPath === '/app/pedidos') return <PlatformModules screen="orders" />;
  if (currentPath === '/app/rewards') return <PlatformModules screen="rewards" />;
  if (currentPath === '/app/anunciar' || currentPath === '/app/ads') return <PlatformModules screen="ads" />;
  if (currentPath === '/app/denunciar') return <PlatformModules screen="report" />;
  if (currentPath === '/app/seguranca') return <PlatformModules screen="safety" />;
  return <FlowWeb />;
}
root.render(<Router />);
