/**
 * Token bucket rate limiter: `capacity` requests, refilled at `refillPerMinute`.
 * The server uses the same idea per IP to protect the (free-tier) AI API quota.
 */
export class TokenBucket {
  private tokens: number;
  private last: number;

  constructor(private capacity: number, private refillPerMinute: number, private now: () => number = Date.now) {
    this.tokens = capacity;
    this.last = now();
  }

  private refill() {
    const t = this.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((t - this.last) / 60000) * this.refillPerMinute);
    this.last = t;
  }

  tryTake(): boolean {
    this.refill();
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }

  remaining(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}
