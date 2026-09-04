import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchButton from './SearchButton';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import Modal from '../common/Modal';
import './Header.css';

export interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  authenticated = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchModalOpen(false);
    onNavigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="flow-header">
        <div className="flow-header__container">
          {/* Brand Logo */}
          <div className="flow-header__left">
            <Logo onClick={() => handleNav('/')} />
          </div>

          {/* Desktop Nav Items */}
          <div className="flow-header__center">
            <Navigation currentPath={currentPath} onNavigate={handleNav} />
          </div>

          {/* Desktop Right CTAs */}
          <div className="flow-header__right">
            <SearchButton onClick={() => setSearchModalOpen(true)} />

            {authenticated ? (
              <button
                type="button"
                className="flow-header-app-btn"
                onClick={() => handleNav('/app')}
              >
                Abrir FLOW
              </button>
            ) : (
              <>
                <LoginButton onClick={() => handleNav('/login')} />
                <RegisterButton onClick={() => handleNav('/cadastro')} />
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="flow-header__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="flow-header__mobile-drawer">
            <Navigation
              currentPath={currentPath}
              onNavigate={handleNav}
              className="flow-header__mobile-nav"
            />
            <div className="flow-header__mobile-actions">
              {authenticated ? (
                <button
                  type="button"
                  className="flow-header-app-btn flow-header-app-btn--full"
                  onClick={() => handleNav('/app')}
                >
                  Abrir FLOW
                </button>
              ) : (
                <>
                  <LoginButton onClick={() => handleNav('/login')} className="flow-header-login-btn--full" />
                  <RegisterButton onClick={() => handleNav('/cadastro')} className="flow-header-register-btn--full" />
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Buscar no FLOW"
      >
        <form onSubmit={handleSearchSubmit} className="flow-search-form">
          <div className="flow-search-input-wrap">
            <Search size={20} className="flow-search-icon" />
            <input
              type="search"
              placeholder="Comunidades, tópicos, criadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flow-search-input"
            />
          </div>
          <div className="flow-search-tags">
            <span className="flow-search-tag-label">Populares:</span>
            {['Viagens', 'Fotografia', 'Tecnologia', 'Música', 'Vida Saudável'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="flow-search-tag"
                onClick={() => {
                  setSearchModalOpen(false);
                  onNavigate(`/explorar?q=${encodeURIComponent(tag)}`);
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
          <div className="flow-search-submit-row">
            <button type="submit" className="flow-cta-btn flow-cta-btn--primary flow-cta-btn--md">
              Pesquisar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Header;
