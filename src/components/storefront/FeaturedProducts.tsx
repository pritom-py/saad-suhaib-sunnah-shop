import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { ProductCardProps } from "./ProductCard";
import { SectionTitle } from "./SectionTitle";

export function FeaturedProducts({ products }: { products: ProductCardProps["product"][] }) {
  if (!products.length) return null;
  const viewAll = (
    <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#710D17] hover:underline sm:text-base">
      সব পণ্য দেখুন <ArrowRight className="h-4 w-4" />
    </Link>
  );

  return (
    <section className="shell pb-6 sm:pb-8">
      <div className="relative">
        <SectionTitle title="জনপ্রিয় পণ্য" />
        <div className="absolute right-0 top-1/2 hidden -translate-y-[90%] lg:block">{viewAll}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-6 xl:gap-4">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="reveal-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-4 text-center lg:hidden">{viewAll}</div>
    </section>
  );
}
