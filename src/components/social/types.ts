// FLOW — Social domain types (FASE 3).
// Extraídos de src/app/SocialFeed.tsx sem alterar o comportamento.
// Firebase continua como infraestrutura real; nenhum mock foi criado.
import type { WithId } from '../../services/firebase/firestore';

export type RawRecord = Record<string, unknown>;

export type SocialPost = WithId<RawRecord> & { author?: RawRecord | null };

export interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  isOwn?: boolean;
  authorId?: string;
}

export type FeedTab = 'for-you' | 'following' | 'communities';

export interface CommentPreview {
  authorName: string;
  authorAvatar: string;
  text: string;
  timeAgo: string;
}
