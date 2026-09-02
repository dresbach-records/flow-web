import React from 'react';
import { createRoot } from 'react-dom/client';
import FlowWeb from './app/FlowWeb';
import CreatorCenter from './app/CreatorCenter';
import AdminApp from './admin/AdminApp';
import ModuleCenter from './admin/ModuleCenter';
import SiteEditor from './admin/SiteEditor';
import AuthPage from './app/AuthPage';
import PlatformModules from './app/PlatformModules';
import './styles.css';
import './app/flow.css';
import './app/auth.css';
import './app/creator.css';
import './admin/admin.css';
import './admin/module-center.css';
import './admin/site-editor.css';
import './responsive.css';
import './app/platform-modules.css';

const root = createRoot(document.getElementById('root')!);
const authRoutes = ['/auth/login', '/login', '/cadastro', '/recuperar-senha', '/redefinir-senha', '/verificar-conta'];
const go = (next: string) => { history.pushState({}, '', next); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); };
function Router() {
  const [currentPath, setCurrentPath] = React.useState(location.pathname);
  React.useEffect(() => { const onPopState=()=>setCurrentPath(location.pathname); window.addEventListener('popstate',onPopState); return()=>window.removeEventListener('popstate',onPopState); },[]);
  if (currentPath === '/admin/modulos') return <AdminAppShell><ModuleCenter/></AdminAppShell>;
  if (currentPath === '/admin/site') return <AdminAppShell><SiteEditor/></AdminAppShell>;
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
function AdminAppShell({children}:{children:React.ReactNode}){
 const [auth,setAuth]=React.useState(localStorage.getItem('flow.admin.session')==='1');
 const [email,setEmail]=React.useState(''); const [pass,setPass]=React.useState('');
 if(!auth)return <div className="admin-login"><div className="admin-login-card"><div className="admin-login-brand"><img src="/flow-logo.svg" alt="FLOW"/><span className="admin-badge">ADMIN</span></div><h1>Acesso administrativo</h1><p>Área exclusiva do FLOW Control Center.</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail administrativo" type="email"/><input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" type="password"/><button className="admin-btn primary" onClick={()=>{if(email&&pass){localStorage.setItem('flow.admin.session','1');setAuth(true)}}}>Entrar no painel</button></div></div>;
 return <>{children}</>;
}
root.render(<Router />);
