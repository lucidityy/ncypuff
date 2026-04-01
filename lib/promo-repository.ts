import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

import { PROMO_CODES_SEED } from "@/data/promo-codes-seed";
import type { PromoCodeRecord } from "@/types/promo";

const REDIS_KEY = "app:promo-codes:v1";
const DEV_FILE = path.join(process.cwd(), "data", "promo-codes-store.json");

let redis: Redis | null = null;

function getRedisCredentials(): { url: string; token: string } | null {
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  if (!url || !token) return null;
  return { url, token };
}

function getRedis(): Redis | null {
  const creds = getRedisCredentials();
  if (!creds) return null;
  if (!redis) redis = new Redis({ url: creds.url, token: creds.token });
  return redis;
}

async function readDevFile(): Promise<PromoCodeRecord[] | null> {
  try {
    const raw = await fs.readFile(DEV_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as PromoCodeRecord[];
  } catch {
    return null;
  }
}

async function writeDevFile(records: PromoCodeRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export async function getPromoCodes(): Promise<PromoCodeRecord[]> {
  const r = getRedis();
  if (r) {
    const raw = await r.get<string>(REDIS_KEY);
    if (raw !== null && raw !== undefined) {
      try {
        const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (Array.isArray(arr)) return arr as PromoCodeRecord[];
      } catch {
        /* fall through: re-init */
      }
    }
    await r.set(REDIS_KEY, JSON.stringify(PROMO_CODES_SEED));
    return [...PROMO_CODES_SEED];
  }

  if (process.env.NODE_ENV === "development") {
    const fromFile = await readDevFile();
    if (fromFile !== null) return fromFile;
  }

  return [...PROMO_CODES_SEED];
}

export async function savePromoCodes(records: PromoCodeRecord[]): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(REDIS_KEY, JSON.stringify(records));
    return;
  }
  if (process.env.NODE_ENV === "development") {
    await writeDevFile(records);
    return;
  }
  throw new Error("No persistence available — configure KV or run in development");
}
