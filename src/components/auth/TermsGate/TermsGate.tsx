import React, { useState } from 'react';
import './TermsGate.css';

export interface TermsGateProps {
  contractVersion?: string;
  onAccept: (auditData: { version: string; acceptedAt: string; ipVerified: boolean }) => Promise<void> | void;
}

export default function TermsGate({
  contractVersion = 'v1.0.0-2026',
  onAccept,
}: TermsGateProps) {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!accepted || submitting) return;
    setSubmitting(true);
    try {
      await onAccept({
        version: contractVersion,
        acceptedAt: new Date().toISOString(),
        ipVerified: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flow-terms-gate-overlay">
      <div className="flow-terms-gate-card">
        <div className="flow-terms-gate-header">
          <h2>Termos de Uso e Contrato da Comunidade FLOW</h2>
          <p>Versão oficial {contractVersion} • Leitura obrigatória antes de acessar a rede</p>
        </div>

        <div className="flow-terms-gate-body">
          <h3>1. Compromisso com a Autenticidade e Respeito</h3>
          <p>
            A FLOW é uma plataforma dedicada a conexões autênticas. Não toleramos discurso de ódio, assédio, desinformação deliberada ou conduta inautêntica coordenada. Todas as publicações estão sujeitas à moderação automatizada do Guardian AI e da equipe de confiança e segurança.
          </p>

          <h3>2. Privacidade e Tratamento de Dados (LGPD)</h3>
          <p>
            Seus dados pessoais são processados em conformidade com as diretrizes legais. Você detém a titularidade sobre suas criações e pode solicitar a portabilidade ou exclusão definitiva a qualquer momento no painel de privacidade.
          </p>

          <h3>3. Responsabilidade sobre Publicações Comerciais e Anúncios</h3>
          <p>
            Vendedores no Marketplace e criadores de conteúdo monetizado devem manter conformidade com as diretrizes fiscais e de proteção ao consumidor vigentes.
          </p>
        </div>

        <div className="flow-terms-gate-footer">
          <label className="flow-terms-gate-checkbox-label">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              Li e concordo com os Termos de Uso, Diretrizes da Comunidade e Contrato da Plataforma FLOW (versão {contractVersion}).
            </span>
          </label>

          <button
            className="flow-terms-gate-btn"
            disabled={!accepted || submitting}
            onClick={handleConfirm}
          >
            {submitting ? 'Registrando aceite seguro...' : 'Aceitar e Liberar Acesso à FLOW'}
          </button>
        </div>
      </div>
    </div>
  );
}
