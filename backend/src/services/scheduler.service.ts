import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../infrastructure/database.js';
import { GuardianFeatureFlagService } from '../application/guardian/feature-flag.service.js';
import { ModerateContentUseCase } from '../application/guardian/moderate-content.use-case.js';
import { GeminiGuardianAdapter } from '../infrastructure/ai/vertex-ai/gemini-guardian.adapter.js';
import { FirestoreModerationRepository } from '../infrastructure/guardian/firestore-moderation.repository.js';
import { writePersonaAudit } from './persona.service.js';

const guardian = new ModerateContentUseCase(new GuardianFeatureFlagService(), new GeminiGuardianAdapter(), new FirestoreModerationRepository());

export async function processScheduledPublications(now = new Date()): Promise<number> {
  const snapshot = await firestore().collection('posts').where('status', '==', 'SCHEDULED').where('scheduledAt', '<=', now).limit(20).get();
  let processed = 0;
  for (const document of snapshot.docs) {
    const claimed = await firestore().runTransaction(async transaction => {
      const current = await transaction.get(document.ref);
      if (!current.exists || current.get('status') !== 'SCHEDULED') return false;
      transaction.update(document.ref, { status: 'PROCESSING', processingStartedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
    if (!claimed) continue;
    const data = document.data();
    try {
      const moderation = await guardian.execute({ authorId: data.authorId as string, contentType: data.type as 'post' | 'short' | 'video', text: data.caption as string | undefined, mediaUrl: data.mediaUrl as string | undefined });
      if (moderation.action !== 'allow' && moderation.action !== 'disabled') {
        await document.ref.update({ status: 'FAILED', failureReason: `Guardian: ${moderation.reason}`, guardianStatus: moderation.action, guardianReason: moderation.reason, reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
        await writePersonaAudit('persona.post.failed', document.id, { reason: moderation.reason });
        continue;
      }
      await document.ref.update({ status: 'PUBLISHED', visibility: 'public', publishedAt: FieldValue.serverTimestamp(), guardianStatus: moderation.action, guardianReason: moderation.action === 'disabled' ? null : moderation.reason, reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      await writePersonaAudit('persona.post.published', document.id);
      processed += 1;
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'UNKNOWN_SCHEDULER_ERROR';
      await document.ref.update({ status: 'FAILED', failureReason: reason, updatedAt: FieldValue.serverTimestamp() });
      await writePersonaAudit('persona.post.failed', document.id, { reason });
    }
  }
  return processed;
}

export function startPublicationScheduler(intervalMs = 60_000): NodeJS.Timeout {
  const run = () => void processScheduledPublications().catch(error => console.error('Scheduled publication worker failed', error));
  run();
  return setInterval(run, intervalMs);
}
