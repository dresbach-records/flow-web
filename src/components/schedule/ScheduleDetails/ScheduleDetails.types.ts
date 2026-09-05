import type { ScheduledPost } from '../../../hooks/useSchedules';

export interface ScheduleDetailsProps {
  item: ScheduledPost;
  onClose: () => void;
  onUpdate: (action: () => Promise<void>) => void;
}
