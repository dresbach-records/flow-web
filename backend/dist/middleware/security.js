import { randomUUID } from 'node:crypto';
const buckets = new Map();
export function requestContext(req, res, next) {
    const requestId = req.header('x-request-id') || randomUUID();
    res.setHeader('x-request-id', requestId);
    res.locals.requestId = requestId;
    next();
}
export function rateLimit(limit = 120, windowMs = 60_000) {
    return (req, res, next) => {
        const key = `${req.ip}:${req.path}`;
        const now = Date.now();
        const current = buckets.get(key);
        const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
        bucket.count += 1;
        buckets.set(key, bucket);
        res.setHeader('x-ratelimit-limit', limit);
        res.setHeader('x-ratelimit-remaining', Math.max(0, limit - bucket.count));
        if (bucket.count > limit)
            return res.status(429).json({ error: 'RATE_LIMITED', requestId: res.locals.requestId });
        next();
    };
}
export function errorHandler(error, req, res, _next) {
    console.error(JSON.stringify({ level: 'error', requestId: res.locals.requestId, method: req.method, path: req.path, error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' }));
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', requestId: res.locals.requestId });
}
