import { Router, type Request, type Response } from 'express';
import { FlowModuleService, flowCollections } from '../modules/flow-module.service.js';
import { requireAuth, requireAdmin } from '../middleware/firebase-auth.js';

const r=Router(); const svc=new FlowModuleService();
const publicCollections=new Set(['posts','videos','shorts','stories','lives','communities','community_posts','products','categories','shops','ads','hashtags']);
const writableAdminOnly=new Set(['users','admin_users','roles','permissions','wallet_ledger','payments','audit_logs']);
const singular=(s:string)=>s.endsWith('s')?s.slice(0,-1):s;

function err(res:Response,e:unknown){ const code=e instanceof Error?e.message:'INTERNAL_ERROR'; const map:Record<string,number>={FORBIDDEN:403,NOT_FOUND:404,VALIDATION_ERROR:400}; return res.status(map[code]??500).json({error:code}); }

r.get('/health',(_q,res)=>res.json({status:'ok',service:'flow-api',database:'firebase'}));

for(const collection of flowCollections){
  const base=`/${collection}`;
  if(publicCollections.has(collection)) r.get(base,async(req,res)=>{try{res.json(await svc.list(collection,Number(req.query.limit)||25,req.query.cursor as string|undefined));}catch(e){err(res,e);}});
  else r.get(base,requireAuth,async(req,res)=>{try{res.json(await svc.list(collection,Number(req.query.limit)||25,req.query.cursor as string|undefined));}catch(e){err(res,e);}});

  r.get(`${base}/:id`, publicCollections.has(collection)?undefined:requireAuth, async(req,res)=>{try{const item=await svc.get(collection,req.params.id); if(!item)return res.status(404).json({error:'NOT_FOUND'}); res.json(item);}catch(e){err(res,e);}});

  if(!writableAdminOnly.has(collection)) r.post(base,requireAuth,async(req,res)=>{try{const item=await svc.create(collection,req.body,req.actor!); await svc.audit(req.actor!,'CREATE',collection,String((item as any)?.id)); res.status(201).json(item);}catch(e){err(res,e);}});
  else r.post(base,requireAuth,requireAdmin,async(req,res)=>{try{const item=await svc.create(collection,req.body,req.actor!); await svc.audit(req.actor!,'CREATE',collection,String((item as any)?.id)); res.status(201).json(item);}catch(e){err(res,e);}});

  r.patch(`${base}/:id`,requireAuth,async(req,res)=>{try{if(writableAdminOnly.has(collection)&&!req.actor!.admin)return res.status(403).json({error:'ADMIN_REQUIRED'}); const item=await svc.update(collection,req.params.id,req.body,req.actor!); if(!item)return res.status(404).json({error:'NOT_FOUND'}); await svc.audit(req.actor!,'UPDATE',collection,req.params.id); res.json(item);}catch(e){err(res,e);}});
  r.delete(`${base}/:id`,requireAuth,async(req,res)=>{try{if(writableAdminOnly.has(collection)&&!req.actor!.admin)return res.status(403).json({error:'ADMIN_REQUIRED'}); const ok=await svc.remove(collection,req.params.id,req.actor!); if(!ok)return res.status(404).json({error:'NOT_FOUND'}); await svc.audit(req.actor!,'DELETE',collection,req.params.id); res.status(204).send();}catch(e){err(res,e);}});
}

r.post('/admin/auth/claims-sync',requireAuth,requireAdmin,async(req,res)=>{try{await svc.audit(req.actor!,'CLAIMS_SYNC','admin_users',req.actor!.uid);res.json({ok:true,uid:req.actor!.uid});}catch(e){err(res,e);}});
r.get('/admin/me',requireAuth,requireAdmin,(req,res)=>res.json({uid:req.actor!.uid,admin:true,permissions:req.actor!.permissions}));

export default r;
