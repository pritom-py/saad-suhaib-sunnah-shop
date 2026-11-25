import React from "react";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { getContentPage } from "@/services/storefront.service";

export const dynamic = "force-dynamic";

export default async function ReturnPolicyPage() {
  const page = await getContentPage("return-policy");

  return (
    <div className="page-ivory min-h-[70vh] py-10 px-4 font-bengali">
      <div className="max-w-3xl mx-auto premium-card p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
        <IslamicDivider title={page?.titleBn || "রিটার্ন ও এক্সচেঞ্জ নীতি"} />
        <div className="text-xs md:text-sm text-text-secondary leading-relaxed space-y-3">
          <p>
            {page?.contentBn ||
              "পণ্য গ্রহণের সময় ডেলিভারিম্যানের সামনে চেক করে গ্রহণ করুন। কোনো ভুল সাইজ বা ত্রুটি থাকলে তাৎক্ষণিক ফেরত অথবা ৩ দিনের মধ্যে এক্সচেঞ্জ সুবিধা দেওয়া হবে।"}
          </p>
          <p className="text-xs text-text-muted italic">
            (চূড়ান্ত নীতি ক্লায়েন্ট নিশ্চিতকরণ সাপেক্ষ)
          </p>
        </div>
      </div>
    </div>
  );
}
