// FLOW — Creator domain types (FASE 3).
// Extraídos de src/app/CreatorCenter.tsx com tipos estritos (sem `any`).

export type CreatorTab = 'overview' | 'posts' | 'followers' | 'income';

export type CreatorPeriod = '7' | '30';

export type CreatorRange = 'views' | 'likes';

export interface CreatorVideo {
  title: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  img: string;
  date: string;
  completion: string;
}

export interface CreatorTotals {
  views: string;
  delta: string;
  followers: string;
  fdelta: string;
  income: string;
  likes: string;
}
