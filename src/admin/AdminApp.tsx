import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bell, CheckCircle2, ChevronRight, CircleHelp, Eye, FileImage, Flag, Gauge, Heart, LayoutDashboard, LogOut, Menu, MessageCircle, Search, Settings, Shield, UserCog, Users, Video, X, Zap } from 'lucide-react';
import { loginAdmin, logout as firebaseLogout } from '../services/firebase/auth';
import { useAppContext } from '../contexts/AppContext';

type AdminRoute = string;
type Row = Record<string,string>;

const nav = [
  ['Dashboard','/admin',LayoutDashboard], ['Usuários','/admin/usuarios',Users], ['Conteúdo','/admin/conteudo',FileImage],
  ['Posts','/admin/posts',FileImage], ['Shorts','/admin/shorts',Video], ['Stories','/admin/stories',Eye], ['Lives','/admin/lives',Zap],
  ['Comentários','/admin/comentarios',MessageCircle], ['Denúncias','/admin/denuncias',Flag], ['Moderação','/admin/moderacao',Shield],
  ['Criadores','/admin/criadores',UserCog], ['Comunidades','/admin/comunidades',Users], ['Segurança','/admin/seguranca',Shield],
  ['Analytics','/admin/analytics',BarChart3], ['Relatórios','/admin/relatorios',FileImage], ['Administradores','/admin/administradores',UserCog],
  ['Configurações','/admin/configuracoes',Settings], ['Auditoria','/admin/auditoria',Activity], ['Logs','/admin/logs',Gauge],
] as const;

const users: Row[] = [
 {id:'USR-1024',user:'@flow.creator',name:'Flow Creator',status:'Ativo',followers:'128.4K',joined:'02/08/2026'},
 {id:'USR-1023',user:'@maria.flow',name:'Maria Santos',status:'Ativo',followers:'84.2K',joined:'01/08/2026'},
 {id:'USR-1022',user:'@joao.cria',name:'João Silva',status:'Ativo',followers:'57.8K',joined:'31/07/2026'},
 {id:'USR-1021',user:'@ana.digital',name:'Ana Costa',status:'Revisão',followers:'21.1K',joined:'29/07/2026'},
 {id:'USR-1020',user:'@lucas.dev',name:'Lucas Rocha',status:'Ativo',followers:'18.7K',joined:'28/07/2026'},
 {id:'USR-1019',user:'@bia.music',name:'Beatriz Lima',status:'Bloqueado',followers:'9.4K',joined:'25/07/2026'},
];
const content: Row[] = [
 {id:'#82931',type:'Post',creator:'@flow.creator',reach:'84.2K',likes:'12.8K',comments:'482',status:'Publicado'},
 {id:'#82930',type:'Vídeo',creator:'@maria.flow',reach:'142.8K',likes:'21.4K',comments:'913',status:'Publicado'},
 {id:'#82929',type:'Short',creator:'@joao.cria',reach:'428K',likes:'58.1K',comments:'2.4K',status:'Em revisão'},
 {id:'#82928',type:'Post',creator:'@ana.digital',reach:'12.4K',likes:'1.8K',comments:'96',status:'Publicado'},
 {id:'#82927',type:'Story',creator:'@lucas.dev',reach:'8.2K',likes:'—',comments:'41',status:'Expirado'},
];
const reports: Row[] = [
 {id:'#1042',reason:'Conteúdo impróprio',reporter:'@user_482',target:'Post #82929',date:'Hoje, 14:32',status:'Pendente'},
 {id:'#1041',reason:'Spam',reporter:'@creator_91',target:'@creator_91',date:'Hoje, 13:18',status:'Em análise'},
 {id:'#1040',reason:'Assédio',reporter:'@maria_88',target:'Post #82914',date:'Ontem, 21:04',status:'Pendente'},
 {id:'#1039',reason:'Falsa identidade',reporter:'@flow_221',target:'@flow_221',date:'Ontem, 18:42',status:'Resolvida'},
];
const creators = users.slice(0,5).map((u,i)=>({...u,views:['4.8M','3.2M','2.7M','1.9M','1.4M'][i],engagement:['18.4%','15.2%','13.8%','11.4%','9.8%'][i]}));

function go(path:string){ history.pushState({},'',path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0,0); }
function titleFor(path:string){ return nav.find(n=>path===n[1] || (path.startsWith(n[1]+'/') && n[1]!='/admin'))?.[0] || 'Dashboard'; }

