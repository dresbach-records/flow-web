import { NavLink } from 'react-router-dom';
const items = [['/app','Início'],['/app/explorar','Explorar'],['/app/criar','Criar'],['/app/shorts','Shorts'],['/app/perfil','Perfil']];
export function BottomNavigationBar(){return <nav className="flow-bottom-nav" aria-label="Navegação principal">{items.map(([to,label])=><NavLink key={to} to={to}>{label}</NavLink>)}</nav>}
