 v0/flow-db-structure
const items = [['/app','Início'],['/app/explorar','Explorar'],['/app/criar','Criar'],['/app/shorts','Shorts'],['/app/perfil','Perfil']] as const;
export function BottomNavigationBar(){return <nav className="flow-bottom-nav" aria-label="Navegação principal">{items.map(([to,label])=><a key={to} href={to}>{label}</a>)}</nav>}

import { navigate } from '../../hooks/useRouter';
const items = [['/app','Início'],['/app/explorar','Explorar'],['/app/criar','Criar'],['/app/shorts','Shorts'],['/app/perfil','Perfil']];
export function BottomNavigationBar(){return <nav className="flow-bottom-nav" aria-label="Navegação principal">{items.map(([to,label])=><a key={to} href={to} onClick={event=>{event.preventDefault();navigate(to)}}>{label}</a>)}</nav>}
 main