export default function AdminApp(){
 const [path,setPath]=useState(location.pathname || '/admin');
 const [mobile,setMobile]=useState(false); const [search,setSearch]=useState(''); const [toast,setToast]=useState('');
 const { adminUser, setAdminUser } = useAppContext();
 useEffect(()=>{const fn=()=>setPath(location.pathname); addEventListener('popstate',fn); return()=>removeEventListener('popstate',fn)},[]);
 const navigate=(p:string)=>{go(p);setMobile(false)};
 const auth = Boolean(adminUser);
 const logout=async()=>{await firebaseLogout();setAdminUser(null);navigate('/admin/login')};
 if(path==='/admin/login' || !auth) return <AdminLogin onLogin={async(email,pass)=>{const user=await loginAdmin(email,pass);setAdminUser(user);navigate('/admin')}}/>;
 return <div className="admin-shell">
   <aside className={'admin-sidebar '+(mobile?'open':'')}>
     <div className="admin-brand"><img src="/flow-logo.svg" alt="FLOW"/><span className="admin-badge">ADMIN</span><button className="admin-icon-btn mobile-close" onClick={()=>setMobile(false)}><X/></button></div>
     <div className="admin-context">CONTROL CENTER</div>
     <nav>{nav.map(([label,route,Icon])=><button key={route} className={'admin-nav '+(path===route || (route!=='/admin'&&path.startsWith(route+'/'))?'active':'')} onClick={()=>navigate(route)}><Icon/><span>{label}</span>{label==='Denúncias'&&<b>19</b>}</button>)}</nav>
     <div className="admin-sidebar-spacer"/>
     <div className="admin-profile-mini"><div><div className="admin-avatar">{(adminUser?.displayName||'AD').slice(0,2).toUpperCase()}</div><div><strong>{adminUser?.displayName||'Administrador'}</strong><span>{adminUser?.role||'admin'}</span></div></div></div>
     <button className="admin-nav" onClick={logout}><LogOut/><span>Sair</span></button>
   </aside>
   <section className="admin-main">
     <header className="admin-header"><button className="admin-menu-mobile" onClick={()=>setMobile(true)}><Menu/></button><div className="admin-title"><strong>{titleFor(path)}</strong><small>FLOW / Administração</small></div><div className="admin-header-spacer"/><div className="admin-search"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar..."/></div><button className="admin-icon-btn"><Bell/><i>3</i></button><div className="admin-avatar">{(adminUser?.displayName||'AD').slice(0,2).toUpperCase()}</div></header>
     <main className="admin-content">{renderRoute(path,search,navigate,setToast)}</main>
   </section>
   {toast&&<div className="admin-toast">✓ {toast}</div>}
 </div>
}

