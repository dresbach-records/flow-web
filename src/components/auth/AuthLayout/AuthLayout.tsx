import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { FlowLogo } from '../../../assets/flowAssets';
import type { AuthLayoutProps } from './AuthLayout.types';

// CSS: reutiliza as classes de src/app/auth.css (importado pela AuthPage).
// Desmembramento do auth.css por componente fica para a FASE 4.
export default function AuthLayout({ title, subtitle, onHome, children }: AuthLayoutProps) {
  return (
    <main className="flow-auth-page">
      {/* Showcase Lateral */}
      <section className="flow-auth-showcase">
        <button className="flow-auth-logo" onClick={onHome} aria-label="Voltar para a FLOW">
          <FlowLogo alt="FLOW" />
        </button>
        <div className="flow-auth-showcase-copy">
          <span>
            <Sparkles size={15} /> A NOVA GERAÇÃO SOCIAL
          </span>
          <h1>
            Seu mundo.
            <br />
            <em>Em movimento.</em>
          </h1>
          <p>Uma experiência social feita para conectar criadores, comunidades, áudio e conteúdo autêntico.</p>
          <div className="flow-auth-points">
            <div>
              <ShieldCheck size={18} /> Criptografia de ponta a ponta e segurança ativa
            </div>
            <div>
              <LockKeyhole size={18} /> Proteção rigorosa de dados e privacidade LGPD
            </div>
          </div>
        </div>
        <small>FLOW Platform · Versão Oficial 2026</small>
      </section>

      {/* Conteúdo Principal do Card */}
      <section className="flow-auth-content">
        <button className="flow-auth-back" onClick={onHome}>
          <ArrowLeft size={17} /> Voltar ao site
        </button>

        <div className="flow-auth-card">
          <FlowLogo className="flow-auth-card-logo" alt="FLOW" />

          <div className="flow-auth-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {children}

          <small className="flow-auth-note">Autenticação e segurança geridas via Firebase & Flow Shield.</small>
        </div>
      </section>
    </main>
  );
}
