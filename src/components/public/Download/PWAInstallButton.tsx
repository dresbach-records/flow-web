import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import Modal from '../common/Modal';

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flow-download-badge flow-download-badge--pwa"
        onClick={handleInstallClick}
      >
        <div className="flow-download-badge__icon">
          {isInstalled ? <CheckCircle2 size={24} color="#10B981" /> : <Download size={24} />}
        </div>
        <div className="flow-download-badge__text">
          <span className="flow-download-badge__sub">
            {isInstalled ? 'Aplicativo Instalado' : 'Instalar no dispositivo'}
          </span>
          <span className="flow-download-badge__main">
            {isInstalled ? 'FLOW PWA Ativo' : 'Versão Web App (PWA)'}
          </span>
        </div>
      </button>

      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Como instalar o Flow como App"
      >
        <div className="flow-pwa-guide">
          <p className="flow-pwa-guide__intro">
            Você pode instalar o Flow instantaneamente no seu celular ou computador sem precisar de loja de aplicativos:
          </p>

          <div className="flow-pwa-steps">
            <div className="flow-pwa-step">
              <div className="flow-pwa-step__icon">
                <Share2 size={20} />
              </div>
              <div className="flow-pwa-step__body">
                <strong>No iPhone (Safari):</strong>
                <span>Toque no botão de Compartilhar no rodapé do navegador.</span>
              </div>
            </div>

            <div className="flow-pwa-step">
              <div className="flow-pwa-step__icon">
                <PlusSquare size={20} />
              </div>
              <div className="flow-pwa-step__body">
                <strong>Adicionar à Tela de Início:</strong>
                <span>Role para baixo e selecione "Adicionar à Tela de Início".</span>
              </div>
            </div>

            <div className="flow-pwa-step">
              <div className="flow-pwa-step__icon">
                <Download size={20} />
              </div>
              <div className="flow-pwa-step__body">
                <strong>No Android / Chrome:</strong>
                <span>Toque nos 3 pontos no topo e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PWAInstallButton;
