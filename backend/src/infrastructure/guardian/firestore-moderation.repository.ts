import { firestore } from '../database.js';
import type { GuardianInput, ModerationResult } from '../../domain/guardian/moderation-result.js';

export type ModerationRecord = {
  input: GuardianInput;
  result: ModerationResult;
};

export interface GuardianModerationRepository {
  save(record: ModerationRecord): Promise<void>;
}

export class FirestoreModerationRepository implements GuardianModerationRepository {
  async save(record: ModerationRecord): Promise<void> {
    await firestore().collection('guardian_moderations').add({
      ...record.input,
      ...record.result,
      reviewedAt: new Date(),
    });
  }
}
