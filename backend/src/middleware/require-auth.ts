import type { NextFunction, Request, Response } from 'express';
import { firebaseAuth, firestore } from '../infrastructure/firebase/firebase-admin.js';

export interface AuthedRequest extends Request {
  uid?: string;
  role?: string;
}

/** Autenticação real via Firebase ID Token (Authorization: Bearer). */
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'UNAUTHENTICATED' });
    return;
  }
  try {
    const decoded = await firebaseAuth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

/** Autorização admin real (papel no perfil Firestore). */
export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    try {
      const snap = await firestore().collection('users').doc(req.uid as string).get();
      const role = snap.data()?.role;
      if (role !== 'admin') {
        res.status(403).json({ error: 'FORBIDDEN' });
        return;
      }
      req.role = role;
      next();
    } catch {
      res.status(403).json({ error: 'FORBIDDEN' });
    }
  });
}
