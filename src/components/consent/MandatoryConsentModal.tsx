import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, FileText, Check, Lock, X } from 'lucide-react';
import { CURRENT_CONSENT_VERSION, CURRENT_DOCUMENT_VERSION } from '../../services/firebase/consent';
import './MandatoryConsentModal.css';

export interface MandatoryConsentModalProps {
  userId: string;
  userName?: string | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}

export default function MandatoryConsentModal({
  userId,
  userName,
  onAccept,
  onDecline,
}: MandatoryConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [confirmDeclineDialog, setConfirmDeclineDialog] = useState(false);

  const handleAcceptClick = async () => {
    if (!agreed) {
      setWarningMessage('É necessário o aceite. Caso não aceite, sua sessão será encerrada.');
      return;
    }
    setWarningMessage(null);
    setSubmitting(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('[FLOW] Falha ao registrar aceite:', error);
      setWarningMessage('Ocorreu uma instabilidade ao salvar seu consentimento. Tente novamente.');
      setSubmitting(false);
    }
  };

  const handleDeclineClick = () => {
    setConfirmDeclineDialog(true);
  };

  const handleConfirmDecline = async () => {
    setSubmitting(true);
    try {
      await onDecline();
    } catch (error) {
      console.error('[FLOW] Falha ao registrar recusa:', error);
      // Even if network fails, ensure session is abandoned
      window.location.href = '/login?reason=consent_declined';
    }
  };

  return (
    <div className="flow-consent-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="flow-consent-modal-card">
        {/* Header */}
        <div className="flow-consent-header">
          <div className="flow-consent-badge">
            <ShieldCheck size={18} className="flow-consent-icon-shield" />
            <span>Consentimento Obrigatório</span>
          </div>
          <h2 id="consent-title" className="flow-consent-title">
            Termos de Uso e Política de Privacidade FLOW
          </h2>
          <p className="flow-consent-subtitle">
            Olá{userName ? `, ${userName}` : ''}! Para garantir uma comunidade segura, transparente e em conformidade com a LGPD, o aceite dos nossos termos é requisito mandatório para utilizar a FLOW.
          </p>
          <div className="flow-consent-meta">
            <span>Versão {CURRENT_CONSENT_VERSION}</span>
            <span>•</span>
            <span>Contrato Oficial {CURRENT_DOCUMENT_VERSION}</span>
            <span>•</span>
            <span>Segurança Criptografada</span>
          </div>
        </div>

        {/* Scrollable Reader Area */}
        <div className="flow-consent-scroll-container" tabIndex={0} aria-label="Texto completo dos termos de uso">
          <section className="flow-consent-section">
            <h3>1. Compromisso com a Autenticidade e Convivência</h3>
            <p>
              A FLOW é um ecossistema social projetado para celebrar conexões genuínas, expressão criativa e comunidades construtivas. Como membro da plataforma, você se compromete a interagir com respeito mútuo, integridade e consideração com os demais participantes.
            </p>
            <p>
              É estritamente proibido publicar, compartilhar ou incentivar: discurso de ódio, assédio, ameaças, discriminação de qualquer natureza, exploração, intimidação ou condutas inautênticas coordenadas (como automações e fazendas de engajamento falso).
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>2. Moderação Inteligente & Guardian AI</h3>
            <p>
              A FLOW conta com o Guardian AI — sistema de inteligência artificial de proteção comunitária — e uma equipe dedicada de moderação humana. Todas as publicações, comentários, mídias e produtos submetidos passam por validação contínua para prevenir fraudes, abusos e violações das leis vigentes.
            </p>
            <p>
              Contas com infrações reiteradas estarão sujeitas a advertências, remoção de conteúdo, suspensão temporária ou encerramento definitivo com preservação de registros conforme requerido pela legislação brasileira.
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>3. Privacidade e Proteção de Dados Pessoais (LGPD)</h3>
            <p>
              Em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), seus dados pessoais são coletados com propósitos legítimos e transparentes: autenticação, personalização do feed social, segurança cibernética e entrega de funcionalidades contratadas.
            </p>
            <p>
              Seus dados nunca serão vendidos a terceiros. Você pode, a qualquer instante através do menu de Configurações, solicitar o relatório dos seus dados, exercer seu direito à portabilidade ou solicitar a exclusão definitiva da sua conta.
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>4. Propriedade Intelectual & Direitos Autorais</h3>
            <p>
              Você mantém integralmente a titularidade e os direitos autorais sobre as fotografias, vídeos, textos e criações originais que publicar na FLOW. Ao publicá-los, você concede à plataforma apenas uma licença não-exclusiva necessária para hospedar, processar e exibir seu conteúdo aos seus seguidores e público conforme suas opções de privacidade.
            </p>
            <p>
              Você garante possuir os direitos ou autorizações necessárias para todo o material que subir, respeitando direitos autorais e marcas de terceiros.
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>5. Monetização, Marketplace e Transações</h3>
            <p>
              Criadores, vendedores e parceiros comerciais no FLOW Marketplace e Creator Center devem operar com lisura fiscal, garantia legal dos produtos anunciados e atendimento às diretrizes do Código de Defesa do Consumidor.
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>6. Segurança de Acesso, Senhas e Dispositivos</h3>
            <p>
              Você é responsável por manter a confidencialidade das suas credenciais. Recomendamos fortemente a ativação do Segundo Fator de Autenticação (2FA) e a revisão periódica de sessões ativas no seu painel de segurança.
            </p>
          </section>

          <section className="flow-consent-section">
            <h3>7. Disposições Finais & Aceite Obrigatório</h3>
            <p>
              O presente contrato vincula o usuário aos serviços prestados pela FLOW Serviços Online Ltda. O foro da comarca de São Paulo/SP é eleito para dirimir eventuais controvérsias decorrentes destes Termos.
            </p>
          </section>
        </div>

        {/* Warning Notification if user tried to proceed without accepting */}
        {warningMessage && (
          <div className="flow-consent-warning-box" role="alert">
            <AlertCircle size={18} />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Confirmation Form */}
        <div className="flow-consent-footer">
          <label className="flow-consent-checkbox-row">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setWarningMessage(null);
              }}
              disabled={submitting}
            />
            <span className="flow-consent-checkbox-text">
              Li e concordo com os termos e condições apresentados e estou ciente de que o aceite é obrigatório para utilizar a FLOW.
            </span>
          </label>

          <div className="flow-consent-actions">
            <button
              type="button"
              className="flow-consent-btn-decline"
              onClick={handleDeclineClick}
              disabled={submitting}
            >
              Recusar e sair
            </button>

            <button
              type="button"
              className="flow-consent-btn-accept"
              onClick={handleAcceptClick}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="flow-consent-spinner" />
                  <span>Validando aceite...</span>
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span>Eu aceito</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Decline Sub-Modal */}
        {confirmDeclineDialog && (
          <div className="flow-decline-confirm-overlay">
            <div className="flow-decline-confirm-card">
              <div className="flow-decline-icon-wrap">
                <AlertCircle size={28} color="#DC2626" />
              </div>
              <h4>Deseja realmente recusar os termos?</h4>
              <p>
                Para acessar a plataforma FLOW, é mandatório aceitar os Termos de Uso e a Política de Privacidade. Se você recusar agora, sua sessão será imediatamente encerrada e você retornará à tela de login.
              </p>
              <div className="flow-decline-confirm-actions">
                <button
                  type="button"
                  className="flow-decline-btn-cancel"
                  onClick={() => setConfirmDeclineDialog(false)}
                  disabled={submitting}
                >
                  Voltar e ler termos
                </button>
                <button
                  type="button"
                  className="flow-decline-btn-confirm"
                  onClick={handleConfirmDecline}
                  disabled={submitting}
                >
                  {submitting ? 'Encerrando sessão...' : 'Sim, recusar e sair'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
