// FLOW — Hub de criação (navegação real; publicação texto/foto/vídeo real).
import { navigate } from '../../hooks/useRouter';
import CreatePostModal from './CreatePostModal';
import EmptyState from '../../components/ui/EmptyState';

const OPTIONS: Array<{ id: string; title: string; text: string; route: string | null }> = [
  { id: 'post', title: 'Publicação', text: 'Texto, foto ou vídeo no feed.', route: '/app/criar/publicacao' },
  { id: 'video', title: 'Vídeo', text: 'Vídeo com upload real.', route: '/app/criar/video' },
  { id: 'story', title: 'Story', text: 'Criação de stories chega com o backend (Fase 9).', route: null },
  { id: 'enquete', title: 'Enquete', text: 'Enquetes chegam com o modelo de dados próprio (Fase 9).', route: null },
];

export function CreateHub() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ margin: '0 0 6px 0', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Criar</h1>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>Escolha o que publicar.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {OPTIONS.map((o) => (
          <div key={o.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>{o.title}</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: 13.5, color: '#475569' }}>{o.text}</p>
            {o.route ? (
              <button type="button" onClick={() => navigate(o.route as string)} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
                Começar
              </button>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8' }}>EM IMPLEMENTAÇÃO</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreatePostPage() {
  return (
    <CreatePostModal
      isOpen
      onClose={() => navigate('/app')}
      onCreated={() => navigate('/app')}
    />
  );
}
