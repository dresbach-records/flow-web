import type { CreatorPeriod, CreatorRange, CreatorTotals, CreatorVideo } from '../types';

export interface CreatorOverviewProps {
  totals: CreatorTotals;
  period: CreatorPeriod;
  onPeriodChange: (period: CreatorPeriod) => void;
  chart: number[];
  range: CreatorRange;
  onRangeChange: (range: CreatorRange) => void;
  onSeeAll: () => void;
  videos: CreatorVideo[];
}
