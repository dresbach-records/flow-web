import { useEffect, useState } from 'react';
import { Edit3, MoreHorizontal, UserRound } from 'lucide-react';
import { getDocument } from '../../../services/firebase/firestore';
import { toggleFollow } from '../../../services/firebase/social';
import { useAppContext } from '../../../contexts/AppContext';
import type { ProfileHeaderProps } from './ProfileHeader.types';
import './ProfileHeader.css';

export default function ProfileHeader({ profile, postsCount, own, tabs }: ProfileHeaderProps) {
  const { user } = useAppContext();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (own || !user) {
      setFollowing(false);
      return;
    }
    let cancelled = false;
    void getDocument(`users/${user.uid}/following`, profile.uid)
      .then((doc) => {
        if (!cancelled) setFollowing(doc !== null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [own, user, profile.uid]);

  const handleFollow = () => {
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    void toggleFollow(profile.uid, !next)
      .catch(() => setFollowing(!next))
      .finally(() => setBusy(false));
  };

  return (
    <section className="flow-profile-card">
      <div className="flow-profile-cover-page">{profile.cover && <img src={profile.cover} alt="" />}</div>
      <div className="flow-profile-header-content">
        <div className="flow-profile-avatar-page">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <UserRound size={40} />}
        </div>
        <div className="flow-profile-actions">
          {own ? (
            <button className="flow-profile-outline">
              <Edit3 size={16} /> Editar perfil
            </button>
          ) : (
            <button className="flow-profile-primary" onClick={handleFollow} disabled={busy} aria-pressed={following}>
              {following ? 'Seguindo' : 'Seguir'}
            </button>
          )}
          <button className="flow-profile-icon" aria-label="Mais opções">
            <MoreHorizontal />
          </button>
        </div>
        <h1>{profile.name}</h1>
        <div className="flow-profile-handle">{profile.handle}</div>
        {profile.bio && <p className="flow-profile-bio">{profile.bio}</p>}
        <div className="flow-profile-details">
          {profile.location && <span>⌖ {profile.location}</span>}
          {profile.website && <span>↗ {profile.website}</span>}
        </div>
        <div className="flow-profile-stats-page">
          <span>
            <strong>{postsCount}</strong> publicações
          </span>
          {profile.followers !== undefined && (
            <span>
              <strong>{profile.followers}</strong> seguidores
            </span>
          )}
          {profile.following !== undefined && (
            <span>
              <strong>{profile.following}</strong> seguindo
            </span>
          )}
        </div>
      </div>
      {tabs}
    </section>
  );
}
