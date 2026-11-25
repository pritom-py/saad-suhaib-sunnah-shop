import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/services/storefront.service";
import { ProductCard } from "@/components/storefront/ProductCard";
import { PageBanner } from "@/components/storefront/PageBanner";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-ivory min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-2 text-xs font-bengali text-text-secondary">
          <Link href="/" className="hover:text-primary">
            হোম
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">
            সব পণ্য
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">{category.nameBn}</span>
        </div>

        <PageBanner eyebrow="ক্যাটাগরি" title={category.nameBn} description={category.descriptionBn} />

        <IslamicDivider title={`${category.nameBn} কালেকশন`} />

        {/* Product Grid */}
        {category.products.length === 0 ? (
          <div className="premium-card rounded-2xl p-12 text-center space-y-4 font-bengali">
            <p className="text-sm text-text-secondary">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য প্রদর্শনের জন্য উপলব্ধ নেই।
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-ivory text-xs font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>অন্যান্য পণ্য দেখুন</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
