import { promises as fs } from "fs";
import path from "path";

import { getRedis } from "@/lib/redis";

const REDIS_KEY = "app:admin:password:v1";
const DEV_FILE = path.join(process.cwd(), "data", "admin-password-override.json");

type OverrideFile = { password: string };

async function readDevOverride(): Promise<string | null> {
  try {
    const raw = await fs.readFile(DEV_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || !("password" in parsed)) return null;
    const p = (parsed as OverrideFile).password;
    return typeof p === "string" && p.length > 0 ? p : null;
  } catch {
    return null;
  }
}

async function writeDevOverride(password: string): Promise<void> {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  const payload: OverrideFile = { password };
  await fs.writeFile(DEV_FILE, JSON.stringify(payload), "utf-8");
}

/** Mot de passe surchargé (KV ou fichier dev). `null` = utiliser uniquement l’env. */
export async function getStoredAdminPassword(): Promise<string | null> {
  const r = getRedis();
  if (r) {
    const raw = await r.get<string>(REDIS_KEY);
    if (raw === null || raw === undefined) return null;
    const s = typeof raw === "string" ? raw.trim() : String(raw).trim();
    return s.length > 0 ? s : null;
  }

  if (process.env.NODE_ENV === "development") {
    return readDevOverride();
  }

  return null;
}

/**
 * Mot de passe effectif pour la connexion : stockage persistant si présent, sinon `envPassword`.
 */
export async function getEffectiveAdminPassword(envPassword: string): Promise<string> {
  const stored = await getStoredAdminPassword();
  if (stored !== null) return stored;
  return envPassword;
}

export async function setStoredAdminPassword(password: string): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(REDIS_KEY, password);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    await writeDevOverride(password);
    return;
  }
  throw new Error("Aucune persistance (KV ou dev) pour enregistrer le mot de passe.");
}
