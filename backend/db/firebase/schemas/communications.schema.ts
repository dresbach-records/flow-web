import type { Timestamp } from 'firebase-admin/firestore';
export interface Conversation { id:string; participantIds:string[]; type:'DIRECT'|'GROUP'; lastMessageId?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Message { id:string; conversationId:string; senderId:string; type:'TEXT'|'IMAGE'|'VIDEO'|'AUDIO'|'FILE'|'SYSTEM'; text?:string; storagePath?:string; replyToId?:string; deliveredAt?:Timestamp; readAt?:Timestamp; deletedAt?:Timestamp; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Call { id:string; conversationId:string; callerId:string; type:'AUDIO'|'VIDEO'; status:'RINGING'|'ACTIVE'|'ENDED'|'MISSED'|'DECLINED'|'FAILED'; roomId:string; startedAt?:Timestamp; endedAt?:Timestamp; durationMs?:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface CallParticipant { id:string; callId:string; userId:string; status:'INVITED'|'JOINED'|'LEFT'|'DECLINED'; joinedAt?:Timestamp; leftAt?:Timestamp; createdAt:Timestamp; updatedAt:Timestamp; }
