import type { Timestamp } from 'firebase-admin/firestore';
export interface User { id:string; authUid:string; handle:string; displayName:string; email:string; cpf?:string; phone?:string; birthDate?:Timestamp; role:'USER'|'CREATOR'|'SELLER'|'MODERATOR'|'ADMIN'; status:string; emailVerified:boolean; identityVerified:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Profile { id:string; userId:string; bio?:string; avatarPath?:string; coverPath?:string; currentCity?:string; hometown?:string; relationshipStatus?:string; privacy:Record<string,'public'|'private'>; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Verification { id:string; userId:string; type:'EMAIL'|'PHONE'|'IDENTITY'|'BUSINESS'; status:string; verifiedAt?:Timestamp; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Session { id:string; userId:string; authUid:string; deviceId?:string; expiresAt:Timestamp; revokedAt?:Timestamp; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Device { id:string; userId:string; fingerprint:string; platform:string; pushToken?:string; lastSeenAt:Timestamp; revoked:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Block { id:string; userId:string; blockedUserId:string; reason?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AccountSecurity { id:string; userId:string; failedLogins:number; riskLevel:'LOW'|'MEDIUM'|'HIGH'; mfaEnabled:boolean; lastLoginAt?:Timestamp; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Business { id:string; ownerId:string; cnpj:string; legalName:string; tradeName?:string; verified:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface SocialLink { id:string; userId:string; platform:string; url:string; privacy:'public'|'private'; createdAt:Timestamp; updatedAt:Timestamp; }
