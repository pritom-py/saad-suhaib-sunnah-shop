import React from "react";
import Link from "next/link";
import { searchProducts, getCategories } from "@/services/storefront.service";
import { ProductCard } from "@/components/storefront/ProductCard";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { SlidersHorizontal, Search, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const products = await searchProducts({
    q: params.q,
    category: params.category,
    sort: params.sort,
    minPrice,
    maxPrice,
  });

  return (
    <div className="page-ivory min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title & Breadcrumb */}
        <div className="text-center">
          <IslamicDivider title="আমাদের সকল ইসলামি পণ্য" />
          <p className="text-xs md:text-sm font-bengali text-text-secondary mt-1">
            সুন্নাহসম্মত টুপি, পাগড়ি, রুমাল, ডিজিটাল তসবিহ ও কোরআনের গিলাফের বিশ্বস্ত অনলাইন সম্ভার
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="premium-card p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-bengali">
          {/* Category Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <Link
              href="/shop"
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                !params.category
                  ? "bg-[#063D2B] text-ivory shadow-sm"
                  : "bg-cream text-text-primary hover:bg-[#E5D9BD]"
              }`}
            >
              সকল পণ্য
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  params.category === cat.slug
                    ? "bg-[#063D2B] text-ivory shadow-sm"
                    : "bg-cream text-text-primary hover:bg-[#E5D9BD]"
                }`}
              >
                {cat.nameBn} ({cat._count.products})
              </Link>
            ))}
          </div>

          {/* Result Count & Reset */}
          <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-between md:justify-end">
            <span className="text-text-secondary font-medium">
              মোট <strong className="text-primary font-bold">{products.length}</strong> টি পণ্য পাওয়া গেছে
            </span>
            {(params.q || params.category || params.sort) && (
              <Link
                href="/shop"
                className="flex items-center gap-1 text-maroon hover:underline font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট</span>
              </Link>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="premium-card rounded-2xl p-12 text-center space-y-4 font-bengali">
            <div className="w-16 h-16 rounded-full bg-cream text-primary flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              কোনো পণ্য পাওয়া যায়নি
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              আপনার অনুসন্ধান অনুযায়ী কোনো পণ্য খুঁজে পাওয়া যায়নি। দয়া করে ক্যাটাগরি পরিবর্তন করুন অথবা সঠিক বানান লিখুন।
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 rounded-lg btn-emerald text-xs transition-colors"
            >
              সকল পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
