// FLOW — Blog (artigos editoriais reais + busca/categoria reais sobre o índice).
import { useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import SitePage from './SitePage';

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'como-criar-conteudo-que-conecta',
    title: 'Como criar conteúdo que conecta',
    category: 'Criação',
    date: '02/09/2026',
    excerpt: 'Autenticidade, consistência e comunidade: o tripé de quem cresce na FLOW.',
    body: [
      'Conteúdo que conecta nasce da autenticidade: publique o que você vive, não o que parece performar.',
      'Consistência vence intensidade. Um ritmo sustentável de publicações mantém sua comunidade por perto.',
      'Converse nos comentários e participe de comunidades do seu nicho: alcance é consequência de relação.',
    ],
  },
  {
    slug: 'guia-comunidades',
    title: 'Guia das comunidades FLOW',
    category: 'Comunidades',
    date: '28/08/2026',
    excerpt: 'Encontre seu grupo, participe de verdade e respeite as regras.',
    body: [
      'Use a busca da página de Comunidades para achar temas que combinam com você.',
      'Ao entrar, leia as regras na página da comunidade antes da primeira interação.',
      'Denúncias com protocolo mantêm os grupos saudáveis — use sem medo quando precisar.',
    ],
  },
  {
    slug: 'seguranca-na-pratica',
    title: 'Segurança na prática',
    category: 'Segurança',
    date: '20/08/2026',
    excerpt: '2FA, códigos de reserva e sessões: proteja sua conta em minutos.',
    body: [
      'Ative o segundo fator em Configurações → Segurança e guarde os códigos de reserva.',
      'Cada código de reserva vale uma única vez e é consumido ao usar.',
      'Desconfie de mensagens pedindo sua senha: a FLOW nunca pede senha por mensagem.',
    ],
  },
];

const CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function SiteBlog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = BLOG_POSTS.filter((p) => {
    const q = query.trim().toLowerCase();
    return (
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)) &&
      (category === 'Todas' || p.category === category)
    );
  });

  return (
    <SitePage eyebrow="Blog" title="Blog FLOW" description="Artigos da equipe sobre criação, comunidades e segurança.">
      <input
        type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar artigos..."
        aria-label="Pesquisar artigos"
        style={{ width: '100%', maxWidth: 480, height: 44, padding: '0 18px', borderRadius: 999, border: '1px solid #E2E8F0', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Todas', ...CATEGORIES].map((c) => (
          <button
            key={c} type="button" onClick={() => navigate(c === 'Todas' ? '/blog' : `/blog/categoria/${encodeURIComponent(c)}`)}
            style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: category === c ? '1px solid #2563EB' : '1px solid #E2E8F0', background: category === c ? '#EFF6FF' : '#FFF', color: category === c ? '#2563EB' : '#475569' }}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: '#64748B' }}>Nenhum artigo encontrado.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((p) => (
          <div key={p.slug} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
            <p style={{ margin: '0 0 6px 0', fontSize: 12, fontWeight: 800, color: '#4F7FFF', textTransform: 'uppercase' }}>{p.category} · {p.date}</p>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>{p.title}</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: 14, color: '#475569' }}>{p.excerpt}</p>
            <button type="button" onClick={() => navigate(`/blog/${p.slug}`)} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
              Ler artigo →
            </button>
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteBlogCategoria({ slug }: { slug: string }) {
  const name = decodeURIComponent(slug);
  const filtered = BLOG_POSTS.filter((p) => p.category.toLowerCase() === name.toLowerCase());
  return (
    <SitePage eyebrow="Blog" title={`Categoria: ${name}`} description={`${filtered.length} artigo(s).`}>
      {filtered.length === 0 && <p role="alert" style={{ color: '#B91C1C' }}>Categoria inexistente.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((p) => (
          <div key={p.slug} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>{p.title}</h3>
            <button type="button" onClick={() => navigate(`/blog/${p.slug}`)} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
              Ler artigo →
            </button>
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteBlogBusca({ query }: { query: string }) {
  const q = decodeURIComponent(query ?? '').trim().toLowerCase();
  const filtered = q ? BLOG_POSTS.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.body.join(' ').toLowerCase().includes(q)) : [];
  return (
    <SitePage eyebrow="Blog" title={`Busca: ${decodeURIComponent(query ?? '')}`} description={`${filtered.length} resultado(s).`}>
      {filtered.length === 0 && <p style={{ color: '#64748B' }}>Nada encontrado. Tente outro termo.</p>}
      {filtered.map((p) => (
        <div key={p.slug} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>{p.title}</h3>
          <button type="button" onClick={() => navigate(`/blog/${p.slug}`)} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
            Ler artigo →
          </button>
        </div>
      ))}
    </SitePage>
  );
}

export function SiteBlogArtigo({ slug }: { slug: string }) {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return (
      <SitePage eyebrow="Blog" title="Artigo não encontrado">
        <p role="alert" style={{ color: '#B91C1C' }}>Este artigo não existe.</p>
        <button type="button" onClick={() => navigate('/blog')} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
          Voltar ao blog
        </button>
      </SitePage>
    );
  }
  return (
    <SitePage eyebrow={`${post.category} · ${post.date}`} title={post.title} description={post.excerpt}>
      {post.body.map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: '#334155', lineHeight: 1.8 }}>{p}</p>
      ))}
      <button type="button" onClick={() => navigate('/blog')} style={{ marginTop: 16, background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
        ← Voltar ao blog
      </button>
    </SitePage>
  );
}
