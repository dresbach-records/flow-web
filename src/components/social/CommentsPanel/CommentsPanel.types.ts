import type { SocialPost } from '../types';

export interface CommentsPanelProps {
  post: SocialPost;
  onClose: () => void;
}
