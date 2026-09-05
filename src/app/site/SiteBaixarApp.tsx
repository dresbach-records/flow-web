// FLOW — Baixar App (instalação PWA real por plataforma).
import InstallAppPrompt from '../../components/site/InstallAppPrompt';
import SitePage from './SitePage';

function Step({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#0F172A' }}>{title}</h3>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
        {items.map((s) => <li key={s}>{s}</li>)}
      </ol>
    </div>
  );
}

export function SiteBaixarApp() {
  return (
    <SitePage
      eyebrow="Baixar App"
      title="Instale o FLOW"
      description="O FLOW é um PWA: instala como aplicativo, abre em tela cheia e continua funcionando com consciência offline."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
        <Step title="No Android (Chrome)" items={['Abra o FLOW no Chrome', 'Toque no menu ⋮', 'Toque em "Instalar aplicativo"', 'Confirme em "Instalar"']} />
        <Step title="No iPhone (Safari)" items={['Abra o FLOW no Safari', 'Toque em Compartilhar', 'Toque em "Adicionar à Tela de Início"', 'Confirme em "Adicionar"']} />
        <Step title="No Desktop (Chrome/Edge)" items={['Abra o FLOW no navegador', 'Clique no ícone de instalação na barra de endereços', 'Confirme a instalação']} />
      </div>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>Benefícios da instalação</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
          Abertura rápida em tela cheia, ícone próprio, aviso quando estiver offline e retorno automático quando a conexão voltar.
        </p>
      </div>
      <InstallAppPrompt />
    </SitePage>
  );
}
