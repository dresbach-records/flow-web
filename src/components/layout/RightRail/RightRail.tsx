import React, { useEffect, useState } from 'react';
import { listCommunities, type Community } from '../../../services/firebase/communities';
import { listDocuments, type WithId } from '../../../services/firebase/firestore';
import type { RawRecord } from '../../social/types';
import './RightRail.css';

export interface RightRailProps {
  go?: (to: string) => void;
  children?: React.ReactNode;
}

interface Trend {
  tag: string;
  count: number;
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')} mil posts` : `${n} posts`;
}

export default function RightRail({
  go = (to) => (window.location.pathname = to),
  children,
}: RightRailProps) {
  const [suggestions, setSuggestions] = useState<Community[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Sugestões = comunidades reais por popularidade. Sem mock, sem números fixos.
    void listCommunities(3)
      .then((items) => {
        if (!cancelled) setSuggestions(items);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    // Tendências = frequência real de hashtags nos posts recentes.
    void listDocuments<RawRecord>('posts', { orderByField: 'createdAt', direction: 'desc', max: 20 })
      .then((posts: WithId<RawRecord>[]) => {
        if (cancelled) return;
        const freq = new Map<string, number>();
        posts.forEach((p) => {
          const tags = p.hashtags;
          if (Array.isArray(tags)) {
            tags.forEach((t) => {
              if (typeof t === 'string' && t) freq.set(t, (freq.get(t) ?? 0) + 1);
            });
          }
        });
        setTrends(
          [...freq.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([tag, count]) => ({ tag, count })),
        );
      })
      .catch(() => {
        if (!cancelled) setTrends([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (children) {
    return <div className="flow-right-rail">{children}</div>;
  }

  if (suggestions.length === 0 && trends.length === 0) return null;

  return (
    <div className="flow-right-rail">
      {/* Sugestões */}
      {suggestions.length > 0 && (
        <div className="flow-rail-card">
          <div className="flow-rail-title">
            <h3>Sugestões para você</h3>
            <button onClick={() => go('/app/explorar')}>Ver todas</button>
          </div>
          <div className="flow-rail-list">
            {suggestions.map((community) => (
              <div key={community.id} className="flow-rail-user-row">
                <img src={community.imageUrl || '/logo.png'} alt={community.name} className="flow-rail-avatar" />
                <div className="flow-rail-user-meta">
                  <span className="flow-rail-name">{community.name}</span>
                  <span className="flow-rail-handle">
                    {(community.memberCount ?? 0) > 0
                      ? `${community.memberCount} membros`
                      : 'Comunidade'}
                  </span>
                </div>
                <button className="flow-rail-follow-btn" onClick={() => go('/app/comunidades')}>
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Em alta */}
      {trends.length > 0 && (
        <div className="flow-rail-card">
          <div className="flow-rail-title">
            <h3>O que está em alta</h3>
            <button onClick={() => go('/app/explorar')}>Ver mais</button>
          </div>
          <div className="flow-rail-list">
            {trends.map((trend) => (
              <button key={trend.tag} className="flow-rail-trend-item" onClick={() => go('/app/explorar')}>
                <strong>{trend.tag}</strong>
                <span>{formatCount(trend.count)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
