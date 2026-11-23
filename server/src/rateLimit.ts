import type { RequestHandler } from 'express';
import { TokenBucket } from './shared/rateLimit.js';

/** One token bucket per IP. Protects the free AI quota from abuse. */
export function rateLimit(perMinute: number, now: () => number = Date.now): RequestHandler {
  const buckets = new Map<string, TokenBucket>();
  return (req, res, next) => {
    const key = req.ip ?? 'unknown';
    let bucket = buckets.get(key);
    if (!bucket) buckets.set(key, (bucket = new TokenBucket(perMinute, perMinute, now)));
    if (!bucket.tryTake()) {
      res.status(429).set('Retry-After', '10').json({ error: 'Too many requests, slow down.' });
      return;
    }
    next();
  };
}
