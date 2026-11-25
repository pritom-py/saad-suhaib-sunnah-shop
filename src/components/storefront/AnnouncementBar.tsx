import React from "react";
import { Truck, Headphones } from "lucide-react";
import { MosqueIcon } from "./BrandIcons";

export function AnnouncementBar({
  message = "মসজিদ, মাদ্রাসা ও সাধারণ মুসলিম ভাইদের বিশ্বস্ত ইসলামি পণ্যের অনলাইন শপ",
  phone = "+880 1749160444",
}: {
  message?: string;
  phone?: string;
}) {
  const divider = <span aria-hidden className="hidden h-4 w-px bg-gradient-to-b from-transparent via-[#e9bc52]/80 to-transparent lg:block" />;
  return (
    <div className="relative bg-gradient-to-r from-[#001c13] via-[#063d2b] to-[#001c13] text-[#fffcf3]">
      <div className="shell flex min-h-[32px] items-center justify-between gap-3 text-[11.5px] xl:text-[13.5px]">
        <p className="flex min-w-0 items-center gap-2">
          <MosqueIcon className="h-[17px] w-[17px] shrink-0 text-[#e9bc52]" />
          <span className="truncate font-medium">{message}</span>
        </p>
        {divider}
        <p className="hidden shrink-0 items-center gap-2 font-medium md:flex">
          <Truck className="h-[17px] w-[17px] text-[#e9bc52]" />
          সারা বাংলাদেশে হোম ডেলিভারি
        </p>
        {divider}
        <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="flex shrink-0 items-center gap-2 font-medium transition-colors hover:text-[#f6d77a]">
          <Headphones className="h-4 w-4 text-[#e9bc52]" />
          <span className="hidden sm:inline">গ্রাহক সেবা:</span>
          <span className="font-sans font-semibold">{phone}</span>
        </a>
      </div>
      <div className="gold-line !h-px" />
    </div>
  );
}
