import React from "react";
import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center page-ivory px-4 font-bengali">
      {/* Islamic ornamental circle */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full border-4 border-[#D4A43B] bg-white shadow-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl font-black text-[#780E15]">৪০৪</span>
          </div>
        </div>
        {/* Gold decorative ring */}
        <div className="absolute -inset-2 rounded-full border-2 border-[#D4A43B]/30" />
      </div>

      <div className="text-center space-y-3 max-w-md">
        <h1 className="text-2xl md:text-3xl font-black text-[#063D2B]">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
          বা সাময়িকভাবে অনুপলব্ধ।
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="h-px flex-1 max-w-[60px] bg-[#D4A43B]/50" />
          <span className="text-[#D4A43B] text-lg">✦</span>
          <div className="h-px flex-1 max-w-[60px] bg-[#D4A43B]/50" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#063D2B] text-[#FBF7EC] text-sm font-bold shadow-md hover:bg-[#12563D] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#063D2B] text-[#063D2B] text-sm font-bold hover:bg-[#063D2B]/5 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>সব পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom help text */}
      <p className="mt-10 text-xs text-gray-400">
        সাহায্যের জন্য কল করুন:{" "}
        <a href="tel:+8801749160444" className="text-[#063D2B] font-bold hover:underline">
          +880 1749160444
        </a>
      </p>
    </div>
  );
}
