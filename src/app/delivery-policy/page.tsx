import React from "react";
import { formatPrice } from "@/lib/locale";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { getContentPage, getBusinessSettings } from "@/services/storefront.service";

export const dynamic = "force-dynamic";

export default async function DeliveryPolicyPage() {
  const [page, settings] = await Promise.all([getContentPage("delivery-policy"), getBusinessSettings()]);

  return (
    <div className="page-ivory min-h-[70vh] py-10 px-4 font-bengali">
      <div className="max-w-3xl mx-auto premium-card p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
        <IslamicDivider title={page?.titleBn || "ডেলিভারি নীতি"} />
        <div className="text-xs md:text-sm text-text-secondary leading-relaxed space-y-3">
          <p>
            {page?.contentBn ||
              "আমরা সারা বাংলাদেশে সুন্দরবন কুরিয়ার, এসএ পরিবহন, রেডএক্স ও স্টিডফাস্ট কুরিয়ারের মাধ্যমে নিরাপদে পণ্য পৌঁছে দিই।"}
          </p>
          <div className="p-4 bg-[#FBF7EC] rounded-xl border border-gold/40 space-y-1">
            <p className="font-bold text-primary">• ঢাকার ভিতরে ডেলিভারি চার্জ: {formatPrice(settings?.insideDhakaRate ?? 70)} (২-৩ দিন)</p>
            <p className="font-bold text-primary">• ঢাকার বাইরে ডেলিভারি চার্জ: {formatPrice(settings?.outsideDhakaRate ?? 130)} (৩-৫ দিন)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
