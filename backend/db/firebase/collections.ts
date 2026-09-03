export const FIRESTORE_COLLECTIONS = {
  users:'users', profiles:'profiles', accountSecurity:'account_security', sessions:'sessions', devices:'devices', blocks:'blocks', verifications:'verifications', passwordResets:'password_resets', socialLinks:'social_links', businesses:'businesses', creators:'creators',
  posts:'posts', videos:'videos', shorts:'shorts', stories:'stories', lives:'lives', comments:'comments', likes:'likes', follows:'follows', shares:'shares', saves:'saves', hashtags:'hashtags', mentions:'mentions', notifications:'notifications',
  communities:'communities', communityMembers:'community_members', communityRules:'community_rules', communityPosts:'community_posts', communityModerators:'community_moderators',
  shops:'shops', sellers:'sellers', products:'products', categories:'categories', carts:'carts', orders:'orders', orderItems:'order_items', payments:'payments', shipments:'shipments', deliveries:'deliveries', complaints:'complaints', returns:'returns', refunds:'refunds', commissions:'commissions', affiliates:'affiliates', payouts:'payouts',
  tasks:'tasks', rewardCampaigns:'reward_campaigns', qualifiedViews:'qualified_views', rewards:'rewards', wallets:'wallets', ledger:'ledger', withdrawals:'withdrawals', antifraud:'antifraud',
  advertisers:'advertisers', adCampaigns:'ad_campaigns', adCreatives:'ad_creatives', ads:'ads', approvedDomains:'approved_domains', adImpressions:'ad_impressions', adClicks:'ad_clicks', adConversions:'ad_conversions', adReviews:'ad_reviews',
  reports:'reports', reportEvidence:'report_evidence', moderationCases:'moderation_cases', moderationActions:'moderation_actions', appeals:'appeals', prohibitedContent:'prohibited_content', prohibitedProducts:'prohibited_products', piracyCases:'piracy_cases',
  conversations:'conversations', messages:'messages', calls:'calls', callParticipants:'call_participants',
  admins:'admins', permissions:'permissions', roles:'roles', moduleConfigurations:'module_configurations', platformSettings:'platform_settings', logs:'logs', auditLogs:'audit_logs', analytics:'analytics',
} as const;
export type FirestoreCollection = typeof FIRESTORE_COLLECTIONS[keyof typeof FIRESTORE_COLLECTIONS];
