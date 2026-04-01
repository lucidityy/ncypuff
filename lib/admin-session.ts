import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "app_admin_session";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function signAdminSession(secret: string): string {
  const exp = Date.now() + MAX_AGE_MS;
  const expStr = String(exp);
  const sig = createHmac("sha256", secret).update(expStr).digest("hex");
  return `${expStr}.${sig}`;
}

export function verifyAdminSession(token: string, secret: string): boolean {
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = createHmac("sha256", secret).update(expStr).digest("hex");
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
