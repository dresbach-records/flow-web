import { Heart, MessageCircle, MoreHorizontal, Send, UserRound } from 'lucide-react';
import { firstText, image, number } from '../../../hooks/useProfile';
import type { ProfilePostCardProps } from './ProfilePostCard.types';
import './ProfilePostCard.css';

export default function ProfilePostCard({ post }: ProfilePostCardProps) {
  const media = image(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl']);
  const avatar = image(post.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']);
  const caption = firstText(post, ['caption', 'text', 'content']);
  return (
    <article className="flow-profile-post">
      <header>
        <span className="flow-post-author">
          <span className="flow-avatar">{avatar ? <img src={avatar} alt="" /> : <UserRound size={19} />}</span>
          <span>
            <strong>{firstText(post.author, ['name', 'displayName'], 'Usuário')}</strong>
            <small>{firstText(post.author, ['handle', 'username'])}</small>
          </span>
        </span>
        <MoreHorizontal size={19} />
      </header>
      {caption && <p>{caption}</p>}
      {media && (
        <div className="flow-profile-post-media">
          <img src={media} alt="Publicação" />
        </div>
      )}
      <footer>
        <span>
          <Heart size={18} /> {number(post.likes || post.likeCount)}
        </span>
        <span>
          <MessageCircle size={18} /> {number(post.comments || post.commentCount)}
        </span>
        <span>
          <Send size={18} /> {number(post.shares || post.shareCount)}
        </span>
      </footer>
    </article>
  );
}
