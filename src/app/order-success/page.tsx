import React from "react";
import Link from "next/link";
import { CheckCircle2, Phone, ShoppingBag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  let order = null;
  if (orderNumber) {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  }

  return (
    <div className="page-ivory min-h-[70vh] py-12 px-4 flex items-center justify-center font-bengali">
      <div className="max-w-2xl w-full premium-card rounded-3xl shadow-xl p-6 md:p-10 text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#063D2B] flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-[#15803D]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">আলহামদুলিল্লাহ</span>
          <h1 className="text-2xl md:text-3xl font-black text-primary">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
          </h1>
          <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার মোবাইল নম্বরে কল করে অর্ডার নিশ্চিত করবেন এবং ডেলিভারি প্রস্তুত করবেন।
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-[#FBF7EC] p-5 rounded-2xl border border-[#E5D9BD] text-left space-y-3 text-xs md:text-sm">
            <div className="flex items-center justify-between border-b border-[#E5D9BD] pb-2 font-bold">
              <span className="text-text-secondary">অর্ডার নম্বর:</span>
              <span className="text-primary font-sans text-base text-maroon font-black">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between text-text-secondary">
              <span>গ্রাহকের নাম:</span>
              <span className="font-bold text-text-primary">{order.guestName}</span>
            </div>

            <div className="flex items-center justify-between text-text-secondary">
              <span>মোবাইল নম্বর:</span>
              <span className="font-bold text-text-primary font-sans">{order.guestPhone}</span>
            </div>

            <div className="flex items-center justify-between text-text-secondary">
              <span>ডেলিভারি ঠিকানা:</span>
              <span className="font-bold text-text-primary text-right max-w-xs truncate">
                {order.fullAddress}, {order.upazila}, {order.district}
              </span>
            </div>

            <div className="flex items-center justify-between text-text-secondary">
              <span>পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-primary">
                {order.paymentMethod === "COD"
                  ? "ক্যাশ অন ডেলিভারি"
                  : order.paymentMethod === "BKASH"
                  ? "বিকাশ"
                  : order.paymentMethod === "NAGAD"
                  ? "নগদ"
                  : "ব্যাংক ট্রান্সফার"}
              </span>
            </div>

            <div className="border-t border-[#E5D9BD] pt-2 flex items-center justify-between text-sm md:text-base font-extrabold">
              <span className="text-primary">সর্বমোট পরিশোধযোগ্য:</span>
              <span className="text-maroon font-black text-lg">
                {formatPrice(order.totalAmount, "bn")}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {orderNumber && (
            <Link
              href={`/track-order?orderNumber=${orderNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-emerald text-xs md:text-sm font-bold shadow-md transition-colors"
            >
              <span>অর্ডার ট্র্যাক করুন</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          )}

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cream hover:bg-[#E5D9BD] text-primary text-xs md:text-sm font-bold border border-[#E5D9BD] transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>আরও কেনাকাটা করুন</span>
          </Link>
        </div>

        <div className="pt-2 text-xs text-text-secondary flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-gold" />
          <span>যেকোনো প্রয়োজনে কল করুন: </span>
          <strong className="text-primary font-sans font-bold">+880 1749160444</strong>
        </div>
      </div>
    </div>
  );
}
