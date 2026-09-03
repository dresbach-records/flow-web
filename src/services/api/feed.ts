import { apiRequest } from './client';
export type FeedPost={id:string;author:{username:string;displayName:string;avatarUrl?:string};text?:string;mediaUrl?:string;likes:number;comments:number;liked?:boolean};
export const feedApi={list:(following=false)=>apiRequest<FeedPost[]>({path:`/api/v1/feed${following?'?following=true':''}`}),create:(body:unknown)=>apiRequest<FeedPost>({path:'/api/v1/posts',method:'POST',body}),like:(id:string)=>apiRequest<void>({path:`/api/v1/posts/${id}/like`,method:'POST'}),unlike:(id:string)=>apiRequest<void>({path:`/api/v1/posts/${id}/like`,method:'DELETE'})};
