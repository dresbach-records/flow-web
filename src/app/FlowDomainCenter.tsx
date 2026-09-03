import React from 'react';
import { flowApi, type FlowRecord } from '../services/api/flow';

const domains:Record<string,{title:string;collections:string[]}>={
 social:{title:'Social',collections:['posts','videos','shorts','stories','lives','comments','likes','shares','saves','follows','hashtags','mentions']},
 pages:{title:'Páginas',collections:['pages','page_members','page_roles','page_posts','page_analytics']},
 communities:{title:'Comunidades',collections:['communities','community_members','community_roles','community_rules','community_posts']},
 communication:{title:'Mensagens e chamadas',collections:['conversations','messages','calls','call_participants']},
 shop:{title:'Flow Shop',collections:['shops','sellers','categories','products','carts','orders','order_items','payments','shipments','deliveries','protection_periods','complaints','returns','refunds','commissions','affiliates']},
 rewards:{title:'Rewards',collections:['reward_tasks','reward_campaigns','qualified_views','rewards','wallets','wallet_ledger','withdrawals','anti_fraud_events']},
 ads:{title:'Ads',collections:['advertisers','ad_accounts','ad_campaigns','ad_groups','ads','creatives','audiences','approved_domains','ad_reviews','ad_impressions','ad_clicks','ad_conversions']},
 moderation:{title:'Moderação',collections:['reports','moderation_cases','moderation_evidence','moderation_actions','appeals','content_policies','product_policies','copyright_cases','piracy_cases']},
 security:{title:'Segurança e recuperação',collections:['accounts','sessions','devices','blocks','security_events','account_recovery_requests','account_restrictions','account_bans']},
 admin:{title:'Admin',collections:['admin_users','roles','permissions','admin_sessions','module_settings','platform_settings','analytics_events','audit_logs']},
};

export default function FlowDomainCenter({domain='social'}:{domain?:string}){
 const cfg=domains[domain]??domains.social; const [collection,setCollection]=React.useState(cfg.collections[0]); const [items,setItems]=React.useState<FlowRecord[]>([]); const [loading,setLoading]=React.useState(false); const [error,setError]=React.useState(''); const [json,setJson]=React.useState('{}');
 const load=React.useCallback(async()=>{setLoading(true);setError('');try{const p=await flowApi.list<FlowRecord>(collection);setItems(p.items);}catch(e){setError(e instanceof Error?e.message:'Falha ao carregar');}finally{setLoading(false);}},[collection]);
 React.useEffect(()=>{void load()},[load]);
 async function create(){try{const data=JSON.parse(json) as Record<string,unknown>;await flowApi.create(collection,data);setJson('{}');await load();}catch(e){setError(e instanceof Error?e.message:'JSON inválido');}}
 return <section className="flow-domain-center"><header><span className="eyebrow">FLOW PLATFORM</span><h1>{cfg.title}</h1><p>Operação conectada à API e persistência real. Nenhum dado local é usado como fonte de verdade.</p></header><nav className="flow-domain-tabs">{Object.entries(domains).map(([key,d])=><a href={`/app/${key}`} key={key}>{d.title}</a>)}</nav><div className="flow-domain-grid"><aside><h2>Módulos</h2>{cfg.collections.map(c=><button className={c===collection?'active':''} onClick={()=>setCollection(c)} key={c}>{c}</button>)}</aside><main><div className="flow-toolbar"><strong>{collection}</strong><button onClick={()=>void load()}>Atualizar</button></div>{error&&<div role="alert" className="flow-error">{error}</div>}<div className="flow-create"><textarea value={json} onChange={e=>setJson(e.target.value)} aria-label="Dados JSON"/><button onClick={()=>void create()}>Criar registro</button></div>{loading?<p>Carregando…</p>:items.length===0?<p>Nenhum registro encontrado.</p>:<div className="flow-records">{items.map(item=><article key={item.id}><code>{item.id}</code><pre>{JSON.stringify(item,null,2)}</pre></article>)}</div>}</main></div></section>;
}
