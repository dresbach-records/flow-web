import React from 'react';
import PublicPageLayout from './PublicPageLayout';
import { ArrowRight, Calendar, User } from 'lucide-react';

export interface BlogPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  currentPath,
  onNavigate,
  authenticated,
}) => {
  const posts = [
    {
      id: 'flow-2-0',
      title: 'Apresentando o Novo FLOW: Velocidade, Design Light e Foco em Comunidades',
      snippet: 'Uma reconstrução completa da nossa interface com base no feedback de mais de 1 milhão de usuários ativos.',
      category: 'Novidades',
      date: '12 de Maio, 2026',
      author: 'Equipe de Produto',
    },
    {
      id: 'privacidade-real',
      title: 'Por que o feed cronológico é indispensável para a sua saúde mental',
      snippet: 'Como os feeds algorítmicos tradicionais estimulam o vício digital e por que o Flow adota um modelo diferente.',
      category: 'Bem-estar',
      date: '28 de Abril, 2026',
      author: 'Lucas Mendes',
    },
    {
      id: 'economia-criadores',
      title: 'Como criadores estão monetizando diretamente com suas comunidades',
      snippet: 'Estratégias reais e histórias inspiradoras de quem encontrou no Flow o canal principal para sua audiência.',
      category: 'Criadores',
      date: '15 de Abril, 2026',
      author: 'Mariana Silva',
    },
  ];

  return (
    <PublicPageLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      authenticated={authenticated}
      tag="BLOG DO FLOW"
      title="Histórias, novidades e visões de futuro"
      subtitle="Fique por dentro das últimas atualizações do produto, reflexões sobre redes sociais e dicas da nossa equipe."
    >
      <div className="flow-page-grid">
        {posts.map((post) => (
          <article key={post.id} className="flow-page-card">
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#3B82F6',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              {post.category}
            </span>
            <h3 className="flow-page-card__title" style={{ fontSize: 18, lineHeight: 1.3 }}>
              {post.title}
            </h3>
            <p className="flow-page-card__desc">{post.snippet}</p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTop: '1px solid #F1F5F9',
                fontSize: 12,
                color: '#94A3B8',
                marginTop: 'auto',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} />
                {post.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={13} />
                {post.author}
              </span>
            </div>
          </article>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default BlogPage;
