import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

/** Logger estruturado mínimo com request-id (método, rota, status, ms). Sem dependências. */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const started = Date.now();
  const requestId = (req.headers['x-request-id'] as string | undefined) || randomUUID();
  res.setHeader('x-request-id', requestId);
  res.on('finish', () => {
    const ms = Date.now() - started;
    const line = JSON.stringify({
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms,
    });
    if (res.statusCode >= 500) console.error(line);
    else console.log(line);
  });
  next();
}
