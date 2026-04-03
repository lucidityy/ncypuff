import { promises as fs } from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/require-admin-api";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format non supporté (jpg, png, webp, avif)" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image trop lourde (max 5 Mo)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : "jpg";
  const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Dev: save locally to /public/uploads/
  if (process.env.NODE_ENV === "development" || !process.env.BLOB_READ_WRITE_TOKEN) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, slug), buffer);
    return NextResponse.json({ url: `/uploads/${slug}` });
  }

  // Prod: use Vercel Blob
  const { put } = await import("@vercel/blob");
  try {
    const blob = await put(`products/${slug}`, file, { access: "public", addRandomSuffix: false });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur lors de l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
