import React from 'react';
import { Apple } from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';
import './Download.css';

export const DownloadSection: React.FC = () => {
  return (
    <section className="flow-download-section" id="download" aria-labelledby="download-title">
      <div className="flow-download-container">
        <div className="flow-download-card">
          {/* Ambient decorative glow */}
          <div className="flow-download-card__glow" aria-hidden="true" />

          {/* Left copy & store badges */}
          <div className="flow-download-copy">
            <span className="flow-download-tag">EXPERIÊNCIA COMPLETA NO SEU BOLSO</span>
            <h2 id="download-title" className="flow-download-title">
              Leve o Flow com você
            </h2>
            <p className="flow-download-subtitle">
              Disponível para iOS, Android ou instale diretamente no seu navegador como PWA.
              Leve, rápido e sem ocupar espaço desnecessário no seu dispositivo.
            </p>

            <div className="flow-download-badges">
              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flow-download-badge"
              >
                <div className="flow-download-badge__icon">
                  <Apple size={26} />
                </div>
                <div className="flow-download-badge__text">
                  <span className="flow-download-badge__sub">Disponível na</span>
                  <span className="flow-download-badge__main">App Store</span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flow-download-badge"
              >
                <div className="flow-download-badge__icon">
                  <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.023 2.023 0 0 1-.61-.393V2.207c.18-.162.385-.295.61-.393zm1.488 20.672l10.05-10.05 2.664 2.665-11.458 6.558a1.218 1.218 0 0 1-1.256.827zm14.238-9.014l-2.454-1.472-2.83-2.83 2.83-2.83 2.454-1.472c.983-.59 1.765-.138 1.765 1.018v6.568c0 1.156-.782 1.608-1.765 1.018zm-14.238-10.96c.38 0 .762.187 1.256.828l11.458 6.557-2.664 2.665-10.05-10.05z" />
                  </svg>
                </div>
                <div className="flow-download-badge__text">
                  <span className="flow-download-badge__sub">Disponível no</span>
                  <span className="flow-download-badge__main">Google Play</span>
                </div>
              </a>

              {/* PWA Install */}
              <PWAInstallButton />
            </div>
          </div>

          {/* Right Visual Phone */}
          <div className="flow-download-visual">
            <img
              src="/flow-assets/download-phone.png"
              alt="App Flow em smartphone"
              className="flow-download-visual__img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
