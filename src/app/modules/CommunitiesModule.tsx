import React, { useState } from 'react';
import { Users, Plus, Check, Search, Globe, Lock, MessageSquare } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  banner: string;
  avatar: string;
  joined: boolean;
  isPrivate: boolean;
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'com-1',
    name: 'Produtores Musicais & Beatmakers BR',
    description: 'Espaço para troca de feedbacks de mix, samples livres, plugins e colaborações musicais.',
    members: 14200,
    category: 'Música',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&auto=format&fit=crop&q=80',
    joined: true,
    isPrivate: false,
  },
  {
    id: 'com-2',
    name: 'Design Systems & UI Engineering',
    description: 'Comunidade focada em arquitetura de componentes, tokens, acessibilidade e design ops.',
    members: 8900,
    category: 'Design & Tech',
    banner: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150&auto=format&fit=crop&q=80',
    joined: true,
    isPrivate: false,
  },
  {
    id: 'com-3',
    name: 'Fotografia Autoral & Analógica',
    description: 'Compartilhamento de ensaios, revelação química, filmes 35mm e técnicas de iluminação.',
    members: 6300,
    category: 'Fotografia',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150&auto=format&fit=crop&q=80',
    joined: false,
    isPrivate: false,
  },
  {
    id: 'com-4',
    name: 'Criadores Digitais & Monetização',
    description: 'Dicas sobre crescimento orgânico, parcerias comerciais, criação de conteúdo e Flow Rewards.',
    members: 19500,
    category: 'Criadores',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=150&auto=format&fit=crop&q=80',
    joined: false,
    isPrivate: false,
  },
];

export default function CommunitiesModule() {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [tab, setTab] = useState<'all' | 'my'>('all');
  const [search, setSearch] = useState('');

  const toggleJoin = (id: string) => {
    setCommunities(prev =>
      prev.map(c => (c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c))
    );
  };

  const filtered = communities.filter(c => {
    const matchesTab = tab === 'all' || c.joined;
    const matchesSearch = !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Users size={26} color="#2563EB" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Comunidades</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
            Participe de grupos temáticos com interesses afins aos seus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Em breve: ferramenta de criação e moderação de nova comunidade.')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>Criar Comunidade</span>
        </button>
      </div>

      {/* Search & Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou categoria..."
            style={{
              width: '100%',
              height: 40,
              padding: '0 16px 0 40px',
              borderRadius: 999,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: 13.5,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setTab('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: tab === 'all' ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: tab === 'all' ? '#EFF6FF' : '#FFFFFF',
              color: tab === 'all' ? '#2563EB' : '#475569'
            }}
          >
            Explorar todas
          </button>
          <button
            type="button"
            onClick={() => setTab('my')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: tab === 'my' ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: tab === 'my' ? '#EFF6FF' : '#FFFFFF',
              color: tab === 'my' ? '#2563EB' : '#475569'
            }}
          >
            Minhas comunidades ({communities.filter(c => c.joined).length})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
      }}>
        {filtered.map(com => (
          <div
            key={com.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Banner */}
            <div style={{ height: 100, width: '100%', position: 'relative' }}>
              <img src={com.banner} alt={com.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(15,23,42,0.7)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600
              }}>
                {com.category}
              </span>
            </div>

            {/* Avatar and Body */}
            <div style={{ padding: '0 16px 16px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -24, marginBottom: 12 }}>
                <img
                  src={com.avatar}
                  alt={com.name}
                  style={{ width: 52, height: 52, borderRadius: 14, border: '3px solid #FFFFFF', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => toggleJoin(com.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: com.joined ? '1px solid #CBD5E1' : 'none',
                    background: com.joined ? '#F8FAFC' : '#2563EB',
                    color: com.joined ? '#475569' : '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {com.joined ? (
                    <>
                      <Check size={14} />
                      <span>Participando</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Entrar</span>
                    </>
                  )}
                </button>
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                {com.name}
              </h3>
              <p style={{ margin: '0 0 14px 0', fontSize: 13, color: '#64748B', lineHeight: 1.45, flex: 1 }}>
                {com.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={14} />
                  <span>{com.members.toLocaleString('pt-BR')} membros</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={14} />
                  <span>Pública</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
