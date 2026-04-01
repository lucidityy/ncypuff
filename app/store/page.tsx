import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, MessageSquareText, Info, ShieldCheck, Settings } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { StoreInfoCard } from "@/components/shared/store-info-card";
import { Button } from "@/components/ui/button";
import { BRAND, CONTACT_LINKS } from "@/lib/constants";

export default function StorePage(): JSX.Element {
  return (
    <div className="space-y-5 pt-4">
      <SectionTitle title="Notre boutique" subtitle="À propos" />

      {/* Logo sticker */}
      <div className="flex justify-center">
        <Image
          src={BRAND.sticker}
          alt={BRAND.fullName}
          width={200}
          height={200}
          className="rounded-3xl shadow-glow-lg"
        />
      </div>

      <div className="rounded-2xl bg-surface neon-border">
        <StoreInfoCard
          icon={Info}
          title="À propos"
          description="Bienvenue dans notre boutique. Nous proposons des produits de qualité avec un service client réactif."
        />
        <StoreInfoCard
          icon={MapPin}
          title="Zone de livraison"
          description="Consultez nos zones de livraison disponibles."
        />
        <StoreInfoCard
          icon={Clock3}
          title="Horaires"
          description="Les horaires sont indiqués sur notre canal."
        />
        <StoreInfoCard
          icon={ShieldCheck}
          title="Qualité premium"
          description="Tous nos produits sont soigneusement sélectionnés pour garantir la meilleure qualité."
        />
      </div>

      <div className="space-y-3">
        <SectionTitle title="Contact" />
        <div className="flex items-center gap-2 rounded-t-2xl bg-surface px-4 py-3 neon-border">
          <MessageSquareText className="h-5 w-5 text-accent" strokeWidth={1.8} />
          <span className="text-sm font-bold text-foreground-muted">Contacte-nous !</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button asChild>
            <a href={CONTACT_LINKS.whatsapp} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={CONTACT_LINKS.signal} target="_blank" rel="noreferrer">🔐 Signal</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={CONTACT_LINKS.snapchat} target="_blank" rel="noreferrer">👻 Snapchat</a>
          </Button>
        </div>
      </div>

      {/* Accès admin discret en bas */}
      <div className="mt-12 flex justify-center pb-1">
        <Link
          href="/admin"
          aria-label="Administration"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-2xs font-semibold text-foreground-muted/45 transition-colors hover:text-accent/70 active:opacity-80"
        >
          <Settings size={12} strokeWidth={1.8} aria-hidden />
          Administration
        </Link>
      </div>
    </div>
  );
}
