export type AdFormat = 'feed-post' | 'story' | 'shorts' | 'banner';
export type AdReviewStatus = 'pending' | 'approved' | 'rejected' | 'manual-review';

export type AdCampaign = {
  id: string;
  format: AdFormat;
  destinationUrl?: string;
  reviewStatus: AdReviewStatus;
  immutableApprovedDomain?: string;
};

/** Ad provider/backend integration boundary. Provider credentials never belong in the frontend. */
export type AdProvider = 'google-ads' | 'internal';
