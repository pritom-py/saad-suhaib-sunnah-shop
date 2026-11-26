import React from "react";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { FacebookIcon, WhatsAppIcon } from "./BrandIcons";

interface FooterProps {
  settings?: {
    businessNameBn?: string | null;
    phoneSupport?: string | null;
    whatsappUrl?: string | null;
    facebookUrl?: string | null;
    addressBn?: string | null;
    isCodEnabled?: boolean;
    isBkashEnabled?: boolean;
    isNagadEnabled?: boolean;
    isBankEnabled?: boolean;
  } | null;
  categories?: { slug: string; label: string }[];
}

export function Footer({ settings, categories = [] }: FooterProps) {
  // only payment methods that are switched on in Admin → Settings
  const payments = [
    { on: settings?.isBkashEnabled ?? true, label: "বিকাশ", color: "#D12053" },
    { on: settings?.isNagadEnabled ?? true, label: "নগদ", color: "#C2410C" },
    { on: settings?.isCodEnabled ?? true, label: "ক্যাশ অন ডেলিভারি", color: "#082B13" },
    { on: settings?.isBankEnabled ?? false, label: "ব্যাংক ট্রান্সফার", color: "#1A1F71" },
  ].filter((p) => p.on);
  const address = settings?.addressBn;
  const businessName = settings?.businessNameBn || "সাদ সুহাইব সুন্নাহ শপ";
  const phone = settings?.phoneSupport || "+880 1749160444";
  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/8801749160444";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/profile.php?id=61571320383081";

  return (
    <footer className="bg-[#082B13] text-[#FCF7EA] border-t border-[#B68A3E]/30">
      <div className="shell py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand & Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 48 40"
              className="h-9 w-11 text-[#EACB85]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="24" cy="4" r="1.5" fill="#EACB85" stroke="none" />
              <path d="M24 7 C21 10, 16 14, 16 22 L32 22 C32 14, 27 10, 24 7 Z" fill="#B68A3E" fillOpacity="0.15" />
              <path d="M8 38 L8 16 L10 12 L12 16 L12 38" />
              <path d="M36 38 L36 16 L38 12 L40 16 L40 38" />
              <path d="M16 38 L16 22 L32 22 L32 38" />
              <path d="M20 38 L20 28 C20 25.5, 28 25.5, 28 28 L28 38" fill="#EACB85" fillOpacity="0.25" />
              <line x1="4" y1="38" x2="44" y2="38" strokeWidth="2" />
            </svg>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#EACB85] leading-tight">সাদ সুহাইব</span>
              <span className="text-sm font-semibold text-[#FCF7EA]">সুন্নাহ শপ</span>
            </div>
          </div>
          <p className="text-xs text-[#FCF7EA]/80 leading-relaxed max-w-xs">
            সুন্নাহ ভিত্তিক, রুচিশীল ও মানসম্মত ইসলামিক পণ্যের নির্ভরযোগ্য ঠিকানা।
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-105 transition-transform"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-105 transition-transform"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#EACB85] border-b border-[#B68A3E]/30 pb-2">দ্রুত লিংক</h4>
          <ul className="space-y-2 text-xs text-[#FCF7EA]/80">
            <li><Link href="/" className="hover:text-[#EACB85] transition-colors">হোম</Link></li>
            <li><Link href="/shop" className="hover:text-[#EACB85] transition-colors">সব পণ্য</Link></li>
            <li><Link href="/wholesale" className="hover:text-[#EACB85] transition-colors">পাইকারি</Link></li>
            <li><Link href="/about" className="hover:text-[#EACB85] transition-colors">আমাদের সম্পর্কে</Link></li>
            <li><Link href="/contact" className="hover:text-[#EACB85] transition-colors">যোগাযোগ</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#EACB85] border-b border-[#B68A3E]/30 pb-2">আমাদের ক্যাটাগরি</h4>
          <ul className="space-y-2 text-xs text-[#FCF7EA]/80">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/category/${c.slug}`} className="hover:text-[#EACB85] transition-colors">{c.label}</Link></li>
            ))}
            <li><Link href="/shop" className="hover:text-[#EACB85] transition-colors">সব পণ্য</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#EACB85] border-b border-[#B68A3E]/30 pb-2">যোগাযোগ</h4>
          <ul className="space-y-2.5 text-xs text-[#FCF7EA]/80">
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#EACB85]" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#EACB85]">{phone}</a>
            </li>
            {address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#EACB85] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Payment Badges & Copyright */}
      <div className="border-t border-[#B68A3E]/20 bg-[#041B0C] py-4">
        <div className="shell flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FCF7EA]/70">
          <p>© ২০২৬ {businessName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <ul aria-label="পেমেন্ট পদ্ধতি" className="flex flex-wrap items-center justify-center gap-2">
            {payments.map((p) => (
              <li key={p.label} style={{ color: p.color }} className="rounded bg-white px-2.5 py-1 text-[11px] font-bold">{p.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
