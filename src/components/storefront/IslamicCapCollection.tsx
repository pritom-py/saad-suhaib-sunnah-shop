import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { IslamicDivider } from "./IslamicDivider";

interface IslamicCapCollectionProps {
  products?: any[];
}

export function IslamicCapCollection({ products }: IslamicCapCollectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto bg-gradient-to-b from-[#FBF7EC]/60 to-white rounded-2xl border border-[#E5D9BD]/80 my-4 shadow-sm">
      {/* Section Title */}
      <IslamicDivider title="ইসলামি টুপির বিশেষ সংগ্রহ" />

      <p className="text-center font-bengali text-text-secondary text-xs md:text-sm max-w-2xl mx-auto -mt-3 mb-6">
        মসজিদের ইমাম, মুয়াজ্জিন, মাদ্রাসার শিক্ষক-শিক্ষার্থী ও সাধারণ মুসল্লিদের জন্য খাঁটি আরামদায়ক টুপি
      </p>

      {/* Grid of caps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
        {products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/category/caps"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#063D2B] hover:bg-[#12563D] text-ivory font-bengali font-bold text-sm border border-gold/40 hover:border-gold shadow-sm hover:shadow transition-all group"
        >
          <span>সকল টুপি দেখুন</span>
          <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
