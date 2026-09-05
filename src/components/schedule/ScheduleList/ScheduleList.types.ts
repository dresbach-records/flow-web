import type { ScheduledPost } from '../../../hooks/useSchedules';

export interface ScheduleListProps {
  items: ScheduledPost[];
  onSelect: (item: ScheduledPost) => void;
  onDelete: (id: string) => void;
}
