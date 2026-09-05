// FLOW — páginas institucionais reais (conteúdo editorial próprio).
// Editorial estático é permitido; funcionalidades usam backend (ver SiteContato).
import { navigate } from '../../hooks/useRouter';
import SitePage from './SitePage';

function CtaRow() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
      <button
        type="button"
        onClick={() => navigate('/cadastro')}
        style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)', color: '#FFF', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
      >
        Criar minha conta
      </button>
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{ padding: '12px 28px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFF', color: '#0F172A', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
      >
        Entrar
      </button>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: 17, color: '#0F172A' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

export function SiteProduto() {
  return (
    <SitePage
      eyebrow="Produto"
      title="O que é a FLOW"
      description="Uma rede social para descobrir pessoas, criar conteúdo e participar de comunidades — com segurança e privacidade desde o primeiro dia."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <Card title="Experiência social" text="Feed Para você e Seguindo, stories, shorts e perfis completos." />
        <Card title="Personalização" text="Descoberta por interesses, hashtags e comunidades que você escolhe." />
        <Card title="Comunidades" text="Grupos temáticos com participação, moderação e regras claras." />
        <Card title="Comunicação" text="Mensagens privadas e notificações sobre o que importa para você." />
        <Card title="Descoberta" text="Explorar criadores, tendências e conteúdos em alta na rede." />
        <Card title="Segurança" text="Denúncias, moderação, 2FA e controles de privacidade e legado." />
        <Card title="PWA" text="Instale como aplicativo no celular ou desktop, com modo offline consciente." />
      </div>
      <CtaRow />
    </SitePage>
  );
}

const RECURSOS: Array<{ name: string; text: string; route: string | null }> = [
  { name: 'Feed', text: 'Para você e Seguindo, com curtidas, comentários e salvamentos reais.', route: '/app' },
  { name: 'Stories', text: 'Momentos do dia da sua rede.', route: '/app/stories' },
  { name: 'Vídeos / Shorts', text: 'Vídeos curtos com curtidas e salvamentos.', route: '/app/shorts' },
  { name: 'Comunidades', text: 'Descubra e participe de grupos temáticos.', route: '/comunidades' },
  { name: 'Mensagens', text: 'Conversas privadas com envio real.', route: '/app/mensagens' },
  { name: 'Notificações', text: 'Curtidas, comentários, seguidores e sistema.', route: '/app/notificacoes' },
  { name: 'Perfil', text: 'Publicações, fotos, seguidores e edição.', route: '/app/perfil' },
  { name: 'Busca', text: 'Pesquise posts, comunidades e criadores.', route: '/app/pesquisa' },
  { name: 'Criadores', text: 'Diretório e perfis públicos de criadores.', route: '/criadores' },
  { name: 'Eventos', text: 'Em implementação com backend próprio (Fase 9).', route: null },
  { name: 'Marketplace', text: 'Em implementação com backend próprio (Fase 9).', route: null },
  { name: 'Segurança', text: 'Denúncias, 2FA, sessões e central de segurança.', route: '/seguranca' },
  { name: 'Privacidade', text: 'Controles, consentimentos e exportação de dados (LGPD).', route: '/privacidade' },
];

export function SiteRecursos() {
  return (
    <SitePage
      eyebrow="Recursos"
      title="Tudo que a FLOW faz"
      description="Cada recurso abaixo leva à sua página ou funcionalidade real. Nada aqui é decorativo."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {RECURSOS.map((r) => (
          <div key={r.name} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17, color: '#0F172A' }}>{r.name}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6, flex: 1 }}>{r.text}</p>
            {r.route ? (
              <button
                type="button"
                onClick={() => navigate(r.route as string)}
                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}
              >
                Abrir →
              </button>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>EM IMPLEMENTAÇÃO</span>
            )}
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteSobre() {
  return (
    <SitePage
      eyebrow="Empresa"
      title="Sobre a FLOW"
      description="Missão, visão e valores que guiam o produto."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <Card title="Missão" text="Conectar pessoas em uma rede social segura, onde cada história importa." />
        <Card title="Visão" text="Ser o lugar onde comunidades, criadores e conversas crescem juntos." />
        <Card title="Valores" text="Segurança, privacidade, respeito à comunidade e funcionalidade real acima de aparência." />
        <Card title="Produto" text="Rede social + comunidades + criadores + memorial, em Light UI e PWA." />
        <Card title="Comunidade" text="Moderação ativa, denúncias com protocolo e auditoria administrativa." />
        <Card title="Tecnologia" text="React + Firebase + backend Express, com regras de autorização em todas as camadas." />
      </div>
      <CtaRow />
    </SitePage>
  );
}

export function SiteImprensa() {
  return (
    <SitePage
      eyebrow="Imprensa"
      title="Sala de imprensa"
      description="Notícias, materiais e contato oficial."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <Card title="Notícias" text="Anúncios oficiais da FLOW são publicados aqui e no blog." />
        <Card title="Kit de imprensa" text="Logotipo oficial: /logo.png e /flow-logo.svg. Uso conforme identidade Light UI." />
        <Card title="Identidade" text="Marca FLOW com gradiente oficial 135deg #4F7FFF → #8B5CF6 → #D946EF." />
        <Card title="Contato de imprensa" text="Use a página de contato com a categoria Imprensa." />
      </div>
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => navigate('/contato')}
          style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#FFF', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
        >
          Falar com a imprensa
        </button>
      </div>
    </SitePage>
  );
}
