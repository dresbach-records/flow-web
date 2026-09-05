import { Users } from 'lucide-react';
import { formatCompact } from '../../../services/firebase/stats';
import type { Community } from '../../../services/firebase/communities';
import './CommunityCard.css';

export interface CommunityCardProps {
  community: Community;
  joined: boolean;
  busy: boolean;
  onToggle: () => void;
}

export function formatMembers(count: number | undefined): string {
  if (typeof count !== 'number' || count <= 0) return 'Comunidade nova';
  return `${formatCompact(count)} membros`;
}

export default function CommunityCard({ community, joined, busy, onToggle }: CommunityCardProps) {
  return (
    <article className="site-community-card">
      {community.imageUrl ? (
        <img src={community.imageUrl} alt="" loading="lazy" className="site-community-img" />
      ) : (
        <span className="site-community-fallback" aria-hidden="true">
          <Users size={26} color="#8B5CF6" />
        </span>
      )}
      <div className="site-community-meta">
        <strong>{community.name}</strong>
        <small>{formatMembers(community.memberCount)}</small>
        {community.description && <p>{community.description}</p>}
      </div>
      <button
        type="button"
        className={joined ? 'site-community-joined' : 'site-community-join'}
        onClick={onToggle}
        disabled={busy}
        aria-pressed={joined}
      >
        {busy ? '…' : joined ? 'Participando' : 'Participar'}
      </button>
    </article>
  );
}
