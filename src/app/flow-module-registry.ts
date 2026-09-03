export type FlowModuleArea='social'|'commerce'|'finance'|'communication'|'moderation'|'admin'|'account';
export interface FlowFrontendModule { key:string; label:string; area:FlowModuleArea; route:string; icon?:string; auth:true; admin?:boolean; }

export const FLOW_FRONTEND_MODULES: FlowFrontendModule[] = [
{key:'feed',label:'Feed',area:'social',route:'/feed',auth:true},
{key:'videos',label:'Vídeos',area:'social',route:'/videos',auth:true},
{key:'shorts',label:'Shorts',area:'social',route:'/shorts',auth:true},
{key:'stories',label:'Stories',area:'social',route:'/stories',auth:true},
{key:'lives',label:'Lives',area:'social',route:'/lives',auth:true},
{key:'friends',label:'Amigos',area:'social',route:'/friends',auth:true},
{key:'followers',label:'Seguidores',area:'social',route:'/followers',auth:true},
{key:'pages',label:'Páginas',area:'social',route:'/pages',auth:true},
{key:'communities',label:'Comunidades',area:'social',route:'/communities',auth:true},
{key:'messages',label:'Mensagens',area:'communication',route:'/messages',auth:true},
{key:'calls',label:'Chamadas',area:'communication',route:'/calls',auth:true},
{key:'notifications',label:'Notificações',area:'communication',route:'/notifications',auth:true},
{key:'creator',label:'Creator Studio',area:'finance',route:'/creator',auth:true},
{key:'shop',label:'Flow Shop',area:'commerce',route:'/shop',auth:true},
{key:'my-shop',label:'Minha loja',area:'commerce',route:'/shop/manage',auth:true},
{key:'orders',label:'Pedidos',area:'commerce',route:'/shop/orders',auth:true},
{key:'wallet',label:'Carteira',area:'finance',route:'/wallet',auth:true},
{key:'rewards',label:'Rewards',area:'finance',route:'/rewards',auth:true},
{key:'ads',label:'Publicidade',area:'finance',route:'/ads',auth:true},
{key:'ad-campaigns',label:'Campanhas',area:'finance',route:'/ads/campaigns',auth:true},
{key:'ad-billing',label:'Saldo e pagamentos',area:'finance',route:'/ads/billing',auth:true},
{key:'security',label:'Segurança',area:'account',route:'/settings/security',auth:true},
{key:'account-recovery',label:'Conta hackeada',area:'account',route:'/account/recovery',auth:true},
{key:'appeals',label:'Recursos',area:'moderation',route:'/appeals',auth:true},
{key:'admin',label:'Administração',area:'admin',route:'/admin',auth:true,admin:true}
];
