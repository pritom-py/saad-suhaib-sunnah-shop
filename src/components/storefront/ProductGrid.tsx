import React from "react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export function ProductGrid({ products, className = "" }: { products: ProductCardProps["product"][]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-[clamp(11px,1.3vw,20px)] ${className}`}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
