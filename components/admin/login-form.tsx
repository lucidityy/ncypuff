"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  configOk: boolean;
};

export function LoginForm({ configOk }: Props): JSX.Element {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!configOk) return;
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "Connexion impossible");
          return;
        }
        router.push("/admin");
        router.refresh();
      } finally {
        setLoading(false);
      }
    },
    [configOk, username, password, router]
  );

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center space-y-6 px-4 pt-8 pb-24">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface neon-border">
          <Lock className="h-7 w-7 text-accent" />
        </div>
        <h1 className="font-display text-xl tracking-wide text-foreground">Administration</h1>
        <p className="text-sm text-foreground-muted">Identifiant et mot de passe requis</p>
      </div>

      {!configOk && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
          Variables manquantes : définis <code className="text-xs">ADMIN_PASSWORD</code> et{" "}
          <code className="text-xs">ADMIN_SESSION_SECRET</code> (≥ 16 caractères) dans{" "}
          <code className="text-xs">.env.local</code>.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-surface p-5 neon-border">
        <div className="space-y-1.5">
          <label htmlFor="admin-user" className="text-xs font-semibold text-foreground-muted">
            Identifiant
          </label>
          <Input
            id="admin-user"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border-border bg-background"
            disabled={!configOk || loading}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-pass" className="text-xs font-semibold text-foreground-muted">
            Mot de passe
          </label>
          <Input
            id="admin-pass"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border-border bg-background"
            disabled={!configOk || loading}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={!configOk || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion…
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </div>
  );
}
