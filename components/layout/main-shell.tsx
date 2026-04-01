"use client";

import type { ReactNode } from "react";

export function MainShell({ children }: { children: ReactNode }): JSX.Element {
  return (
    <main className="relative z-10 mx-auto w-full max-w-md px-4 pt-2 pb-24">
      {children}
    </main>
  );
}
