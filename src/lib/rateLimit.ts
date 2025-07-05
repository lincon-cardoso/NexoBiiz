import { redis } from "./redisClient";

/**
 * Rate limiting using Redis. Throws error if limit exceeded.
 * @param key Unique key for rate limiting (e.g., `register:${ip}`)
 * @param limit Max operations in window (default 10)
 * @param windowSec Window duration in seconds (default 60)
 */
export async function rateLimit(
  key: string,
  limit = 10,
  windowSec = 60
): Promise<void> {
  const now = Date.now();
  const zkey = `rl:${key}`;
  const windowMs = windowSec * 1000;
  // Insere timestamp atual no sorted set (score e member como strings)
  const nowStr = now.toString();
  await redis.zadd(zkey, nowStr, nowStr);
  // Remove registros fora da janela
  await redis.zremrangebyscore(zkey, 0, now - windowMs);
  // Conta requisições na janela
  const count = await redis.zcard(zkey);
  if (count > limit) {
    // rate limit excedido
    throw new Error("RATE_LIMITED");
  }
  // Define expiração da chave para limpeza automática
  await redis.expire(zkey, windowSec);
}
