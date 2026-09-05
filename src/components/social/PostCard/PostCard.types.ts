import type { SocialPost } from '../types';

export interface PostCardProps {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComments: () => void;
}
