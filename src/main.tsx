import React from 'react';
import { createRoot } from 'react-dom/client';
import FlowWeb from './app/FlowWeb';
import AdminApp from './admin/AdminApp';
import AuthPage from './app/AuthPage';
import './styles.css';
import './app/flow.css';
import './app/auth.css';
import './admin/admin.css';
import './responsive.css';

const root = createRoot(document.getElementById('root')!);
const authRoutes = ['/auth/login', '/login', '/cadastro', '/recuperar-senha', '/redefinir-senha', '/verificar-conta'];
const go = (next: string) => { history.pushState({}, '', next); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); };
function Router() {
  const [currentPath, setCurrentPath] = React.useState(location.pathname);
  React.useEffect(() => { const onPopState=()=>setCurrentPath(location.pathname); window.addEventListener('popstate',onPopState); return()=>window.removeEventListener('popstate',onPopState); },[]);
  if (currentPath.startsWith('/admin')) return <AdminApp />;
  if (authRoutes.includes(currentPath)) return <AuthPage path={currentPath} go={go} />;
  return <FlowWeb />;
}
root.render(<Router />);
