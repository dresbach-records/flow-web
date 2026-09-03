export type ModerationDecision = 'allow' | 'review' | 'block';

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'sexual-content'
  | 'copyright'
  | 'counterfeit'
  | 'regulated-product'
  | 'fraud'
  | 'other';

export type Report = {
  id: string;
  targetId: string;
  reason: ReportReason;
  status: 'pending' | 'reviewing' | 'resolved';
};

/** Trust & Safety API integration point. */
export async function submitReport(report: Omit<Report, 'id' | 'status'>) {
  return { ...report, id: crypto.randomUUID(), status: 'pending' as const };
}
