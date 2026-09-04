import React from 'react';
import './RightRail.css';

export interface RightRailProps {
  go?: (to: string) => void;
  children?: React.ReactNode;
}

const SUGGESTIONS = [
  { name: 'Mariana Costa', handle: '@maricosta', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
  { name: 'Tech & Inovação', handle: '@techeflow', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=80' },
  { name: 'Lucas Mendes', handle: '@lucasmendes', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
];

const TRENDS = [
  { tag: '#FlowAoVivo', posts: '12,5 mil posts' },
  { tag: '#ViagensIncríveis', posts: '8.742 posts' },
  { tag: '#VidaSaudável', posts: '6.338 posts' },
  { tag: '#Fotografia', posts: '4.921 posts' },
];

export default function RightRail({
  go = (to) => window.location.pathname = to,
  children,
}: RightRailProps) {
  if (children) {
    return <div className="flow-right-rail">{children}</div>;
  }

  return (
    <div className="flow-right-rail">
      {/* Sugestões */}
      <div className="flow-rail-card">
        <div className="flow-rail-title">
          <h3>Sugestões para você</h3>
          <button onClick={() => go('/app/explorar')}>Ver todas</button>
        </div>
        <div className="flow-rail-list">
          {SUGGESTIONS.map((user) => (
            <div key={user.handle} className="flow-rail-user-row">
              <img src={user.img} alt={user.name} className="flow-rail-avatar" />
              <div className="flow-rail-user-meta">
                <span className="flow-rail-name">{user.name}</span>
                <span className="flow-rail-handle">{user.handle}</span>
              </div>
              <button className="flow-rail-follow-btn" onClick={() => go('/app/explorar')}>
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Em alta */}
      <div className="flow-rail-card">
        <div className="flow-rail-title">
          <h3>O que está em alta</h3>
          <button onClick={() => go('/app/explorar')}>Ver mais</button>
        </div>
        <div className="flow-rail-list">
          {TRENDS.map((trend) => (
            <button key={trend.tag} className="flow-rail-trend-item" onClick={() => go('/app/explorar')}>
              <strong>{trend.tag}</strong>
              <span>{trend.posts}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
