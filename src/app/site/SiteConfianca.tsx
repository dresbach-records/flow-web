// FLOW — páginas institucionais de confiança (conteúdo editorial real).
import { navigate } from '../../hooks/useRouter';
import SitePage from './SitePage';

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, marginBottom: 14 }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

export function SiteSeguranca() {
  return (
    <SitePage eyebrow="Segurança" title="Sua segurança na FLOW" description="Como protegemos sua conta, seus dados e a comunidade.">
      <Section title="Proteção de conta" text="Senha forte, verificação em duas etapas com códigos de reserva de uso único e sessões gerenciáveis nas configurações." />
      <Section title="Autenticação e sessões" text="Login por e-mail ou Google, com encerramento de sessão ao recusar o contrato e controle da sessão atual." />
      <Section title="Denúncias e bloqueios" text="Toda publicação pode ser denunciada com protocolo. A moderação decide com trilha de auditoria." />
      <Section title="Moderação" text="Fila administrativa com aprovação, rejeição e remoção de conteúdo, além de moderação assistida por IA no backend." />
      <Section title="Proteção de dados" text="Regras mínimas de acesso no banco, sem exposição de segredos no app e avisos honestos de permissão." />
      <button type="button" onClick={() => navigate('/seguranca/conta')} style={{ marginTop: 8, padding: '12px 28px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
        Segurança da minha conta
      </button>
    </SitePage>
  );
}

export function SiteSegurancaConta() {
  return (
    <SitePage eyebrow="Segurança da conta" title="Orientações da sua conta" description="Checklist real ligado às telas do app.">
      <Section title="1. Ative o segundo fator" text="Em Configurações → Segurança, ative o 2FA e guarde os códigos de reserva." />
      <Section title="2. Revise sessões" text="A tela de sessões mostra sua sessão atual deste dispositivo." />
      <Section title="3. Denuncie" text="Conteúdo suspeito pode ser denunciado direto da publicação, com protocolo." />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        <button type="button" onClick={() => navigate('/app/configuracoes')} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
          Abrir configurações
        </button>
        <button type="button" onClick={() => navigate('/app/denunciar')} style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
          Denunciar
        </button>
      </div>
    </SitePage>
  );
}

export function SitePrivacidade() {
  return (
    <SitePage eyebrow="Privacidade" title="Política de Privacidade" description="Versão vigente do documento. O aceite versionado é registrado no seu perfil.">
      <Section title="Dados que tratamos" text="Identificação de conta, conteúdo publicado, participação em comunidades, mensagens e registros de consentimento e auditoria." />
      <Section title="Finalidades" text="Operar a rede social, segurança e moderação, cumprimento legal e melhoria do produto." />
      <Section title="Seus direitos (LGPD)" text="Acesso, correção, portabilidade e exclusão. Use Exportar dados nas configurações para baixar seu JSON." />
      <Section title="Compartilhamento" text="Não vendemos dados. Conteúdo público aparece conforme suas configurações." />
      <Section title="Retenção" text="Dados mantidos enquanto a conta existir e conforme obrigações legais e configurações de legado." />
      <button type="button" onClick={() => navigate('/privacidade/configuracoes')} style={{ marginTop: 8, padding: '12px 28px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
        Ver controles de privacidade
      </button>
    </SitePage>
  );
}

export function SitePrivacidadeControles() {
  const go = (to: string) => navigate(to);
  return (
    <SitePage eyebrow="Privacidade" title="Controles de privacidade" description="Atalhos reais para cada controle dentro do app (exigem login).">
      {[
        ['Perfil e dados', 'Nome, bio e preferências.', '/app/configuracoes/conta'],
        ['Privacidade e LGPD', 'Consentimentos e exportação de dados.', '/app/configuracoes/privacidade'],
        ['Segurança e 2FA', 'Segundo fator, códigos e sessões.', '/app/configuracoes/seguranca'],
        ['Notificações', 'E-mail e push.', '/app/configuracoes/notificacoes'],
        ['Legado e memorial', 'O que acontece com sua conta no futuro.', '/configuracoes/memorial'],
      ].map(([label, text, route]) => (
        <div key={route} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#0F172A' }}>{label}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#475569' }}>{text}</p>
          </div>
          <button type="button" onClick={() => go(route)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>
            Abrir
          </button>
        </div>
      ))}
    </SitePage>
  );
}

export function SiteTermos() {
  return (
    <SitePage eyebrow="Termos" title="Termos de Uso" description="Versão vigente exibida no aceite do contrato.">
      <Section title="1. A plataforma" text="A FLOW é uma rede social para descobrir pessoas, criar conteúdo e participar de comunidades." />
      <Section title="2. Sua conta" text="Você é responsável pela sua conta, por manter dados verdadeiros e por proteger sua senha." />
      <Section title="3. Conteúdo" text="Você mantém direitos sobre o que publica. É proibido conteúdo ilegal, violento ou que viole direitos de terceiros." />
      <Section title="4. Comunidade" text="Discurso de ódio, assédio, spam e conduta inautêntica levam a moderação, remoção ou suspensão." />
      <Section title="5. Privacidade" text="Tratamos dados conforme a LGPD e nossa Política de Privacidade." />
      <Section title="6. Encerramento" text="Você pode encerrar a conta quando quiser; violações podem gerar suspensão com direito a recurso." />
      <button type="button" onClick={() => navigate('/termos/versoes')} style={{ marginTop: 8, padding: '12px 28px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
        Histórico de versões
      </button>
    </SitePage>
  );
}

export function SiteTermosVersoes() {
  return (
    <SitePage eyebrow="Termos" title="Histórico de versões" description="Cada aceite registra versão, data e hora no seu perfil.">
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>v1.0.0-2026 — vigente</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#475569' }}>Versão atual do contrato exibida no aceite. Versões anteriores serão listadas aqui quando existirem.</p>
      </div>
    </SitePage>
  );
}
