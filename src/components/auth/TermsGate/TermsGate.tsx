import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, FileText, X } from 'lucide-react';
import { CURRENT_DOCUMENT_VERSION } from '../../../services/firebase/consent';
import './TermsGate.css';

export interface TermsGateProps {
  contractVersion?: string;
  /** Persiste o aceite versionado. Resolvido = acesso liberado (uma única vez). */
  onAccept: () => Promise<void>;
  /** Recusa: encerra a sessão e redireciona ao login. */
  onDecline: () => Promise<void>;
}

const SECTIONS = [
  { id: 'termos', label: 'Termos de Uso' },
  { id: 'privacidade', label: 'Política de Privacidade' },
  { id: 'diretrizes', label: 'Diretrizes da Comunidade' },
  { id: 'conteudo', label: 'Política de Conteúdo' },
  { id: 'direitos', label: 'Direitos e Deveres' },
  { id: 'imagem', label: 'Uso de Imagem e Dados' },
  { id: 'publicidade', label: 'Publicidade e Parcerias' },
  { id: 'seguranca', label: 'Segurança da Conta' },
  { id: 'encerramento', label: 'Encerramento de Conta' },
  { id: 'disposicoes', label: 'Disposições Finais' },
] as const;

export default function TermsGate({
  contractVersion = CURRENT_DOCUMENT_VERSION,
  onAccept,
  onDecline,
}: TermsGateProps) {
  const docRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDecline, setConfirmDecline] = useState(false);

  const handleScroll = useCallback(() => {
    const el = docRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolledToEnd(true);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmDecline(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollTo = (id: string) => {
    docRef.current?.querySelector(`#flow-doc-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAccept = async () => {
    if (!scrolledToEnd || !checked || busy) return;
    setBusy(true);
    setError('');
    try {
      await onAccept();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível registrar o aceite.');
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (!confirmDecline) {
      setConfirmDecline(true);
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await onDecline();
    } finally {
      setBusy(false);
    }
  };

  const canAccept = scrolledToEnd && checked && !busy;

  return (
    <div className="flow-terms-gate-overlay" role="dialog" aria-modal="true" aria-labelledby="flow-terms-title">
      <div className="flow-terms-gate-card">
        <button className="flow-terms-gate-close" onClick={handleDecline} aria-label="Recusar e voltar ao login">
          <X size={20} />
        </button>

        <header className="flow-terms-gate-header">
          <span className="flow-terms-gate-icon" aria-hidden="true">
            <FileText size={28} color="#3B82F6" />
          </span>
          <div>
            <h2 id="flow-terms-title">Termos de Uso e Políticas da Flow</h2>
            <p>Para continuar, leia e aceite nossos termos. É rápido e garante uma experiência segura para você e para toda a comunidade.</p>
          </div>
        </header>

        <div className="flow-terms-gate-body">
          <nav className="flow-terms-gate-nav" aria-label="Seções do documento">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => scrollTo(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>

          <div ref={docRef} onScroll={handleScroll} className="flow-terms-gate-doc" tabIndex={0} aria-label="Documento do contrato">
            <h3>Termos de Uso da Flow</h3>
            <p className="flow-terms-gate-updated">Última atualização: 01 de março de 2026 · Versão {contractVersion}</p>

            <h4 id="flow-doc-termos">1. Bem-vindo à Flow</h4>
            <p>A Flow é uma rede social criada para conectar pessoas, compartilhar histórias, promover comunidades e oferecer um ambiente seguro, positivo e inspirador. Ao utilizar a plataforma, você concorda com os termos descritos neste documento.</p>

            <h4>2. Aceitação dos Termos</h4>
            <p>Ao criar uma conta, acessar ou utilizar qualquer funcionalidade da Flow, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso, bem como com nossa Política de Privacidade, Diretrizes da Comunidade e demais políticas aplicáveis.</p>

            <h4>3. Elegibilidade</h4>
            <p>Para utilizar a Flow, você deve ter pelo menos 13 anos de idade. Se for menor de 18 anos, precisa do consentimento de um responsável legal. Você é responsável por manter seus dados atualizados e verdadeiros.</p>

            <h4>4. Sua Conta</h4>
            <p>Você é o único responsável pela sua conta e por todas as atividades realizadas nela. Não compartilhe sua senha com outras pessoas. Em caso de uso indevido, comunique-nos imediatamente.</p>

            <h4 id="flow-doc-privacidade">5. Política de Privacidade</h4>
            <p>Tratamos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD). Coletamos apenas o necessário para operar a plataforma, nunca vendemos seus dados e você pode solicitar portabilidade ou exclusão a qualquer momento.</p>

            <h4 id="flow-doc-diretrizes">6. Diretrizes da Comunidade</h4>
            <p>Não toleramos discurso de ódio, assédio, desinformação deliberada, spam ou conduta inautêntica. Publicações estão sujeitas à moderação e violações podem resultar em remoção de conteúdo ou suspensão da conta.</p>

            <h4 id="flow-doc-conteudo">7. Política de Conteúdo</h4>
            <p>Você mantém os direitos sobre o que publica e concede à Flow licença para exibir esse conteúdo na plataforma. É proibido publicar conteúdo ilegal, violento, sexualmente explícito envolvendo menores ou que viole direitos de terceiros.</p>

            <h4 id="flow-doc-direitos">8. Direitos e Deveres</h4>
            <p>Você tem direito a um ambiente seguro, à privacidade e ao contraditório em moderações. Em contrapartida, deve respeitar outros usuários, as leis vigentes e as decisões de moderação, recorrendo pelos canais oficiais quando discordar.</p>

            <h4 id="flow-doc-imagem">9. Uso de Imagem e Dados</h4>
            <p>Fotos, vídeos e informações de perfil podem aparecer para outros usuários conforme suas configurações de privacidade. Não utilize a imagem de terceiros sem autorização.</p>

            <h4 id="flow-doc-publicidade">10. Publicidade e Parcerias</h4>
            <p>Conteúdos patrocinados devem ser identificados. Criadores monetizados e vendedores devem observar as normas fiscais e de defesa do consumidor aplicáveis.</p>

            <h4 id="flow-doc-seguranca">11. Segurança da Conta</h4>
            <p>Utilize senha forte e ative a verificação em duas etapas. A Flow nunca pedirá sua senha por mensagem. Sessões ativas podem ser gerenciadas nas configurações de segurança.</p>

            <h4 id="flow-doc-encerramento">12. Encerramento de Conta</h4>
            <p>Você pode encerrar sua conta quando quiser. A Flow pode suspender contas que violem estes termos, sempre com registro do motivo e possibilidade de recurso pelos canais oficiais.</p>

            <h4 id="flow-doc-disposicoes">13. Disposições Finais</h4>
            <p>Estes termos podem ser atualizados; mudanças relevantes serão comunicadas e poderão exigir novo aceite. Ao continuar usando a Flow após atualizações, você concorda com a versão vigente.</p>
          </div>
        </div>

        <footer className="flow-terms-gate-footer">
          {!scrolledToEnd && (
            <p className="flow-terms-gate-hint" role="status">
              Role o documento até o final para liberar o aceite.
            </p>
          )}
          <label className="flow-terms-gate-check">
            <input
              type="checkbox"
              checked={checked}
              disabled={!scrolledToEnd}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span>
              Li e aceito os Termos de Uso, a <strong>Política de Privacidade</strong> e demais políticas da Flow. Declaro que li todo o
              conteúdo e concordo com as condições para utilizar a plataforma.
            </span>
          </label>
          {error && (
            <p className="flow-terms-gate-error" role="alert">
              {error}
            </p>
          )}
          {confirmDecline && (
            <p className="flow-terms-gate-error" role="alert">
              É necessário o aceite. Caso não aceite, sua sessão será encerrada.
            </p>
          )}
          <div className="flow-terms-gate-actions">
            <button type="button" className="flow-terms-gate-back" onClick={handleDecline} disabled={busy}>
              {confirmDecline ? 'Encerrar sessão' : 'Voltar para o login'}
            </button>
            <button type="button" className="flow-terms-gate-accept" onClick={handleAccept} disabled={!canAccept}>
              <Check size={18} /> {busy ? 'Registrando…' : 'Eu aceito'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
