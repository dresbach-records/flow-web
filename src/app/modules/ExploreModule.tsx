import React, { useState } from 'react';
import { Search, Flame, TrendingUp, Sparkles, Heart, MessageCircle, Share2, Compass } from 'lucide-react';

const EXPLORE_TAGS = ['Todos', 'Tendências', 'Tecnologia', 'Música', 'Design', 'Fotografia', 'Estilo', 'Games'];

const EXPLORE_ITEMS = [
  {
    id: 'exp-1',
    title: 'Produzindo beats no Logic Pro com plugins analógicos',
    author: 'Marina D.',
    handle: '@marinabeats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    likes: 1420,
    comments: 88,
    category: 'Música',
    tag: 'producaomusical',
  },
  {
    id: 'exp-2',
    title: 'Arquitetura moderna e o uso de luz natural em São Paulo',
    author: 'Lucas Rocha',
    handle: '@lucasarch',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    likes: 980,
    comments: 42,
    category: 'Design',
    tag: 'arquitetura',
  },
  {
    id: 'exp-3',
    title: 'Novo workflow de UI/UX com tokens adaptativos no Figma',
    author: 'Sofia Mendes',
    handle: '@sofiaux',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    likes: 2310,
    comments: 156,
    category: 'Tecnologia',
    tag: 'designsystem',
  },
  {
    id: 'exp-4',
    title: 'Ensaio fotográfico analógico 35mm em Florianópolis',
    author: 'Gabriel Lima',
    handle: '@gabriel.raw',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    likes: 1840,
    comments: 94,
    category: 'Fotografia',
    tag: '35mm',
  },
  {
    id: 'exp-5',
    title: 'Setup desk minimalista com tela ultrawide e iluminação âmbar',
    author: 'Thiago Dev',
    handle: '@thiagotech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    likes: 3100,
    comments: 210,
    category: 'Tecnologia',
    tag: 'setuptour',
  },
  {
    id: 'exp-6',
    title: 'Live sessions acústicas gravadas no rooftop ao entardecer',
    author: 'Banda Aurora',
    handle: '@bandaaurora',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    likes: 1650,
    comments: 73,
    category: 'Música',
    tag: 'indiebrasil',
  },
];

export default function ExploreModule() {
  const [activeTag, setActiveTag] = useState('Todos');
  const [query, setQuery] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredItems = EXPLORE_ITEMS.filter((item) => {
    const matchesTag = activeTag === 'Todos' || item.category === activeTag || activeTag === 'Tendências';
    const matchesQuery = !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.author.toLowerCase().includes(query.toLowerCase()) ||
      item.tag.toLowerCase().includes(query.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header & Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Compass size={28} color="#2563EB" />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Explorar</h1>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
          Descubra o que está em alta na FLOW: novos criadores, hashtags virais e tendências globais.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        marginBottom: 20,
        maxWidth: 580,
      }}>
        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: 13 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por tags (#musica, #tecnologia), criadores ou temas..."
          style={{
            width: '100%',
            height: 44,
            padding: '0 16px 0 46px',
            borderRadius: 999,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            fontSize: 14,
            color: '#0F172A',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        />
      </div>

      {/* Tags Carousel */}
      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 24
      }}>
        {EXPLORE_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTag === tag ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: activeTag === tag ? '#2563EB' : '#FFFFFF',
              color: activeTag === tag ? '#FFFFFF' : '#475569',
              whiteSpace: 'nowrap',
              boxShadow: activeTag === tag ? '0 2px 8px rgba(37,99,235,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {tag === 'Tendências' && <Flame size={14} style={{ display: 'inline', marginRight: 4 }} />}
            {tag}
          </button>
        ))}
      </div>

      {/* Explore Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
      }}>
        {filteredItems.map((item) => {
          const isLiked = likedItems.has(item.id);
          return (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {/* Media Thumbnail */}
              <div style={{ position: 'relative', height: 200, width: '100%', overflow: 'hidden' }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15,23,42,0.7)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  #{item.tag}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                  {item.title}
                </h3>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <img
                      src={item.avatar}
                      alt={item.author}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', display: 'block', lineHeight: 1.2 }}>
                        {item.author}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{item.handle}</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: 10
                  }}>
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isLiked ? '#DC2626' : '#64748B',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      <Heart size={16} fill={isLiked ? '#DC2626' : 'none'} />
                      <span>{item.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}>
                      <MessageCircle size={16} />
                      <span>{item.comments}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copiado!');
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
