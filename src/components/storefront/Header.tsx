import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { FacebookIcon, WhatsAppIcon } from "./BrandIcons";

interface HeaderProps {
  settings?: {
    businessNameBn?: string | null;
    taglineBn?: string | null;
    phoneSupport?: string | null;
    whatsappUrl?: string | null;
    facebookUrl?: string | null;
  } | null;
}

export function Header({ settings }: HeaderProps) {
  const businessName = settings?.businessNameBn || "সাদ সুহাইব সুন্নাহ শপ";
  const tagline = settings?.taglineBn || "সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের বিশ্বস্ত ঠিকানা";
  const phone = settings?.phoneSupport || "+880 1749160444";
  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/8801749160444";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/profile.php?id=61571320383081";

  return (
    <header className="relative z-[45] bg-gradient-to-b from-white via-[#fffbef] to-[#f9f0da]">
      {/* geometric texture + mosque architecture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pattern-stars absolute inset-0 opacity-[0.16] [mask-image:linear-gradient(90deg,#000,transparent_22%,transparent_74%,#000)]" />
        <div className="mosque absolute -left-16 bottom-0 h-[82%] w-52 opacity-[0.28]" />
        <div className="mosque absolute bottom-0 hidden h-[82%] w-60 opacity-[0.28] md:block md:left-[47%]" />
        <div className="mosque absolute -right-20 bottom-0 hidden h-[55%] w-56 opacity-[0.13] lg:block" />
      </div>

      <div className="shell relative grid grid-cols-1 items-center gap-x-4 gap-y-2 py-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:py-2 lg:h-[clamp(138px,12vw,168px)] lg:grid-cols-[minmax(0,1fr)_clamp(330px,32.6vw,460px)] lg:py-0">
        <Link href="/" className="group flex min-w-0 items-center gap-3 lg:gap-[clamp(16px,2.2vw,32px)] lg:pl-[clamp(14px,2.4vw,32px)]">
          <span className="relative block h-16 w-16 shrink-0 rounded-full p-[3px] shadow-[0_6px_18px_rgba(73,6,9,0.28)] [background:var(--gold-gradient)] sm:h-20 sm:w-20 lg:h-[clamp(130px,11.2vw,156px)] lg:w-[clamp(130px,11.2vw,156px)]">
            <Image
              src="/logo/logo-circle.png"
              alt={`${businessName} লোগো`}
              width={312}
              height={312}
              priority
              className="h-full w-full rounded-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </span>
          <span className="min-w-0">
            <span className="block font-bold leading-[1.35] text-[#780e15] text-[clamp(20px,5.4vw,28px)] md:text-[clamp(22px,2.95vw,28px)] lg:whitespace-nowrap lg:text-[clamp(35px,3.5vw,49px)]">
              {businessName}
            </span>
            <span className="block text-balance font-semibold leading-snug text-[#26302a] text-[clamp(11px,1.42vw,19px)]">
              {tagline}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/decorations/golden-divider.svg" alt="" width={240} height={16} className="mx-auto mt-1 hidden w-[88%] sm:block" />
          </span>
        </Link>

        <div className="flex flex-col gap-2.5 lg:gap-3">
          <div className="hidden items-center justify-between gap-3 md:flex">
            <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#063d2b] text-white shadow-md transition-transform group-hover:scale-105 xl:h-11 xl:w-11">
                <PhoneCall className="h-4 w-4 xl:h-5 xl:w-5" />
              </span>
              <span className="leading-tight">
                <span className="block whitespace-nowrap font-sans text-[15px] font-bold text-[#10201a] xl:text-lg">{phone}</span>
                <span className="block text-[11px] font-medium text-[#4f5a53] xl:text-[13px]">কল / WhatsApp</span>
              </span>
            </a>
            <div className="flex items-center gap-3 pr-1">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="ফেসবুক পেজ" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 xl:h-10 xl:w-10">
                <FacebookIcon className="h-full w-full text-[#1877F2]" />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="হোয়াটসঅ্যাপে বার্তা পাঠান" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-110 xl:h-10 xl:w-10">
                <WhatsAppIcon className="h-5 w-5 xl:h-6 xl:w-6" />
              </a>
            </div>
          </div>
          <SearchAutocomplete />
        </div>
      </div>
    </header>
  );
}
