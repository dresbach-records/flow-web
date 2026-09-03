import { Router, type Response } from 'express';
import { FlowModuleService, flowCollections } from '../modules/flow-module.service.js';
import { requireAuth, requireAdmin } from '../middleware/firebase-auth.js';
import { registerUser, loginUser, logoutUser } from '../services/firebase-auth.service.js';
const r=Router(); const svc=new FlowModuleService();
const publicCollections=new Set(['posts','videos','shorts','stories','lives','communities','community_posts','products','categories','shops','ads','hashtags']);
const adminOnly=new Set(['users','admin_users','roles','permissions','wallet_ledger','payments','audit_logs','platform_settings']);
function err(res:Response,e:unknown){const code=e instanceof Error?e.message:'INTERNAL_ERROR';const map:Record<string,number>={FORBIDDEN:403,NOT_FOUND:404,VALIDATION_ERROR:400};res.status(map[code]??500).json({error:code});}
r.post('/auth/register',async(req,res)=>{try{const {email,password,...profile}=req.body;if(typeof email!=='string'||typeof password!=='string'||password.length<8)return res.status(400).json({error:'VALIDATION_ERROR'});res.status(201).json(await registerUser(email,password,profile));}catch(e){err(res,e);}});
r.post('/auth/login',async(req,res)=>{try{const {email,password}=req.body;if(typeof email!=='string'||typeof password!=='string')return res.status(400).json({error:'VALIDATION_ERROR'});res.json(await loginUser(email,password));}catch{res.status(401).json({error:'INVALID_CREDENTIALS'});}});
r.post('/auth/logout',requireAuth,async(req,res)=>{try{res.json(await logoutUser(req.header('authorization')!.slice(7)));}catch(e){err(res,e);}});
r.get('/auth/me',requireAuth,(req,res)=>res.json({uid:req.actor!.uid,admin:req.actor!.admin,permissions:req.actor!.permissions}));
r.get('/health',(_req,res)=>res.json({status:'ok',service:'flow-api',database:'firebase'}));
for(const collection of flowCollections){const base=`/${collection}`;
 r.get(base,publicCollections.has(collection)?undefined:requireAuth,async(req,res)=>{try{res.json(await svc.list(collection,Number(req.query.limit)||25,req.query.cursor as string|undefined));}catch(e){err(res,e);}});
 r.get(`${base}/:id`,publicCollections.has(collection)?undefined:requireAuth,async(req,res)=>{try{const item=await svc.get(collection,req.params.id);if(!item)return res.status(404).json({error:'NOT_FOUND'});res.json(item);}catch(e){err(res,e);}});
 r.post(base,requireAuth,async(req,res)=>{try{if(adminOnly.has(collection)&&!req.actor!.admin)return res.status(403).json({error:'ADMIN_REQUIRED'});const item=await svc.create(collection,req.body,req.actor!);res.status(201).json(item);}catch(e){err(res,e);}});
 r.patch(`${base}/:id`,requireAuth,async(req,res)=>{try{if(adminOnly.has(collection)&&!req.actor!.admin)return res.status(403).json({error:'ADMIN_REQUIRED'});const item=await svc.update(collection,req.params.id,req.body,req.actor!);if(!item)return res.status(404).json({error:'NOT_FOUND'});res.json(item);}catch(e){err(res,e);}});
 r.delete(`${base}/:id`,requireAuth,async(req,res)=>{try{if(adminOnly.has(collection)&&!req.actor!.admin)return res.status(403).json({error:'ADMIN_REQUIRED'});const ok=await svc.remove(collection,req.params.id,req.actor!);if(!ok)return res.status(404).json({error:'NOT_FOUND'});res.status(204).send();}catch(e){err(res,e);}});
}
r.get('/admin/me',requireAuth,requireAdmin,(req,res)=>res.json({uid:req.actor!.uid,admin:true,permissions:req.actor!.permissions}));
export default r;
