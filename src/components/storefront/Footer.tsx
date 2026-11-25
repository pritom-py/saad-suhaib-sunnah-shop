import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { FooterColumn } from "./FooterColumn";
import { PaymentMethods, type PaymentFlags } from "./PaymentMethods";
import { FacebookIcon, WhatsAppIcon } from "./BrandIcons";
import { toBengaliNumber } from "@/lib/locale";

interface FooterProps {
  settings?:
    | (PaymentFlags & {
        businessNameBn?: string | null;
        phoneSupport?: string | null;
        whatsappUrl?: string | null;
        facebookUrl?: string | null;
      })
    | null;
  categories?: { slug: string; label: string }[];
}

const QUICK_LINKS = [
  { href: "/shop", label: "সব পণ্য" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/delivery-policy", label: "ডেলিভারি নীতি" },
  { href: "/return-policy", label: "রিটার্ন ও এক্সচেঞ্জ নীতি" },
  { href: "/privacy-policy", label: "গোপনীয়তা নীতি" },
];

function LinkList({ items }: { items: { href: string; label: string }[] }) {
  return (
    <ul>
      {items.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="group flex items-center gap-1.5 py-[1px] leading-[1.45] text-[clamp(13px,1.17vw,16.5px)] max-md:py-1.5 text-[#e9efe6] transition-colors hover:text-[#f6d77a]">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#f6d77a] transition-transform group-hover:translate-x-0.5" />
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ settings, categories = [] }: FooterProps) {
  const businessName = settings?.businessNameBn || "সাদ সুহাইব সুন্নাহ শপ";
  const phone = settings?.phoneSupport || "+880 1749160444";
  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/8801749160444";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/profile.php?id=61571320383081";
  const contactRow = "flex items-center gap-2.5 py-1 text-[clamp(13px,1.17vw,16.5px)] text-[#e9efe6] transition-colors hover:text-[#f6d77a]";

  return (
    <footer className="emerald-surface relative overflow-hidden text-[#fffcf3]">
      <div className="gold-line" />
      <div aria-hidden className="pattern-stars pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div aria-hidden className="mosque absolute bottom-14 right-0 h-[130px] w-[230px] opacity-20 md:opacity-40 lg:-right-8" />
      <div aria-hidden className="mosque absolute bottom-14 -left-16 hidden h-[90px] w-[200px] opacity-15 lg:block" />

      <div className="shell relative grid gap-x-3 gap-y-1 py-5 md:grid-cols-2 md:gap-y-6 lg:grid-cols-[1.85fr_1.05fr_0.95fr_1.35fr] lg:py-[clamp(8px,1.4vw,30px)]">
        <div className="flex flex-col items-center gap-3 pb-3 text-center sm:flex-row sm:items-start sm:text-left md:pb-0">
          <span className="shrink-0 rounded-full p-[2px] [background:var(--gold-gradient)]">
            <Image src="/logo/logo-circle.png" alt={`${businessName} লোগো`} width={220} height={220} className="h-[clamp(88px,9vw,130px)] w-[clamp(88px,9vw,130px)] rounded-full" />
          </span>
          <div>
            <h2 className="font-bold leading-snug text-white text-[clamp(18px,1.65vw,24px)]">{businessName}</h2>
            <p className="mt-1 max-w-[19em] leading-relaxed text-[#dce6da] text-[clamp(12.5px,1.1vw,15.5px)]">
              সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের নির্ভরযোগ্য অনলাইন শপ। মসজিদ, মাদ্রাসা ও সাধারণ মুসলিম ভাইদের জন্য মানসম্মত পণ্য সরবরাহ আমাদের লক্ষ্য।
            </p>
          </div>
        </div>

        <FooterColumn title="দ্রুত লিংক">
          <LinkList items={QUICK_LINKS} />
        </FooterColumn>

        <FooterColumn title="ক্যাটাগরি">
          <LinkList items={categories.map((c) => ({ href: `/category/${c.slug}`, label: c.label }))} />
        </FooterColumn>

        <FooterColumn title="যোগাযোগ করুন">
          <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className={contactRow}>
            <Phone className="h-[18px] w-[18px] shrink-0 text-[#f6d77a]" />
            <span className="leading-tight">
              <span className="block font-sans font-semibold">{phone}</span>
              <span className="text-[11px] text-[#bcd0c2]">কল / WhatsApp</span>
            </span>
          </a>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={contactRow}>
            <FacebookIcon className="h-[18px] w-[18px] shrink-0 text-white" />
            Facebook-এ যুক্ত হন
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={contactRow}>
            <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 text-white" />
            সরাসরি মেসেজ করুন
          </a>
        </FooterColumn>
      </div>

      <div className="gold-line relative !h-px" />
      <div className="relative bg-[#001c13]/70">
        <div className="shell flex min-h-[50px] flex-col items-center justify-between gap-2 py-2 text-center md:flex-row">
          <p className="text-[13px] text-[#e9efe6]">
            © {toBengaliNumber(new Date().getFullYear())} {businessName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <PaymentMethods flags={settings} />
        </div>
      </div>
    </footer>
  );
}
