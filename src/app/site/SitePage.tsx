// FLOW — SitePage (shell das páginas públicas: header + conteúdo + rodapé).
// Cada rota pública tem seu próprio conteúdo (nunca Home como substituto).
import React from 'react';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';

export default function SitePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="site-home">
      <SiteHeader />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 20px 64px' }}>
        <span
          style={{
            display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: 1.2,
            color: '#4F7FFF', textTransform: 'uppercase', marginBottom: 10,
          }}
        >
          {eyebrow}
        </span>
        <h1 style={{ margin: '0 0 10px 0', fontSize: 34, fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
          {title}
        </h1>
        {description && (
          <p style={{ margin: '0 0 32px 0', fontSize: 16, color: '#475569', maxWidth: 720, lineHeight: 1.6 }}>
            {description}
          </p>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
