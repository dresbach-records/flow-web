import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../../../config/env.js';
import type { GuardianInput, ModerationResult } from '../../../domain/guardian/moderation-result.js';

const actionValues = ['allow', 'review', 'block'] as const;
const categoryValues = ['none', 'harassment', 'hate', 'sexual', 'violence', 'self_harm', 'spam', 'illegal', 'privacy', 'other'] as const;

export interface GuardianAiPort {
  moderate(input: GuardianInput): Promise<ModerationResult>;
}

export class GeminiGuardianAdapter implements GuardianAiPort {
  private readonly client: GoogleGenAI;

  constructor(
    private readonly project = env.GOOGLE_CLOUD_PROJECT ?? env.FIREBASE_PROJECT_ID,
    private readonly location = env.GOOGLE_CLOUD_LOCATION,
    private readonly model = env.FLOW_GUARDIAN_MODEL,
  ) {
    this.client = new GoogleGenAI({ vertexai: true, project: this.project, location: this.location });
  }

  async moderate(input: GuardianInput): Promise<ModerationResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.FLOW_GUARDIAN_TIMEOUT_MS);

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [{
          role: 'user',
          parts: [{ text: [
            'You are FLOW Guardian, the content safety classifier for the FLOW social network.',
            'Classify only the supplied user content and return JSON matching the schema.',
            'Use action=allow for content that can remain public, review when human moderation should inspect it, and block for clear policy violations.',
            'Use category=none when there is no relevant violation.',
            'Do not invent facts or include personal data in the reason.',
            `authorId: ${input.authorId}`,
            `contentType: ${input.contentType}`,
            `text: ${input.text ?? ''}`,
            `mediaUrlProvided: ${Boolean(input.mediaUrl)}`,
          ].join('\n') }],
        }],
        config: {
          abortSignal: controller.signal,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING, enum: [...actionValues] },
              category: { type: Type.STRING, enum: [...categoryValues] },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ['action', 'category', 'confidence', 'reason'],
          },
        },
      });

      const raw = response.text?.trim();
      if (!raw) throw new Error('GUARDIAN_EMPTY_RESPONSE');
      const parsed = JSON.parse(raw) as Partial<ModerationResult>;
      if (!actionValues.includes(parsed.action as (typeof actionValues)[number])) throw new Error('GUARDIAN_INVALID_ACTION');
      if (!categoryValues.includes(parsed.category as (typeof categoryValues)[number])) throw new Error('GUARDIAN_INVALID_CATEGORY');
      if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) throw new Error('GUARDIAN_INVALID_CONFIDENCE');
      if (typeof parsed.reason !== 'string') throw new Error('GUARDIAN_INVALID_REASON');

      return {
        action: parsed.action as ModerationResult['action'],
        category: parsed.category as ModerationResult['category'],
        confidence: parsed.confidence,
        reason: parsed.reason.slice(0, 500),
        model: this.model,
      };
    } catch (error) {
      if (controller.signal.aborted) throw new Error('GUARDIAN_TIMEOUT');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
