// FLOW — Central de Ajuda (conteúdo editorial real + busca real no índice local).
import { useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import SitePage from './SitePage';

export interface HelpArticle {
  slug: string;
  title: string;
  category: string;
  body: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'como-recuperar-conta',
    title: 'Como recuperar minha conta',
    category: 'Conta e login',
    body: [
      'Na tela de login, toque em "Esqueci minha senha" e informe o e-mail da conta.',
      'Você receberá um link de redefinição. Abra o link e crie uma nova senha com no mínimo 6 caracteres.',
      'Se o link expirou, solicite um novo e-mail de recuperação e tente novamente.',
    ],
  },
  {
    slug: 'como-denunciar-publicacao',
    title: 'Como denunciar uma publicação',
    category: 'Denúncias',
    body: [
      'Abra a publicação, toque no menu "Mais opções" (⋯) e escolha "Denunciar".',
      'Selecione o motivo que melhor descreve o problema e envie.',
      'Sua denúncia recebe um protocolo e entra na fila de moderação, acompanhada pela equipe.',
    ],
  },
  {
    slug: 'como-criar-comunidade',
    title: 'Como participar de comunidades',
    category: 'Comunidades',
    body: [
      'Abra a página de Comunidades e use a busca para encontrar um tema do seu interesse.',
      'Na página da comunidade, toque em "Entrar". Sua participação é registrada na hora.',
      'Respeite as regras exibidas na página: respeito, sem spam e sem conteúdo ilegal.',
    ],
  },
  {
    slug: 'como-ativar-2fa',
    title: 'Como ativar a verificação em duas etapas',
    category: 'Segurança',
    body: [
      'Abra Configurações → Segurança e ative o segundo fator.',
      'Conclua o fluxo de configuração e guarde os códigos de reserva em local seguro.',
      'Cada código de reserva vale uma única vez: ao usar, ele é consumido.',
    ],
  },
  {
    slug: 'como-funciona-memorial',
    title: 'Como funciona o memorial',
    category: 'Memorial',
    body: [
      'Qualquer pessoa logada pode solicitar a memorialização pela página do Memorial.',
      'A solicitação gera um protocolo para acompanhamento do status (pendente, aprovada, recusada).',
      'Homenagens publicadas no mural ficam visíveis para usuários logados.',
    ],
  },
  {
    slug: 'problemas-login',
    title: 'Problemas para entrar',
    category: 'Conta e login',
    body: [
      'Confira se o e-mail está correto e se a senha tem ao menos 6 caracteres.',
      'Após muitas tentativas, aguarde alguns instantes antes de tentar de novo.',
      'Se a conta foi bloqueada ou suspensa, use a tela de recurso para abrir um protocolo.',
    ],
  },
];

const CATEGORIES = Array.from(new Set(HELP_ARTICLES.map((a) => a.category)));

export function SiteAjuda() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = HELP_ARTICLES.filter((a) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || a.title.toLowerCase().includes(q) || a.body.join(' ').toLowerCase().includes(q);
    const matchesCategory = category === 'Todas' || a.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <SitePage eyebrow="Suporte" title="Central de Ajuda" description="Pesquise por problema, conta, segurança, privacidade, comunidades, mensagens ou denúncias.">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar artigos..."
        aria-label="Pesquisar artigos de ajuda"
        style={{ width: '100%', maxWidth: 520, height: 44, padding: '0 18px', borderRadius: 999, border: '1px solid #E2E8F0', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Todas', ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: category === c ? '1px solid #2563EB' : '1px solid #E2E8F0', background: category === c ? '#EFF6FF' : '#FFF', color: category === c ? '#2563EB' : '#475569' }}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: '#64748B' }}>Nenhum artigo encontrado para essa busca.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((a) => (
          <div key={a.slug} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
            <p style={{ margin: '0 0 6px 0', fontSize: 12, fontWeight: 800, color: '#4F7FFF', textTransform: 'uppercase' }}>{a.category}</p>
            <h3 style={{ margin: '0 0 10px 0', color: '#0F172A' }}>{a.title}</h3>
            <button
              type="button"
              onClick={() => navigate(`/ajuda/${a.slug}`)}
              style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}
            >
              Ler artigo →
            </button>
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteAjudaArtigo({ slug }: { slug: string }) {
  const article = HELP_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return (
      <SitePage eyebrow="Ajuda" title="Artigo não encontrado">
        <p role="alert" style={{ color: '#B91C1C' }}>Este artigo não existe. Volte à Central de Ajuda.</p>
        <button type="button" onClick={() => navigate('/ajuda')} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
          Central de Ajuda
        </button>
      </SitePage>
    );
  }
  return (
    <SitePage eyebrow={article.category} title={article.title}>
      {article.body.map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: '#334155', lineHeight: 1.7 }}>{p}</p>
      ))}
      <button type="button" onClick={() => navigate('/ajuda')} style={{ marginTop: 16, background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
        ← Voltar à Central de Ajuda
      </button>
    </SitePage>
  );
}
