import { flowRepositories } from '../infrastructure/firebase/module-repository';

export const flowModuleServices = {
  account: flowRepositories.users,
  social: { posts: flowRepositories.posts, videos: flowRepositories.videos, comments: flowRepositories.comments, likes: flowRepositories.likes, follows: flowRepositories.follows },
  communications: { conversations: flowRepositories.conversations, messages: flowRepositories.messages, calls: flowRepositories.calls },
  communities: flowRepositories.communities,
  shop: { shops: flowRepositories.shops, products: flowRepositories.products, orders: flowRepositories.orders, payments: flowRepositories.payments, shipments: flowRepositories.shipments, complaints: flowRepositories.complaints, returns: flowRepositories.returns, refunds: flowRepositories.refunds },
  rewards: { rewards: flowRepositories.rewards, wallets: flowRepositories.wallets, ledger: flowRepositories.ledger, withdrawals: flowRepositories.withdrawals },
  advertising: { ads: flowRepositories.ads, campaigns: flowRepositories.adCampaigns, domains: flowRepositories.approvedDomains },
  moderation: { reports: flowRepositories.reports, cases: flowRepositories.moderationCases, appeals: flowRepositories.appeals },
  administration: { administrators: flowRepositories.administrators, permissions: flowRepositories.permissions, roles: flowRepositories.roles, modules: flowRepositories.modules, settings: flowRepositories.settings, logs: flowRepositories.logs, audits: flowRepositories.audits, analytics: flowRepositories.analytics },
};
