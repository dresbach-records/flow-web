// FLOW — PlatformModules (FASE 1: sem mocks).
// Shop/Seller/Orders/Ads/Rewards: PENDENTES (sem backend) — EmptyState honesto,
// sem produtos, valores ou pedidos fictícios (REGRA DE CONCLUSÃO FLOW).
// Report: denúncia REAL via coleção `reports` (firestore.rules).
// Safety: conteúdo informativo institucional (sem simulação de dados).
import {useState} from 'react';
import {AlertTriangle,ArrowLeft,CheckCircle2,Clock3,Flag,Lock,Megaphone,Package,ShieldCheck,X} from 'lucide-react';
import {RewardsPage} from './rewards/RewardsPage';
import { createDocument } from '../services/firebase/firestore';
import { requireFirebaseAuth } from '../services/firebase/config';
import EmptyState from '../components/ui/EmptyState';
import './platform-modules.css';

type Screen='shop'|'seller'|'orders'|'rewards'|'ads'|'report'|'safety';
const go=(p:string)=>{history.pushState({},'',p);dispatchEvent(new PopStateEvent('popstate'));window.scrollTo(0,0)};
export default function PlatformModules({screen}:{screen:Screen}){if(screen==='rewards')return <RewardsPage/>;if(screen==='shop')return <Shop/>;if(screen==='seller')return <Seller/>;if(screen==='orders')return <Orders/>;if(screen==='ads')return <Ads/>;if(screen==='report')return <Report/>;return <Safety/>}
function Shell({title,children}:{title:string;children:React.ReactNode}){return <div className="module"><header className="module-head"><button onClick={()=>go('/app')}><ArrowLeft/> FLOW</button><h1>{title}</h1><button onClick={()=>go('/app')}><X/></button></header>{children}</div>}
function Pending({title,eyebrow,description}:{title:string;eyebrow:string;description:string}){return <Shell title={title}><div style={{padding:'48px 24px'}}><EmptyState title={`${eyebrow} em implementação`} description={description}/></div></Shell>}
function Shop(){return <Pending title="FLOW Shop" eyebrow="Marketplace" description="Catálogo, carrinho e pedidos reais chegam com o backend de marketplace (Fase 9). Nenhum produto é exibido até lá."/>}
function Seller(){return <Pending title="Minha loja" eyebrow="Loja do vendedor" description="Vitrine, produtos e repasses reais chegam com o backend de marketplace (Fase 9). Nenhum valor é exibido até lá."/>}
function Orders(){return <Pending title="Meus pedidos" eyebrow="Pedidos" description="Pedidos e proteção de compra reais chegam com o backend de marketplace (Fase 9). Nenhum pedido é exibido até lá."/>}
function Ads(){return <Shell title="FLOW Ads"><div className="ads-hero"><Megaphone/><div><span className="eyebrow">ANUNCIE</span><h2>Alcance pessoas dentro do FLOW.</h2><p>Anúncios passam por análise e controles de segurança antes da publicação.</p></div></div><div className="ad-form"><label>Nome da empresa<input placeholder="Empresa / marca" disabled/></label><label>CNPJ<input placeholder="00.000.000/0000-00" disabled/></label><label>Destino do anúncio<input placeholder="https://seu-dominio.com.br" disabled/></label><div className="policy"><Lock/><span>Criação de campanhas com revisão chega na Fase 9. Formulário desabilitado até lá — nada é enviado.</span></div><button className="primary" disabled title="Disponível na Fase 9">Enviar para revisão <ShieldCheck/></button></div></Shell>}
function Report(){
  const[category,setCategory]=useState('');
  const[description,setDescription]=useState('');
  const[url,setUrl]=useState('');
  const[protocol,setProtocol]=useState<string|null>(null);
  const[sending,setSending]=useState(false);
  const[formError,setFormError]=useState<string|null>(null);
  const submit=()=>{
    setFormError(null);
    if(!category){setFormError('Selecione uma categoria.');return;}
    if(description.trim().length<10){setFormError('Descreva o ocorrido com pelo menos 10 caracteres.');return;}
    setSending(true);
    try{
      const uid=requireFirebaseAuth().currentUser?.uid;
      if(!uid){setFormError('Faça login para enviar uma denúncia.');setSending(false);return;}
      void createDocument('reports',{reporterId:uid,status:'OPEN',category,description:description.trim(),url:url.trim()||null})
        .then((id)=>setProtocol(id))
        .catch(()=>setFormError('Não foi possível registrar. Tente novamente.'))
        .finally(()=>setSending(false));
    }catch{
      setFormError('Faça login para enviar uma denúncia.');
      setSending(false);
    }
  };
  return <Shell title="Denunciar"><div className="report-box"><Flag/><span className="eyebrow">CENTRAL DE DENÚNCIAS</span><h2>Ajude a manter o FLOW seguro.</h2><p>Informe conteúdo, anúncio, produto ou perfil que viole as regras.</p><label>Categoria<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Selecione</option><option>Pirataria / falsificação</option><option>Golpe / fraude</option><option>Pornografia / conteúdo sexual</option><option>Violência</option><option>Produto proibido</option><option>Outro</option></select></label><label>Descrição<textarea placeholder="Conte o que aconteceu..." value={description} onChange={e=>setDescription(e.target.value)}/></label><label>URL do conteúdo<input placeholder="https://flow..." value={url} onChange={e=>setUrl(e.target.value)}/></label>{formError&&<p role="alert" style={{color:'#DC2626',fontSize:13}}>{formError}</p>}<button className="primary" onClick={submit} disabled={sending||protocol!==null}>{sending?'Enviando...':protocol?'Denúncia registrada':'Enviar denúncia'}</button>{protocol&&<div className="success"><CheckCircle2/> Denúncia registrada. Protocolo {protocol}.</div>}</div></Shell>
}
function Safety(){const rules=['Pirataria, falsificações e uso não autorizado de propriedade intelectual','Pornografia, nudez sexual explícita e exploração sexual','Produtos de saúde ou emagrecimento sem os requisitos regulatórios aplicáveis','Golpes, phishing, malware e práticas fraudulentas','Armas, drogas ilícitas e outros produtos proibidos','Conteúdo que coloque crianças e adolescentes em risco'];return <Shell title="Segurança e confiança"><div className="safety-grid"><div><span className="eyebrow">TRUST & SAFETY</span><h2>Segurança desde a publicação.</h2><p>Conteúdo, produtos e anúncios passam por políticas, sinais de risco e mecanismos de denúncia.</p><button className="primary" onClick={()=>go('/app/denunciar')}><Flag/> Denunciar</button></div><div className="rule-list">{rules.map(r=><div key={r}><AlertTriangle/><span>{r}</span></div>)}</div></div><div className="safety-cards"><article><ShieldCheck/><b>Verificação</b><p>Contas e empresas seguem os fluxos de identidade definidos pelo FLOW.</p></article><article><Clock3/><b>Revisão</b><p>Casos suspeitos podem ficar retidos para análise antes da distribuição.</p></article><article><Lock/><b>Privacidade</b><p>Dados de identidade não são exibidos publicamente no perfil.</p></article></div><div className="shop-note" style={{marginTop:24}}><Package/><div><b>Proteção de compra FLOW</b><p>Pedidos possuem janela de proteção de 7 dias após a entrega e liberação de repasse após confirmação — regras aplicadas pelo backend de marketplace (Fase 9).</p></div></div></Shell>}
