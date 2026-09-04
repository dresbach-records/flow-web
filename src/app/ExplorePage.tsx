import { useMemo, useState, type ReactNode } from 'react';
import { Compass, Heart, Search, ShoppingBag, Sparkles, Users, Video, Camera, MessageCircle, ExternalLink } from 'lucide-react';
import './explore-page.css';

const go = (path: string) => {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
};

const trends = [
  { tag: '#FlowAoVivo', count: '12,5 mil posts' },
  { tag: '#CriadoresFLOW', count: '8.742 posts' },
  { tag: '#EmMovimento', count: '6.338 posts' },
  { tag: '#ConexõesReais', count: '4.921 posts' },
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const resultLabel = useMemo(() => submitted ? `Resultados para “${submitted}”` : 'Descubra o que está acontecendo', [submitted]);

  return <div className="flow-explore-page">
    <header className="flow-explore-hero">
      <div className="flow-explore-hero-icon"><Compass size={25} /></div>
      <div>
        <span className="flow-explore-eyebrow">EXPLORAR</span>
        <h1>Explore o que você ama</h1>
        <p>Onde pessoas reais estimulam a curiosidade. Descubra conversas, comunidades, vídeos, ofertas e ideias que colocam seus interesses em movimento.</p>
      </div>
    </header>

    <form className="flow-explore-search" onSubmit={e => { e.preventDefault(); setSubmitted(query.trim()); }}>
      <Search size={20} aria-hidden="true" />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquise pessoas, assuntos, hashtags e comunidades" aria-label="Pesquisar no Flow" />
      <button type="submit">Pesquisar</button>
    </form>

    {submitted && <section className="flow-explore-results" aria-live="polite"><strong>{resultLabel}</strong><span>Use a pesquisa global do Flow para continuar explorando este assunto.</span><button type="button" onClick={() => go('/app')}>Ver no feed</button></section>}

    <section className="flow-explore-grid">
      <ExploreCard icon={<Sparkles />} title="Pesquise com a IA da Flow" text="Peça pesquisas sobre assuntos importantes para você e transforme perguntas em experiências interativas." action="Explorar IA" onClick={() => go('/app/criar')} />
      <ExploreCard icon={<ShoppingBag />} title="Marketplace" text="Encontre ofertas, itens usados e tesouros escondidos para cultivar seus hobbies." action="Abrir Marketplace" onClick={() => go('/app/shop')} />
      <ExploreCard icon={<Heart />} title="Personalize seu feed" text="Ajuste suas preferências para ver mais do que gosta e menos do que não interessa." action="Personalizar" onClick={() => go('/app/configuracoes')} />
      <ExploreCard icon={<Video />} title="Reels e vídeos" text="Assista a tutoriais, descubra criadores e encontre entretenimento rápido para qualquer momento." action="Ver Shorts" onClick={() => go('/app/shorts')} />
    </section>

    <section className="flow-explore-section">
      <div className="flow-explore-section-heading"><div><span className="flow-explore-eyebrow">COMUNIDADE</span><h2>Conecte-se com pessoas e comunidades</h2></div><Users size={25} /></div>
      <div className="flow-explore-feature-grid">
        <Feature icon={<Users />} title="Grupos e comunidades" text="Participe de espaços com pessoas reais, experiências reais e conversas que ajudam você." action="Explorar comunidades" onClick={() => go('/app/comunidades')} />
        <Feature icon={<ExternalLink />} title="Compartilhe com outras redes" text="Prepare conteúdos para compartilhar de forma rápida quando essa integração estiver disponível para sua conta." action="Compartilhar uma publicação" onClick={() => go('/app')} />
        <Feature icon={<MessageCircle />} title="Envie em privado" text="Compartilhe uma publicação diretamente com quem você quer, sem precisar publicar para todo mundo." action="Abrir mensagens" onClick={() => go('/app/mensagens')} />
      </div>
    </section>

    <section className="flow-explore-section">
      <div className="flow-explore-section-heading"><div><span className="flow-explore-eyebrow">CRIE</span><h2>Compartilhe seu mundo</h2></div><Sparkles size={25} /></div>
      <div className="flow-explore-feature-grid">
        <Feature icon={<Sparkles />} title="IA generativa" text="Use ferramentas de IA da Flow para criar ideias, imagens e textos quando os recursos estiverem habilitados na sua conta." action="Começar a criar" onClick={() => go('/app/criar')} />
        <Feature icon={<Camera />} title="Stories" text="Capture momentos enquanto eles acontecem e compartilhe experiências que desaparecem depois do período definido." action="Criar Story" onClick={() => go('/app/criar')} />
        <Feature icon={<Video />} title="Crie seus vídeos" text="Transforme suas ideias em vídeos verticais e publique para sua comunidade com as ferramentas disponíveis no Flow." action="Criar vídeo" onClick={() => go('/app/criar')} />
      </div>
    </section>

    <section className="flow-explore-trends">
      <div className="flow-explore-section-heading"><div><span className="flow-explore-eyebrow">AGORA</span><h2>Assuntos em movimento</h2></div><Compass size={25} /></div>
      <div className="flow-trend-list">{trends.map(item => <button type="button" key={item.tag} className="flow-trend" onClick={() => { setQuery(item.tag); setSubmitted(item.tag); }}><strong>{item.tag}</strong><span>{item.count}</span></button>)}</div>
    </section>
  </div>;
}

function ExploreCard({ icon, title, text, action, onClick }: { icon: ReactNode; title: string; text: string; action: string; onClick: () => void }) {
  return <article className="flow-explore-card"><div className="flow-explore-card-icon">{icon}</div><h3>{title}</h3><p>{text}</p><button type="button" onClick={onClick}>{action}</button></article>;
}

function Feature({ icon, title, text, action, onClick }: { icon: ReactNode; title: string; text: string; action: string; onClick: () => void }) {
  return <article className="flow-explore-feature"><div className="flow-explore-feature-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p><button type="button" onClick={onClick}>{action}</button></div></article>;
}
