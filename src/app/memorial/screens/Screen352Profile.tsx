import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen352Profile({ onNavigate }: MemorialScreenProps) {
  const [activeTab, setActiveTab] = useState('Publicações');

  return (
    <div>
      <div className="m352-cover" />
      <div className="m352-header">
        <div className="m352-avatar-wrap">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            alt="Carlos Eduardo"
            className="m352-avatar"
          />
        </div>
        <div className="m352-seal">
          <Heart size={14} fill="currentColor" /> Em memória de
        </div>
        <h2 className="m352-name">Carlos Eduardo</h2>
        <div className="m352-dates">★ 12/03/1965 &nbsp; † 20/06/2026</div>
        <div className="m352-quote">"Viverá para sempre em nossos corações."</div>

        <div className="m352-tabs">
          {['Publicações', 'Fotos', 'Vídeos', 'Homenagens', 'Sobre'].map((tab) => (
            <button
              key={tab}
              className={`m352-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Homenagens') onNavigate(353);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="m352-body-layout">
        <div className="m352-feed">
          <div className="m352-pinned-post">
            <div className="m352-author-row">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Avatar"
                style={{ width: 44, height: 44, borderRadius: '50%' }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: 15, color: '#0F172A' }}>Carlos Eduardo</strong>
                <small style={{ color: '#64748B' }}>10/05/2026 09:12</small>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 15, color: '#334155', lineHeight: 1.5 }}>
              Gratidão por tudo que vivi aqui. Cada momento com vocês fez toda a diferença na minha jornada. ❤️
            </p>
            <img
              src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80"
              alt="Paisagem de gratidão"
              style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748B', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Heart size={16} fill="#EF4444" color="#EF4444" /> 1.2K
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={16} /> 326
              </span>
            </div>
          </div>
        </div>

        <div className="m352-sidebar-cards">
          <div className="m352-side-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ fontSize: 15, color: '#0F172A' }}>Homenagens</strong>
              <small style={{ color: '#8B5CF6', fontWeight: 700 }}>1,2k mensagens</small>
            </div>
            <button
              className="m-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
              onClick={() => onNavigate(354)}
            >
              Deixar homenagem
            </button>
          </div>

          <div className="m352-side-card">
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block', marginBottom: 8 }}>
              Amigos
            </strong>
            <small style={{ color: '#64748B', display: 'block', marginBottom: 12 }}>318 amigos mútuos</small>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?img=${i + 20}`}
                  alt="Amigo"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px solid #FFFFFF',
                    marginLeft: i > 1 ? -8 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
