"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminToolbar(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="sticky top-0 z-30 flex justify-end border-b border-border/40 bg-background/90 px-4 py-2 backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={logout}
        disabled={loading}
        className="gap-2 text-foreground-muted hover:text-foreground"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Déconnexion
      </Button>
    </div>
  );
}
