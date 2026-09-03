import type { NextFunction, Request, Response } from 'express';
import { firebaseAuth } from '../infrastructure/firebase/firebase-admin.js';

declare global { namespace Express { interface Request { actor?: { uid:string; admin:boolean; permissions:string[] } } } }

export async function requireAuth(req:Request,res:Response,next:NextFunction){
  try {
    const h=req.header('authorization'); if(!h?.startsWith('Bearer ')) return res.status(401).json({error:'UNAUTHORIZED'});
    const token=await firebaseAuth().verifyIdToken(h.slice(7),true);
    req.actor={uid:token.uid,admin:token.admin===true,permissions:Array.isArray(token.permissions)?token.permissions as string[]:[]}; next();
  } catch { res.status(401).json({error:'INVALID_TOKEN'}); }
}

export function requireAdmin(req:Request,res:Response,next:NextFunction){ if(!req.actor?.admin) return res.status(403).json({error:'ADMIN_REQUIRED'}); next(); }
export function requirePermission(permission:string){ return (req:Request,res:Response,next:NextFunction)=>{ if(req.actor?.admin && (req.actor.permissions.includes('*') || req.actor.permissions.includes(permission))) return next(); res.status(403).json({error:'PERMISSION_DENIED'}); }; }
