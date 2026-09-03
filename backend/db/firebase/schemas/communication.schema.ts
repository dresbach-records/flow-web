export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'DELETED' | 'FAILED';
export type CallType = 'AUDIO' | 'VIDEO';
export type CallStatus = 'RINGING' | 'ACTIVE' | 'ENDED' | 'MISSED' | 'DECLINED' | 'FAILED';

export interface ConversationSchema {
  id: string;
  type: 'DIRECT' | 'GROUP';
  participantIds: string[];
  title?: string;
  avatarStoragePath?: string;
  lastMessageId?: string;
  lastMessageAt?: unknown;
  lastMessagePreview?: string;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface MessageSchema {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  text?: string;
  storagePath?: string;
  mimeType?: string;
  sizeBytes?: number;
  durationMs?: number;
  replyToMessageId?: string;
  status: MessageStatus;
  deletedAt?: unknown;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface MessageReadSchema {
  id: string;
  conversationId: string;
  userId: string;
  lastReadMessageId?: string;
  lastReadAt: unknown;
}

export interface CallSchema {
  id: string;
  conversationId: string;
  type: CallType;
  status: CallStatus;
  initiatedBy: string;
  roomId: string;
  startedAt?: unknown;
  endedAt?: unknown;
  durationSeconds?: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CallParticipantSchema {
  id: string;
  callId: string;
  userId: string;
  role: 'INITIATOR' | 'PARTICIPANT';
  status: 'INVITED' | 'JOINED' | 'LEFT' | 'DECLINED' | 'MISSED';
  joinedAt?: unknown;
  leftAt?: unknown;
}
