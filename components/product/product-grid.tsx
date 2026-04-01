import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  onOrder?: () => void;
}

export function ProductGrid({ products, onOrder }: ProductGridProps): JSX.Element {
  return (
    <div className="space-y-5">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} onOrder={onOrder} />
      ))}
    </div>
  );
}
