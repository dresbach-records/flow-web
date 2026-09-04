import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './PublicPages.css';

export interface PublicPageLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
  tag?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  currentPath,
  onNavigate,
  authenticated = false,
  tag,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="flow-public-page">
      <Header
        currentPath={currentPath}
        onNavigate={onNavigate}
        authenticated={authenticated}
      />

      <main className="flow-public-page__main">
        <section className="flow-public-page__hero">
          <div className="flow-public-page__hero-container">
            {tag && <span className="flow-public-page__tag">{tag}</span>}
            <h1 className="flow-public-page__title">{title}</h1>
            {subtitle && <p className="flow-public-page__subtitle">{subtitle}</p>}
          </div>
        </section>

        <section className="flow-public-page__content">
          <div className="flow-public-page__content-container">{children}</div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PublicPageLayout;
