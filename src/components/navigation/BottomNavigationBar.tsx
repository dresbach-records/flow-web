import { navigate } from '../../hooks/useRouter';
const items = [['/app','Início'],['/app/explorar','Explorar'],['/app/criar','Criar'],['/app/shorts','Shorts'],['/app/perfil','Perfil']];
export function BottomNavigationBar(){return <nav className="flow-bottom-nav" aria-label="Navegação principal">{items.map(([to,label])=><a key={to} href={to} onClick={event=>{event.preventDefault();navigate(to)}}>{label}</a>)}</nav>}
