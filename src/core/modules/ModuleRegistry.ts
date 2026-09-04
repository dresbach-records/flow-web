export type ModuleState='enabled'|'maintenance'|'disabled';
export type ModuleArea='site'|'app'|'admin';
export interface FlowModuleDefinition{key:string;name:string;area:ModuleArea[];defaultState:ModuleState;requiresAuth?:boolean;adminRoute?:string;routes:string[];}
export const FLOW_MODULES:FlowModuleDefinition[]=[
{key:'site',name:'Site institucional',area:['site','admin'],defaultState:'enabled',adminRoute:'/admin/site',routes:['/']},
{key:'auth',name:'Autenticação',area:['site','app'],defaultState:'enabled',routes:['/login','/cadastro','/recuperar-senha','/redefinir-senha','/verificar-conta']},
{key:'feed',name:'For You e Following',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app','/app/seguindo']},
{key:'explore',name:'Explorar e busca',area:['site','app','admin'],defaultState:'enabled',routes:['/explorar','/app/explorar','/app/busca','/app/hashtag/:tag']},
{key:'shorts',name:'Shorts',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/shorts','/admin/shorts']},
{key:'stories',name:'Stories',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/stories','/admin/stories']},
{key:'live',name:'Live',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/live','/admin/lives']},
{key:'social',name:'Posts, reações e comentários',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/criar/post','/app/post/:id','/admin/posts','/admin/comentarios']},
{key:'profiles',name:'Perfis e criadores',area:['app','admin'],defaultState:'enabled',routes:['/app/perfil','/app/perfil/:username','/admin/criadores']},
{key:'messaging',name:'Mensagens',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/mensagens','/admin/seguranca']},
{key:'communities',name:'Comunidades',area:['site','app','admin'],defaultState:'enabled',routes:['/comunidades','/app/comunidades','/app/comunidades/:slug','/admin/comunidades']},
{key:'shop',name:'FLOW Shop',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/shop','/app/loja','/app/pedidos']},
{key:'seller',name:'Vendedores e lojas',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/loja','/admin/lojas']},
{key:'affiliate',name:'Afiliados e comissões',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/afiliados','/admin/afiliados']},
{key:'ads',name:'FLOW Ads',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/ads','/app/anunciar','/admin/anuncios']},
{key:'rewards',name:'FLOW Rewards',area:['app','admin'],defaultState:'enabled',requiresAuth:true,routes:['/app/rewards','/admin/rewards']},
{key:'moderation',name:'Moderação',area:['app','admin'],defaultState:'enabled',routes:['/app/denunciar','/admin/moderacao','/admin/denuncias']},
{key:'antiPiracy',name:'Antipirataria e propriedade intelectual',area:['app','admin'],defaultState:'enabled',routes:['/admin/propriedade-intelectual']},
{key:'trustSafety',name:'Trust & Safety',area:['site','admin'],defaultState:'enabled',routes:['/seguranca','/admin/seguranca']},
{key:'analytics',name:'Analytics e relatórios',area:['admin'],defaultState:'enabled',routes:['/admin/analytics','/admin/relatorios']},
{key:'audit',name:'Auditoria e logs',area:['admin'],defaultState:'enabled',routes:['/admin/auditoria','/admin/logs']}
];
export const DEFAULT_MODULE_STATES=Object.fromEntries(FLOW_MODULES.map(m=>[m.key,m.defaultState])) as Record<string,ModuleState>;
export const moduleRegistry = FLOW_MODULES;
export type PlatformModule = FlowModuleDefinition;
export function getModule(key:string){return FLOW_MODULES.find(module=>module.key===key);}
export function isModuleEnabled(key:string, states:Record<string,ModuleState>=DEFAULT_MODULE_STATES){return states[key]==='enabled';}
