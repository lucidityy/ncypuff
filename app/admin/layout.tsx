import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}
