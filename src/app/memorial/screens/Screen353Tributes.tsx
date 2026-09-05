import { Heart } from 'lucide-react';
import type { MemorialScreenProps } from './types';

const tributes = [
  {
    id: 1,
    author: 'Mariana Silva',
    date: '20/06/2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    text: 'Você sempre será lembrado pela sua alegria e generosidade. Saudades eternas! ❤️🕊️',
    likes: 254,
  },
  {
    id: 2,
    author: 'João Pereira',
    date: '19/06/2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    text: 'Obrigado por todos os momentos. Você fez a diferença na vida de muitos de nós.',
    likes: 126,
  },
  {
    id: 3,
    author: 'Fernanda Lima',
    date: '18/06/2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    text: 'Que sua luz continue inspirando a todos nós. ✨',
    likes: 96,
  },
  {
    id: 4,
    author: 'Ricardo Alves',
    date: '17/06/2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
    text: 'Amigo para sempre! 🤝🕊️',
    likes: 78,
  },
];

export default function Screen353Tributes({ onNavigate }: MemorialScreenProps) {
  return (
    <div className="m353-wrap">
      <div className="m353-header">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Homenagens</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>
            Deixe aqui sua mensagem, foto ou vídeo em memória de Carlos Eduardo.
          </p>
        </div>
        <button className="m-btn-primary" onClick={() => onNavigate(354)}>
          Escrever homenagem
        </button>
      </div>

      <div className="m353-list">
        {tributes.map((t) => (
          <div key={t.id} className="m353-card">
            <div className="m353-author-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={t.avatar} alt={t.author} style={{ width: 42, height: 42, borderRadius: '50%' }} />
                <div>
                  <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>{t.author}</strong>
                  <small style={{ color: '#94A3B8' }}>{t.date}</small>
                </div>
              </div>
              <button
                style={{
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#EF4444',
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Heart size={14} fill="currentColor" /> {t.likes}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#334155', lineHeight: 1.6 }}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
