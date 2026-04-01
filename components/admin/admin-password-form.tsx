"use client";

import { useCallback, useState } from "react";
import { ChevronDown, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminPasswordForm(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const collapse = useCallback(() => {
    setOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setError(null);
    setOk(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setOk(false);
      if (newPassword !== confirm) {
        setError("Les deux nouveaux mots de passe ne correspondent pas.");
        return;
      }
      if (newPassword.length < 8) {
        setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/admin/auth/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Échec du changement");
          return;
        }
        setOk(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      } catch {
        setError("Erreur réseau");
      } finally {
        setLoading(false);
      }
    },
    [confirm, currentPassword, newPassword]
  );

  return (
    <div className="overflow-hidden rounded-2xl bg-surface neon-border">
      <button
        type="button"
        onClick={() => (open ? collapse() : setOpen(true))}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-raised/40"
      >
        <span className="flex min-w-0 items-center gap-2">
          <KeyRound size={16} className="shrink-0 text-accent" aria-hidden />
          <span className="font-display text-sm tracking-wide text-foreground">Mot de passe</span>
        </span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-foreground-muted transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-accent/10 px-4 pb-4 pt-3">
          <p className="text-2xs leading-relaxed text-foreground-muted">
            Enregistré dans le stockage KV (prod) ou{" "}
            <code className="text-foreground-muted/80">data/admin-password-override.json</code> (dev) — prioritaire sur{" "}
            <code className="text-foreground-muted/80">ADMIN_PASSWORD</code> dans l’env.
          </p>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <label className="block space-y-0.5">
              <span className="text-2xs font-semibold text-foreground-muted">Mot de passe actuel</span>
              <Input
                type="password"
                name="current-password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>
            <label className="block space-y-0.5">
              <span className="text-2xs font-semibold text-foreground-muted">Nouveau (min. 8 caractères)</span>
              <Input
                type="password"
                name="new-password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <label className="block space-y-0.5">
              <span className="text-2xs font-semibold text-foreground-muted">Confirmer</span>
              <Input
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </label>
            {error && (
              <p className="text-xs font-semibold text-red-400" role="alert">
                {error}
              </p>
            )}
            {ok && (
              <p className="text-xs font-semibold text-accent" role="status">
                Mot de passe mis à jour.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
              {loading ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
