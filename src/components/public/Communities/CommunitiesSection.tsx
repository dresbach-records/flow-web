import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import CommunityGrid from './CommunityGrid';
import Toast from '../common/Toast';
import {
  OFFICIAL_COMMUNITIES,
  getJoinedCommunityIds,
  toggleCommunityJoin,
  CommunityItem,
} from '../../../services/publicCommunitiesService';
import './Communities.css';

export interface CommunitiesSectionProps {
  onNavigate: (path: string) => void;
  authenticated?: boolean;
}

export const CommunitiesSection: React.FC<CommunitiesSectionProps> = ({
  onNavigate,
  authenticated = false,
}) => {
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setJoinedIds(getJoinedCommunityIds());
  }, []);

  const handleToggleJoin = (id: string) => {
    if (!authenticated) {
      // In Flow, joining a community prompts login/registration
      onNavigate('/login');
      return;
    }

    const nowJoined = toggleCommunityJoin(id);
    const target = OFFICIAL_COMMUNITIES.find((c) => c.id === id);
    const title = target?.name || 'Comunidade';

    setJoinedIds(getJoinedCommunityIds());
    setToastMessage(
      nowJoined
        ? `Você agora faz parte de "${title}"!`
        : `Você saiu de "${title}".`
    );
  };

  return (
    <section className="flow-communities-section" id="comunidades" aria-labelledby="communities-title">
      <div className="flow-communities-container">
        {/* Header with Title and "Ver todas" button */}
        <div className="flow-communities-header">
          <div className="flow-communities-header__left">
            <span className="flow-communities-tag">ENCONTRE SUA TRIBO</span>
            <h2 id="communities-title" className="flow-communities-title">
              Comunidades em destaque
            </h2>
            <p className="flow-communities-subtitle">
              Participe de conversas reais com pessoas que compartilham as mesmas paixões que você.
            </p>
          </div>

          <div className="flow-communities-header__right">
            <button
              type="button"
              className="flow-communities-view-all"
              onClick={() => onNavigate('/comunidades')}
            >
              <span>Ver todas as comunidades</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 6 Grid items */}
        <CommunityGrid
          communities={OFFICIAL_COMMUNITIES}
          joinedIds={joinedIds}
          onToggleJoin={handleToggleJoin}
          onOpenCommunity={(id) => onNavigate(`/comunidades?id=${id}`)}
        />
      </div>

      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </section>
  );
};

export default CommunitiesSection;
