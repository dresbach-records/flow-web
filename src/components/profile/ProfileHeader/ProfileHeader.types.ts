import type { ReactNode } from 'react';
import type { Profile } from '../../../hooks/useProfile';

export interface ProfileHeaderProps {
  profile: Profile;
  postsCount: number;
  own: boolean;
  tabs?: ReactNode;
}
