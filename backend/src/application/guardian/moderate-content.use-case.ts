import type { GuardianInput, ModerationResult } from '../../domain/guardian/moderation-result.js';
import type { GuardianAiPort } from '../../infrastructure/ai/vertex-ai/gemini-guardian.adapter.js';
import type { GuardianFeatureFlag } from './feature-flag.service.js';
import type { GuardianModerationRepository } from '../../infrastructure/guardian/firestore-moderation.repository.js';

export type GuardianDecision = ModerationResult | { action: 'disabled'; model: 'none' };

export class ModerateContentUseCase {
  constructor(
    private readonly featureFlag: GuardianFeatureFlag,
    private readonly ai: GuardianAiPort,
    private readonly repository: GuardianModerationRepository,
  ) {}

  async execute(input: GuardianInput): Promise<GuardianDecision> {
    if (!this.featureFlag.isEnabled()) return { action: 'disabled', model: 'none' };

    const result = await this.ai.moderate(input);
    await this.repository.save({ input, result });
    return result;
  }
}
