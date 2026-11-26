import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";

export function AnnouncementBar({
  message = "সারা বাংলাদেশে দ্রুত ডেলিভারি",
  phone = "+880 1749160444",
}: {
  message?: string;
  phone?: string;
}) {
  return (
    <div className="relative bg-[#710D17] text-[#FCF7EA]">
      <div className="shell flex min-h-[34px] items-center justify-between text-[11px] sm:text-[12.5px] font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-[#EACB85]" />
          <span>{message}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#EACB85]" />
          <span>মানসম্মত ও নির্বাচিত পণ্য</span>
        </div>
        <Link href="/return-policy" className="hidden shrink-0 items-center gap-2 hover:text-[#EACB85] md:flex">
          <RefreshCw className="h-3.5 w-3.5 text-[#EACB85]" />
          <span>রিটার্ন ও এক্সচেঞ্জ নীতি</span>
        </Link>
      </div>
    </div>
  );
}