function AdminLogin({onLogin}:{onLogin:(email:string,password:string)=>Promise<void>}){const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const submit=async()=>{if(!email||!pass){setError('Informe e-mail e senha para continuar.');return}setBusy(true);setError('');try{await onLogin(email,pass)}catch(err){setError(err instanceof Error?err.message:'Não foi possível entrar no painel.')}finally{setBusy(false)}};return <div className="admin-login"><div className="admin-login-card"><div className="admin-login-brand"><img src="/flow-logo.svg" alt="FLOW"/><span className="admin-badge">ADMIN</span></div><h1>Acesso administrativo</h1><p>Entre no Control Center do FLOW. Este acesso é exclusivo para administradores.</p>{error&&<div className="admin-error">{error}</div>}<div className="admin-field"><label>E-MAIL ADMINISTRATIVO</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="admin@flow.social" autoComplete="username"/></div><div className="admin-field"><label>SENHA</label><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" onKeyDown={e=>e.key==='Enter'&&submit()}/></div><button className="admin-btn primary" onClick={submit} disabled={busy}>{busy?'Entrando…':'Entrar no painel'}</button><div className="admin-login-meta"><span>Autenticação segura via Firebase.</span></div></div></div>}

function renderRoute(path:string,search:string,navigate:(p:string)=>void,setToast:(s:string)=>void){
 if(path==='/admin') return <Dashboard navigate={navigate} toast={setToast}/>;
 if(path==='/admin/usuarios') return <UsersPage search={search} navigate={navigate}/>;
 if(path.startsWith('/admin/usuarios/')) return <DetailPage kind="Usuário" id={path.split('/').pop()||''} navigate={navigate}/>;
 if(['/admin/conteudo','/admin/posts'].includes(path)) return <ContentPage type={path.endsWith('posts')?'Posts':'Conteúdo'} navigate={navigate}/>;
 if(path==='/admin/shorts') return <ShortsPage/>;
 if(path==='/admin/stories') return <SimpleTable title="Stories" subtitle="Acompanhe stories ativos, alcance e expiração." rows={content.filter(x=>x.type==='Story')} columns={['id','creator','reach','comments','status']}/>;
 if(path==='/admin/lives') return <LivesPage/>;
 if(path==='/admin/comentarios') return <CommentsPage/>;
 if(path==='/admin/denuncias') return <ReportsPage/>;
 if(path==='/admin/moderacao') return <ModerationPage/>;
 if(path==='/admin/criadores') return <CreatorsPage/>;
 if(path.startsWith('/admin/criadores/')) return <DetailPage kind="Criador" id={path.split('/').pop()||''} navigate={navigate}/>;
 if(path==='/admin/comunidades') return <CommunitiesPage/>;
 if(path.startsWith('/admin/comunidades/')) return <DetailPage kind="Comunidade" id={path.split('/').pop()||''} navigate={navigate}/>;
 if(path==='/admin/seguranca') return <SecurityPage/>;
 if(path.startsWith('/admin/analytics')) return <AnalyticsPage/>;
 if(path.startsWith('/admin/relatorios')) return <ReportsCenter/>;
 if(path==='/admin/administradores') return <AdminsPage/>;
 if(path==='/admin/configuracoes') return <SettingsPage/>;
 if(path==='/admin/auditoria') return <AuditPage/>;
 if(path==='/admin/logs') return <LogsPage/>;
 return <Dashboard navigate={navigate} toast={setToast}/>;
}

function Header({title,subtitle,action,children}:{title:string;subtitle:string;action?:string;children?:React.ReactNode}){return <div className="section-header"><div><div className="eyebrow">FLOW CONTROL CENTER</div><h1>{title}</h1><p>{subtitle}</p></div><div style={{display:'flex',gap:8}}>{children}{action&&<button className="admin-btn primary">{action}</button>}</div></div>}
function Metric({icon:Icon,label,value,delta}:{icon:any;label:string;value:string;delta:string}){return <div className="metric-card"><div className="metric-top"><span>{label}</span><div className="metric-icon"><Icon/></div></div><strong className="metric-value">{value}</strong><span className="metric-delta">{delta}</span></div>}
function Panel({title,children,action}:{title:string;children:React.ReactNode;action?:string}){return <div className="panel"><div className="panel-head"><h2>{title}</h2>{action&&<button>{action} <ChevronRight size={12}/></button>}</div>{children}</div>}
function Dashboard({navigate,toast}:{navigate:(p:string)=>void;toast:(s:string)=>void}){return <><Header title="Visão geral" subtitle="Acompanhe o ecossistema social do FLOW em tempo real." action="Exportar relatório"/><div className="metric-grid"><Metric icon={Users} label="Usuários" value="284,6K" delta="↑ 12,8% no período"/><Metric icon={FileImage} label="Conteúdos" value="1,84M" delta="↑ 8,4% no período"/><Metric icon={Eye} label="Visualizações" value="18,7M" delta="↑ 21,6% no período"/><Metric icon={Heart} label="Engajamentos" value="6,42M" delta="↑ 16,2% no período"/></div><div className="admin-grid"><Panel title="Crescimento de usuários" action="Últimos 30 dias"><div className="chart">{[38,45,42,51,48,58,55,68,63,73,71,82,78,90,86,94,91,103,99,111,108,120,116,129,124,138,134,147,143,154].map((v,i)=><div className="bar" style={{height:`${v/1.7}%`}} key={i}/>)}</div><div className="chart-labels"><span>01 AGO</span><span>08 AGO</span><span>15 AGO</span><span>22 AGO</span><span>30 AGO</span></div></Panel><Panel title="Distribuição de conteúdo" action="Este mês"><div className="donut-wrap"><div className="donut"><strong>1,84M</strong><span>conteúdos</span></div><div className="legend"><div><i/>Fotos <b>46%</b></div><div><i/>Vídeos <b>31%</b></div><div><i/>Shorts <b>23%</b></div></div></div></Panel></div><div className="admin-grid"><Panel title="Atividade recente" action="Ver tudo"><div className="activity">{[['Novo cadastro','@carlos.flow','há 2 min',Users],['Short viralizou','@pixel.art • 428K views','há 9 min',Video],['Post em alta','#tecnologia • 18,4K likes','há 17 min',Activity],['Denúncia resolvida','#1040 • Assédio','há 31 min',CheckCircle2]].map(([a,b,c,I])=><div className="activity-row" key={String(a)}>{React.createElement(I as React.ComponentType, null)}<div><strong>{String(a)}</strong><span>{String(b)}</span></div><time>{String(c)}</time></div>)}</div></Panel><Panel title="Central de moderação" action="Abrir central"><div className="mod-summary"><div className="mod-box"><AlertTriangle/><strong>37</strong><span>itens aguardando análise</span></div><div className="mod-box"><Flag/><strong>12</strong><span>denúncias novas</span></div><div className="mod-box"><CheckCircle2/><strong>184</strong><span>ações concluídas</span></div></div></Panel></div><Panel title="Ações rápidas"><div className="quick-grid"><button onClick={()=>navigate('/admin/usuarios')}>Gerenciar usuários</button><button onClick={()=>navigate('/admin/moderacao')}>Abrir fila de moderação</button><button onClick={()=>navigate('/admin/denuncias')}>Analisar denúncias</button><button onClick={()=>{toast('Relatório preparado para exportação.')}}>Gerar relatório</button></div></Panel></>}

function UsersPage({search,navigate}:{search:string;navigate:(p:string)=>void}){const [q,setQ]=useState(search);const rows=users.filter(u=>(u.user+' '+u.name+' '+u.id).toLowerCase().includes(q.toLowerCase()));return <><Header title="Usuários" subtitle="Gerencie contas, perfis, status e atividade." action="Exportar usuários"/><div className="toolbar"><div className="admin-search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome, username ou ID..."/></div><select className="filter-select"><option>Todos os status</option><option>Ativo</option><option>Revisão</option><option>Bloqueado</option></select></div><SimpleTable title="" subtitle="" rows={rows} columns={['id','user','name','status','followers','joined']} onRow={(r)=>navigate('/admin/usuarios/'+encodeURIComponent(r.id))}/></>}

function SimpleTable({title,subtitle,rows,columns,onRow}:{title:string;subtitle:string;rows:Row[];columns:string[];onRow?:(r:Row)=>void}){const label=(x:string)=>x==='id'?'ID':x==='user'?'USUÁRIO':x==='name'?'NOME':x==='creator'?'CRIADOR':x==='followers'?'SEGUIDORES':x==='joined'?'ENTRADA':x==='comments'?'COMENTÁRIOS':x==='reach'?'ALCANCE':x.toUpperCase();return <>{title&&<Header title={title} subtitle={subtitle}/>}<div className="table-panel"><table><thead><tr>{columns.map(c=><th key={c}>{label(c)}</th>)}{onRow&&<th>AÇÃO</th>}</tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.id} onClick={()=>onRow?.(r)} style={{cursor:onRow?'pointer':undefined}}>{columns.map(c=><td key={c}>{c==='status'?<span className={'status '+(r[c]==='Revisão'?'revisao':r[c]==='Resolvida'?'resolvida':'')}>{r[c]}</span>:r[c]}</td>)}{onRow&&<td><button className="table-action" onClick={(e)=>{e.stopPropagation();onRow(r)}}>Abrir</button></td>}</tr>):<tr><td colSpan={columns.length+(onRow?1:0)} style={{textAlign:'center',padding:40,color:'#8b969e'}}>Nenhum resultado.</td></tr>}</tbody></table></div></>}

