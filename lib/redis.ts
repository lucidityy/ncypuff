import { Redis } from "@upstash/redis";

function getCredentials(): { url: string; token: string } | null {
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  if (!url || !token) return null;
  return { url, token };
}

/** Returns true when Redis env vars are configured. */
export function hasRedis(): boolean {
  return getCredentials() !== null;
}

let _client: Redis | null = null;

/** Returns the shared Redis client, or null if not configured. */
export function getRedis(): Redis | null {
  const creds = getCredentials();
  if (!creds) return null;
  if (!_client) _client = new Redis({ url: creds.url, token: creds.token });
  return _client;
}
