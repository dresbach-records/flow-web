export type ProfileTab = 'posts' | 'media' | 'likes';

export interface ProfileTabsProps {
  tab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  own: boolean;
}
