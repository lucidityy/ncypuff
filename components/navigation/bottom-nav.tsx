"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Percent, Store } from "lucide-react";

import { useCart } from "@/hooks/useCart";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/catalog", label: "Catalogue", icon: Search },
  { href: "/offers", label: "Promos", icon: Percent },
  { href: "/cart", label: "Panier", icon: ShoppingBag },
  { href: "/store", label: "Infos", icon: Store }
] as const;

export function BottomNav(): JSX.Element {
  const pathname = usePathname();
  const { totalItems: itemCount } = useCart();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 glass border-t border-accent/10"
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 py-2.5 transition-all duration-200"
            >
              <span className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 1.6}
                  className={`transition-all duration-200 ${active ? "text-accent drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" : "text-foreground-muted"}`}
                  aria-hidden="true"
                />
                {label === "Panier" && itemCount > 0 && (
                  <span
                    title="Articles dans le panier"
                    className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold leading-none text-background shadow-neon"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  active ? "text-accent" : "text-foreground-muted"
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-accent shadow-neon" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
