import type { ComponentType } from 'react';

export interface CreatorMetricProps {
  icon: ComponentType;
  label: string;
  value: string;
  delta?: string;
}
