import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { Tag, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
  });

  return (
    <div className="page-ivory min-h-[70vh] py-10 px-4 font-bengali">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <IslamicDivider title="বিশেষ অফার ও কুপন কোড" />
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            সাদ সুহাইব সুন্নাহ শপের সম্মানিত গ্রাহকদের জন্য সক্রিয় বিশেষ ছাড় ও প্রোমোশন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="premium-card p-6 rounded-2xl !border-[#d4af37] shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.discountValue}% ছাড়`
                    : `৳${coupon.discountValue} ছাড়`}
                </span>
                <Tag className="w-5 h-5 text-gold" />
              </div>

              <div>
                <span className="text-[11px] text-text-secondary">কুপন কোড:</span>
                <div className="text-2xl font-black text-maroon font-sans tracking-wider select-all">
                  {coupon.code}
                </div>
                {coupon.minOrderAmount && (
                  <p className="text-xs text-text-secondary mt-1">
                    সর্বনিম্ন অর্ডার: ৳{coupon.minOrderAmount}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/shop"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-emerald text-xs font-bold transition-colors"
                >
                  <span>কেনাকাটা করুন</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
