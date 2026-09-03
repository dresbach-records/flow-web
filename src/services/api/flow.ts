import { apiRequest } from './client';

export type Page<T=unknown>={items:T[];nextCursor:string|null};
export type FlowRecord={id:string;ownerId?:string;status?:string;createdAt?:unknown;updatedAt?:unknown;[key:string]:unknown};

export const flowApi={
  list:<T=FlowRecord>(collection:string,limit=25,cursor?:string)=>apiRequest<Page<T>>({path:`/api/v1/${collection}?limit=${limit}${cursor?`&cursor=${encodeURIComponent(cursor)}`:''}`}),
  get:<T=FlowRecord>(collection:string,id:string)=>apiRequest<T>({path:`/api/v1/${collection}/${id}`}),
  create:<T=FlowRecord>(collection:string,body:Record<string,unknown>)=>apiRequest<T>({path:`/api/v1/${collection}`,method:'POST',body}),
  update:<T=FlowRecord>(collection:string,id:string,body:Record<string,unknown>)=>apiRequest<T>({path:`/api/v1/${collection}/${id}`,method:'PATCH',body}),
  remove:(collection:string,id:string)=>apiRequest<void>({path:`/api/v1/${collection}/${id}`,method:'DELETE'}),
  transition:<T=FlowRecord>(collection:string,id:string,status:string)=>apiRequest<T>({path:`/api/v1/${collection}/${id}/transition`,method:'POST',body:{status}}),
  report:(targetType:string,targetId:string,reason:string,details?:string)=>apiRequest<{id:string}>({path:'/api/v1/reports',method:'POST',body:{targetType,targetId,reason,details}}),
  recoverHacked:(body:{frontPath:string;backPath:string;authorizedTermPath:string})=>apiRequest<{id:string;status:string}>({path:'/api/v1/recovery/hacked',method:'POST',body}),
  submitAd:(body:Record<string,unknown>)=>apiRequest<{id:string;status:string}>({path:'/api/v1/ads/submit',method:'POST',body}),
};
