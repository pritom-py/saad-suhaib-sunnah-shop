import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { User } from "lucide-react";
import { HeaderCartButton } from "./HeaderCartButton";

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

  return (
    <header className="relative z-[45] bg-[#082B13] border-b border-[#B68A3E]/30 text-[#FCF7EA]">
      <div className="shell py-2.5 lg:py-3 flex items-center justify-between gap-4 lg:gap-8">
        {/* Left: logo and shop name */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* the shop's logo */}
            <Image
              src="/logo/logo-seal.png"
              alt=""
              width={84}
              height={84}
              priority
              className="h-14 w-14 shrink-0 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 lg:h-[84px] lg:w-[84px]"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[19px] sm:text-[26px] leading-[1.15] text-[#EACB85] tracking-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                {businessName.includes(" ") ? (
                  <>
                    <span className="block">{businessName.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="block text-[15px] sm:text-[19px] text-[#FCF7EA] font-semibold">
                      {businessName.split(" ").slice(2).join(" ") || "সুন্নাহ শপ"}
                    </span>
                  </>
                ) : (
                  businessName
                )}
              </span>
            </div>
          </div>
        </Link>

        {/* Center: Search Input */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <SearchAutocomplete />
        </div>

        {/* Right: Account & Cart Quick Controls */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link
            href="/track-order"
            className="flex flex-col items-center gap-0.5 text-[#FCF7EA]/90 hover:text-[#EACB85] transition-colors"
          >
            <User className="h-5 w-5 text-[#EACB85]" />
            <span className="text-[11px] font-medium hidden sm:inline">অ্যাকাউন্ট</span>
          </Link>
          <HeaderCartButton />
        </div>
      </div>

      {/* Mobile search bar row */}
      <div className="shell pb-3 md:hidden">
        <SearchAutocomplete />
      </div>
    </header>
  );
}
