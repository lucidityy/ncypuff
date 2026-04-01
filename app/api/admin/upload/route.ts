import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/require-admin-api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
  const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format non supporté (jpg, png, webp, avif)" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image trop lourde (max 5 Mo)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : "jpg";
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur lors de l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
