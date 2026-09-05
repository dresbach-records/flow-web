import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  onHome: () => void;
  children: ReactNode;
}
