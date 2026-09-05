import { Heart } from 'lucide-react';
import type { ProfileTabsProps } from './ProfileTabs.types';
import './ProfileTabs.css';

export default function ProfileTabs({ tab, onChange, own }: ProfileTabsProps) {
  return (
    <nav className="flow-profile-tabs" aria-label="Conteúdo do perfil">
      <button className={tab === 'posts' ? 'active' : ''} onClick={() => onChange('posts')}>
        Publicações
      </button>
      <button className={tab === 'media' ? 'active' : ''} onClick={() => onChange('media')}>
        Mídia
      </button>
      {own && (
        <button className={tab === 'likes' ? 'active' : ''} onClick={() => onChange('likes')}>
          <Heart size={15} /> Curtidas
        </button>
      )}
    </nav>
  );
}