function DetailPage({kind,id,navigate}:{kind:string;id:string;navigate:(p:string)=>void}){return <><Header title={`${kind} ${id}`} subtitle="Detalhes e ações administrativas."/><Panel title="Registro"><div style={{display:'grid',gap:12,fontSize:12}}><div><strong>Identificador</strong><p>{id}</p></div><div><strong>Status</strong><p>Ativo</p></div></div></Panel><button className="admin-btn" onClick={()=>navigate('/admin')}>Voltar</button></>}
function ContentPage({type,navigate}:{type:string;navigate:(p:string)=>void}){return <><Header title={type} subtitle="Gerencie conteúdos publicados e em revisão."/><SimpleTable title="" subtitle="" rows={content} columns={['id','type','creator','reach','likes','comments','status']}/></>}
function ShortsPage(){return <><Header title="Shorts" subtitle="Acompanhe vídeos curtos e desempenho."/><div className="shorts-admin-grid">{content.filter(x=>x.type==='Short').map(x=><article className="short-card" key={x.id}><div className="short-cover"><Video/><b>{x.reach} views</b></div><strong>{x.creator}</strong><span>{x.likes} curtidas · {x.comments} comentários</span></article>)}</div></>}
function LivesPage(){return <><Header title="Lives" subtitle="Monitore transmissões ao vivo."/><Panel title="Transmissões"><div className="empty-state"><Zap/><strong>Nenhuma live ativa.</strong></div></Panel></>}
function CommentsPage(){return <><Header title="Comentários" subtitle="Acompanhe comentários reportados e moderados."/><div className="comment-admin-list">{reports.map(r=><div className="comment-admin" key={r.id}><Flag/><div><strong>{r.reporter}</strong><p>{r.reason}</p><small>{r.target} · {r.date}</small></div><button>Revisar</button></div>)}</div></>}
function ReportsPage(){return <><Header title="Denúncias" subtitle="Analise denúncias e acompanhe seu tratamento."/><div className="report-cards"><div className="metric-mini"><Flag/><span>Pendentes</span><strong>12</strong></div><div className="metric-mini"><AlertTriangle/><span>Em análise</span><strong>7</strong></div><div className="metric-mini"><CheckCircle2/><span>Resolvidas</span><strong>184</strong></div></div><SimpleTable title="" subtitle="" rows={reports} columns={['id','reason','reporter','target','date','status']}/></>}
function ModerationPage(){return <><Header title="Moderação" subtitle="Fila de revisão e segurança de conteúdo."/><div className="moderation-grid"><Panel title="Fila"><div className="queue-row"><AlertTriangle/><div><strong>Post #82929</strong><span>Conteúdo impróprio</span></div><button>Revisar</button></div><div className="queue-row"><AlertTriangle/><div><strong>Short #82918</strong><span>Possível spam</span></div><button>Revisar</button></div></Panel><Panel title="Resumo"><div className="moderation-summary"><div><Shield/><strong>98,4%</strong><span>detecções automatizadas</span></div><div><CheckCircle2/><strong>184</strong><span>ações concluídas</span></div></div></Panel></div></>}
function CreatorsPage(){return <><Header title="Criadores" subtitle="Desempenho e gestão de criadores."/><SimpleTable title="" subtitle="" rows={creators} columns={['id','user','name','views','engagement','status']}/></>}
function CommunitiesPage(){return <><Header title="Comunidades" subtitle="Gestão de comunidades e moderadores."/><Panel title="Comunidades ativas"><div className="activity"><div className="activity-row"><Users/><div><strong>Tecnologia Brasil</strong><span>48,2K membros</span></div></div><div className="activity-row"><Users/><div><strong>Fotografia</strong><span>31,7K membros</span></div></div></div></Panel></>}
function SecurityPage(){return <><Header title="Segurança" subtitle="Controles de segurança e proteção da plataforma."/><div className="report-cards"><div className="metric-mini"><Shield/><span>Contas protegidas</span><strong>99,8%</strong></div><div className="metric-mini"><LockIcon/><span>Alertas</span><strong>34</strong></div><div className="metric-mini"><Activity/><span>Eventos</span><strong>2,8K</strong></div></div></>}
function LockIcon(){return <Shield/>}
function AnalyticsPage(){return <><Header title="Analytics" subtitle="Indicadores de crescimento e engajamento."/><Panel title="Visão de crescimento"><div className="bar-chart">{[45,52,39,66,72,57,78,84,71,92,88,100].map((h,i)=><div key={i}><span style={{height:`${h}%`}}/><small>{i+1}</small></div>)}</div></Panel></>}
function ReportsCenter(){return <><Header title="Relatórios" subtitle="Relatórios operacionais e de segurança."/><Panel title="Relatórios disponíveis"><div className="quick-actions"><button>Relatório de usuários</button><button>Relatório de conteúdo</button><button>Relatório de moderação</button><button>Relatório de segurança</button></div></Panel></>}
function AdminsPage(){return <><Header title="Administradores" subtitle="Gerencie papéis e acesso administrativo."/><Panel title="Equipe administrativa"><div className="activity"><div className="activity-row"><UserCog/><div><strong>Administrador principal</strong><span>Super Admin</span></div></div></div></Panel></>}
function SettingsPage(){return <><Header title="Configurações" subtitle="Configurações globais do Control Center."/><Panel title="Plataforma"><div className="setting-row"><strong>Modo de manutenção</strong><span>Controla a disponibilidade pública.</span></div><div className="setting-row"><strong>Moderação automática</strong><span>Aplica políticas antes da publicação.</span></div></Panel></>}
function AuditPage(){return <><Header title="Auditoria" subtitle="Eventos administrativos e trilhas de auditoria."/><Panel title="Últimos eventos"><div className="activity"><div className="activity-row"><Activity/><div><strong>Login administrativo</strong><span>Autenticação Firebase</span></div><time>agora</time></div></div></Panel></>}
function LogsPage(){return <><Header title="Logs" subtitle="Eventos e diagnósticos do Control Center."/><Panel title="Logs recentes"><div className="empty-state"><Gauge/><strong>Use o backend para consultar logs de produção.</strong></div></Panel></>}
