import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { getAdminEnv } from "@/lib/admin-env";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";

export default async function ProtectedAdminLayout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const env = getAdminEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!env || !token || !verifyAdminSession(token, env.sessionSecret)) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminToolbar />
      {children}
    </>
  );
}
