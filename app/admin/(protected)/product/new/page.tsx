"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { SectionTitle } from "@/components/shared/section-title";

export default function NewProductPage(): JSX.Element {
  const router = useRouter();

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Erreur ${res.status}`);
    }
    router.push("/admin");
  }, [router]);

  return (
    <div className="space-y-4 px-4 pt-4 pb-24">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <SectionTitle title="Nouveau produit" />
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
