import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminEnv } from "@/lib/admin-env";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";

export default async function AdminLoginPage(): Promise<JSX.Element> {
  const env = getAdminEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (env && token && verifyAdminSession(token, env.sessionSecret)) {
    redirect("/admin");
  }

  return <LoginForm configOk={!!env} />;
}
