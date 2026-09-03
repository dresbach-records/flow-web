/** Integration ports. Implementations must be injected from infrastructure; no production mocks. */
export interface PaymentGateway {
  createCheckout(input: { userId:string; amountCents:number; currency:string; metadata:Record<string,string> }): Promise<{id:string; status:string; url?:string}>;
  handleWebhook(rawBody:string, signature:string): Promise<{eventId:string; type:string; payload:Record<string,unknown>}>;
}

export interface IdentityStorage {
  put(input:{ ownerId:string; path:string; bytes:Buffer; contentType:string }): Promise<{path:string; url:string}>;
  delete(input:{ ownerId:string; path:string }): Promise<void>;
}

export interface ModerationProvider {
  classify(input:{ text?:string; mediaUrls?:string[]; category:'content'|'product'|'ad' }): Promise<{risk:number; labels:string[]; provider:string; providerRequestId?:string}>;
}

export interface RealtimeCallGateway {
  createSession(input:{callId:string; initiatorId:string; participantIds:string[]; media:'audio'|'video'}): Promise<{sessionId:string; token:string}>;
  closeSession(input:{sessionId:string}): Promise<void>;
}

export interface JobScheduler {
  enqueue(input:{name:string; payload:Record<string,unknown>; runAt?:Date}): Promise<{jobId:string}>;
}

export interface AntiFraudEngine {
  evaluate(input:{userId:string; operation:string; amountCents?:number; metadata?:Record<string,unknown>}): Promise<{decision:'ALLOW'|'REVIEW'|'BLOCK'; score:number; reasons:string[]}>;
}
