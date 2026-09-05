// FLOW — NotFound (404 honesto: nunca Home como substituto).
import { navigate } from '../hooks/useRouter';
import SitePage from './site/SitePage';

export default function NotFound({ path }: { path: string }) {
  return (
    <SitePage eyebrow="Erro 404" title="Página não encontrada" description={`"${path}" não existe na FLOW.`}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          type="button" onClick={() => navigate('/')}
          style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
        >
          Ir para a Home
        </button>
        <button
          type="button" onClick={() => navigate('/app')}
          style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}
        >
          Abrir o app
        </button>
      </div>
    </SitePage>
  );
}
