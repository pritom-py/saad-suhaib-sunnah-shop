import React from "react";
import Link from "next/link";
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
      <div className="shell py-3.5 lg:py-4 flex items-center justify-between gap-4 lg:gap-8">
        {/* Left: Brand with Mosque Graphic Icon */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Elegant Golden Mosque Architectural Outline Icon */}
            <svg
              viewBox="0 0 48 40"
              className="h-10 w-12 text-[#B68A3E] transition-transform duration-300 group-hover:scale-105"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Crescent top */}
              <circle cx="24" cy="4" r="1.5" fill="#EACB85" stroke="none" />
              {/* Central Dome */}
              <path d="M24 7 C21 10, 16 14, 16 22 L32 22 C32 14, 27 10, 24 7 Z" fill="#B68A3E" fillOpacity="0.15" />
              {/* Side minarets */}
              <path d="M8 38 L8 16 L10 12 L12 16 L12 38" />
              <path d="M36 38 L36 16 L38 12 L40 16 L40 38" />
              {/* Small side domes */}
              <path d="M12 22 C12 17, 16 17, 16 22" />
              <path d="M32 22 C32 17, 36 17, 36 22" />
              {/* Central base arches */}
              <path d="M16 38 L16 22 L32 22 L32 38" />
              <path d="M20 38 L20 28 C20 25.5, 28 25.5, 28 28 L28 38" fill="#EACB85" fillOpacity="0.25" />
              <line x1="4" y1="38" x2="44" y2="38" strokeWidth="2" />
            </svg>
            <div className="flex flex-col">
              <span className="font-bold text-[22px] sm:text-[26px] leading-[1.15] text-[#EACB85] tracking-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                {businessName.includes(" ") ? (
                  <>
                    <span className="block">{businessName.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="block text-[17px] sm:text-[19px] text-[#FCF7EA] font-semibold">
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
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
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
