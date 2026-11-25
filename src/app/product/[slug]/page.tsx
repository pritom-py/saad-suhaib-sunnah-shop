import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getCategoryBySlug, getBusinessSettings } from "@/services/storefront.service";
import { ProductView } from "@/components/storefront/ProductView";
import { ProductCard } from "@/components/storefront/ProductCard";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [categoryData, settings] = await Promise.all([
    getCategoryBySlug(product.category.slug),
    getBusinessSettings(),
  ]);

  const relatedProducts = (categoryData?.products || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="page-ivory min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bengali text-text-secondary">
          <Link href="/" className="hover:text-primary">
            হোম
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
            {product.category.nameBn}
          </Link>
          <span>/</span>
          <span className="text-primary font-bold truncate max-w-xs">{product.nameBn}</span>
        </div>

        {/* Product Interactive View */}
        <ProductView
          product={product}
          whatsappUrl={settings?.whatsappUrl || "https://wa.me/8801749160444"}
          phone={settings?.phoneSupport}
          delivery={settings ? { inside: settings.insideDhakaRate, outside: settings.outsideDhakaRate } : undefined}
          key={product.id}
        />

        {/* Full Product Description & Specifications */}
        <div className="premium-card rounded-2xl p-6 md:p-8 shadow-sm space-y-4 font-bengali">
          <h2 className="text-xl font-bold text-primary border-b border-[#E5D9BD] pb-3">
            পণ্যের পূর্ণ বিবরণ ও বৈশিষ্ট্য
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            <p>{product.descBn || product.shortDescBn || "খাঁটি সুন্নাহসম্মত ও উৎকৃষ্ট ইসলামি সামগ্রী।"}</p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <IslamicDivider title="সম্পর্কিত পণ্যসমূহ" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
