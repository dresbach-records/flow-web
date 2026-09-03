import { logEvent } from 'firebase/analytics';
import { getFlowAnalytics } from './config';

/** Track a Firebase Analytics event, safely no-op when unsupported. */
export async function trackEvent(name: string, params?: Record<string, unknown>): Promise<void> {
  const analytics = await getFlowAnalytics();
  if (analytics) logEvent(analytics, name, params);
}

/** Track a page/route view. */
export async function trackPageView(path: string): Promise<void> {
  await trackEvent('page_view', { page_path: path, page_location: window.location.href });
}
