import { env } from '../../config/env.js';

export interface GuardianFeatureFlag {
  isEnabled(): boolean;
}

export class GuardianFeatureFlagService implements GuardianFeatureFlag {
  isEnabled(): boolean {
    return env.FLOW_GUARDIAN_ENABLED;
  }
}
