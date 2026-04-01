export type AdminEnv = {
  username: string;
  password: string;
  sessionSecret: string;
};

let cached: AdminEnv | undefined;

/**
 * Returns null if admin auth is not configured (missing password or secret).
 * Only successful parses are cached so a transient miss (or env added after first call) is not stuck until process restart.
 */
export function getAdminEnv(): AdminEnv | null {
  if (cached !== undefined) return cached;

  const username = (process.env.ADMIN_USERNAME?.trim() || "Admin") as string;
  const password = (process.env.ADMIN_PASSWORD ?? "").trim();
  const sessionSecret = (process.env.ADMIN_SESSION_SECRET ?? "").trim();

  if (password.length < 1 || sessionSecret.length < 16) {
    return null;
  }

  cached = { username, password, sessionSecret };
  return cached;
}
