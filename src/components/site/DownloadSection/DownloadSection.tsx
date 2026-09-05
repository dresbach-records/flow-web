import { useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { usePwaInstall } from '../../../hooks/usePwaInstall';
import './DownloadSection.css';

export default function DownloadSection() {
  const { canInstall, install } = usePwaInstall();
  const [status, setStatus] = useState('');

  const handleInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') setStatus('Flow instalado. Até já!');
    else if (outcome === 'dismissed') setStatus('Você pode instalar quando quiser pelo menu do navegador.');
    else setStatus('No seu navegador: menu ⋮ → “Instalar app” ou “Adicionar à tela inicial”.');
  };

  return (
    <section className="site-download" id="baixar">
      <div className="site-download-inner">
        <div className="site-download-copy">
          <span className="site-eyebrow">Flow em breve no seu bolso</span>
          <h2>
            Leve o <span className="site-gradient-text">Flow</span> com você
          </h2>
          <p>
            Instale a Flow como aplicativo direto do navegador: rápido, leve e com acesso em um toque — sem loja, sem espera.
          </p>
          <div className="site-download-actions">
            <button className="site-download-install" onClick={() => void handleInstall()}>
              <Download size={18} /> {canInstall ? 'Instalar o Flow agora' : 'Como instalar'}
            </button>
          </div>
          {status && (
            <p className="site-download-status" role="status">
              <CheckCircle2 size={16} /> {status}
            </p>
          )}
          <p className="site-download-note">
            iPhone (Safari): Compartilhar → “Adicionar à Tela de Início”. Android (Chrome): menu ⋮ → “Instalar app”.
          </p>
        </div>
        <div className="site-download-art">
          <img src="/baner%20home.png" alt="Aplicativo Flow em três telefones" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
