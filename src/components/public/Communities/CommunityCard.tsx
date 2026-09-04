import React from 'react';
import { Users, Check } from 'lucide-react';
import { CommunityItem } from '../../../services/publicCommunitiesService';

export interface CommunityCardProps {
  community: CommunityItem;
  isJoined: boolean;
  onToggleJoin: (id: string) => void;
  onOpenCommunity?: (id: string) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isJoined,
  onToggleJoin,
  onOpenCommunity,
}) => {
  return (
    <div className="flow-community-card">
      <div
        className="flow-community-card__cover"
        onClick={() => onOpenCommunity?.(community.id)}
      >
        <img
          src={community.imageUrl}
          alt={community.name}
          className="flow-community-card__img"
          loading="lazy"
        />
        <span className="flow-community-card__category">{community.category}</span>
      </div>

      <div className="flow-community-card__body">
        <h3
          className="flow-community-card__name"
          onClick={() => onOpenCommunity?.(community.id)}
        >
          {community.name}
        </h3>

        <div className="flow-community-card__members">
          <Users size={14} />
          <span>{community.membersCount}</span>
        </div>

        <p className="flow-community-card__desc">{community.description}</p>

        <div className="flow-community-card__footer">
          <button
            type="button"
            className={`flow-community-card__btn ${
              isJoined ? 'flow-community-card__btn--joined' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleJoin(community.id);
            }}
          >
            {isJoined ? (
              <>
                <Check size={14} />
                <span>Membro</span>
              </>
            ) : (
              <span>Participar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
