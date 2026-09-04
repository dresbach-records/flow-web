import React, { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share2, Trash2, ExternalLink } from 'lucide-react';

interface SavedItem {
  id: string;
  title: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timeAgo: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

const INITIAL_SAVED: SavedItem[] = [
  {
    id: 's-1',
    title: 'Acabei de subir uma prévia exclusiva da nova faixa que estou produzindo no estúdio aqui em SP. Sintetizadores analógicos vintage, graves gordos e uma linha melódica intimista.',
    authorName: 'Marina D.',
    authorHandle: '@marinabeats',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Há 2 dias',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    likes: 1240,
    comments: 48,
  },
  {
    id: 's-2',
    title: 'Guia definitivo de Design Tokens e padronização visual no Figma: como estruturar para equipes em escala.',
    authorName: 'Sofia Mendes',
    authorHandle: '@sofiaux',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Semana passada',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    likes: 850,
    comments: 32,
  },
];

export default function SavedModule() {
  const [items, setItems] = useState<SavedItem[]>(INITIAL_SAVED);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Bookmark size={26} color="#2563EB" />
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Itens Salvos</h1>
      </div>
      <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#64748B' }}>
        Sua coleção pessoal de publicações, fotos e conteúdos guardados para consulta posterior.
      </p>

      {items.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid #E2E8F0'
        }}>
          <Bookmark size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
            Nenhum item salvo
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: '#64748B' }}>
            Clique no ícone de marcador nas publicações do feed para salvá-las aqui.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                padding: 18,
                boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>
                      {item.authorName}
                    </strong>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{item.authorHandle} • {item.timeAgo}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  title="Remover dos salvos"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 6,
                    borderRadius: 8
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Text */}
              <p style={{ margin: 0, fontSize: 14, color: '#1E293B', lineHeight: 1.5 }}>
                {item.title}
              </p>

              {/* Image preview */}
              {item.imageUrl && (
                <div style={{ borderRadius: 12, overflow: 'hidden', maxHeight: 320 }}>
                  <img src={item.imageUrl} alt="Anexo" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
              )}

              {/* Bottom stats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                borderTop: '1px solid #F1F5F9',
                paddingTop: 10,
                fontSize: 12.5,
                color: '#64748B'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Heart size={16} color="#DC2626" fill="#DC2626" />
                  <span>{item.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageCircle size={16} />
                  <span>{item.comments} comentários</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
