import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

/** Protege endpoints acionados por Vercel Cron. */
export function verifyCron(req: Request, res: Response, next: NextFunction): void {
  const secret = env.CRON_SECRET;
  const vercelCron = req.headers['x-vercel-cron'];
  const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';

  const ok = (secret && vercelCron === secret) || (secret && bearer === secret);
  if (!ok) {
    res.status(403).json({ error: 'FORBIDDEN' });
    return;
  }
  next();
}