import React from "react";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { getContentPage } from "@/services/storefront.service";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const page = await getContentPage("privacy-policy");

  return (
    <div className="page-ivory min-h-[70vh] py-10 px-4 font-bengali">
      <div className="max-w-3xl mx-auto premium-card p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
        <IslamicDivider title={page?.titleBn || "গোপনীয়তা নীতি"} />
        <div className="text-xs md:text-sm text-text-secondary leading-relaxed space-y-3">
          <p>
            {page?.contentBn ||
              "আপনার প্রদত্ত নাম, মোবাইল নম্বর এবং ঠিকানা শুধুমাত্র পার্সেল ডেলিভারির কাজে ব্যবহৃত হয়। আমরা গ্রাহকের কোনো তথ্য কারো কাছে প্রকাশ বা বিক্রি করি না।"}
          </p>
        </div>
      </div>
    </div>
  );
}
