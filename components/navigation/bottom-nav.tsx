"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Phone, Store } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/catalog", label: "Menu", icon: Search },
  { href: "/commander", label: "Commander", icon: Phone },
  { href: "/store", label: "Infos", icon: Store }
] as const;

export function BottomNav(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 glass border-t border-accent/10"
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isOrder = href === "/commander";
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
                  className={`transition-all duration-200 ${
                    isOrder
                      ? "text-accent drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : active
                        ? "text-accent drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                        : "text-foreground-muted"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`text-[10px] font-bold ${
                  isOrder
                    ? "text-accent"
                    : active
                      ? "text-accent"
                      : "text-foreground-muted"
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
