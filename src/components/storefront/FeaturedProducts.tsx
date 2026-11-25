import React from "react";
import { SectionHeading } from "./SectionHeading";
import { ProductGrid } from "./ProductGrid";
import type { ProductCardProps } from "./ProductCard";

export function FeaturedProducts({ products }: { products: ProductCardProps["product"][] }) {
  if (!products.length) return null;
  return (
    <section className="reveal shell pt-[clamp(16px,2.2vw,38px)]">
      <SectionHeading title="জনপ্রিয় পণ্যসমূহ" />
      <ProductGrid products={products} className="mt-[clamp(8px,1vw,20px)]" />
    </section>
  );
}
