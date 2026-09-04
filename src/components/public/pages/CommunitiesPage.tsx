import React, { useState, useEffect } from 'react';
import PublicPageLayout from './PublicPageLayout';
import CommunityCard from '../Communities/CommunityCard';
import Toast from '../common/Toast';
import {
  OFFICIAL_COMMUNITIES,
  getJoinedCommunityIds,
  toggleCommunityJoin,
} from '../../../services/publicCommunitiesService';
import { Search } from 'lucide-react';

export interface CommunitiesPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const CommunitiesPage: React.FC<CommunitiesPageProps> = ({
  currentPath,
  onNavigate,
  authenticated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setJoinedIds(getJoinedCommunityIds());
  }, []);

  const categories = ['Todas', 'Viagens', 'Arte & Foto', 'Saúde & Bem-estar', 'Tecnologia', 'Animais de Estimação', 'Música & Som'];

  const filtered = OFFICIAL_COMMUNITIES.filter((c) => {
    const matchCat = selectedCategory === 'Todas' || c.category.includes(selectedCategory) || c.category === selectedCategory;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggleJoin = (id: string) => {
    if (!authenticated) {
      onNavigate('/login');
      return;
    }
    const nowJoined = toggleCommunityJoin(id);
    const target = OFFICIAL_COMMUNITIES.find((c) => c.id === id);
    setJoinedIds(getJoinedCommunityIds());
    setToastMessage(nowJoined ? `Você entrou na comunidade "${target?.name}"!` : `Você saiu de "${target?.name}".`);
  };

  return (
    <PublicPageLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      authenticated={authenticated}
      tag="EXPLORE & PARTICIPE"
      title="Comunidades no Flow"
      subtitle="Junte-se a milhares de membros que discutem e produzem conteúdos sobre suas paixões diárias."
    >
      {/* Search & Categories Toolbar */}
      <div style={{ marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto', width: '100%' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
          />
          <input
            type="search"
            placeholder="Buscar por nome ou tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 9999,
              border: '1px solid #CBD5E1',
              fontSize: 14,
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#3B82F6' : '#FFFFFF',
                color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#3B82F6' : '#E2E8F0',
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flow-community-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map((c) => (
          <CommunityCard
            key={c.id}
            community={c}
            isJoined={joinedIds.includes(c.id)}
            onToggleJoin={handleToggleJoin}
            onOpenCommunity={() => {
              if (authenticated) {
                onNavigate(`/app`);
              } else {
                onNavigate('/login');
              }
            }}
          />
        ))}
      </div>

      {toastMessage && (
        <Toast type="success" message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </PublicPageLayout>
  );
};

export default CommunitiesPage;
