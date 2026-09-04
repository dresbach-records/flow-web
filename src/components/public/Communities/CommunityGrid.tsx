import React from 'react';
import CommunityCard from './CommunityCard';
import { CommunityItem } from '../../../services/publicCommunitiesService';

export interface CommunityGridProps {
  communities: CommunityItem[];
  joinedIds: string[];
  onToggleJoin: (id: string) => void;
  onOpenCommunity?: (id: string) => void;
}

export const CommunityGrid: React.FC<CommunityGridProps> = ({
  communities,
  joinedIds,
  onToggleJoin,
  onOpenCommunity,
}) => {
  return (
    <div className="flow-community-grid">
      {communities.map((c) => (
        <CommunityCard
          key={c.id}
          community={c}
          isJoined={joinedIds.includes(c.id)}
          onToggleJoin={onToggleJoin}
          onOpenCommunity={onOpenCommunity}
        />
      ))}
    </div>
  );
};

export default CommunityGrid;
