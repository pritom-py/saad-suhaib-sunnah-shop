import React from "react";
import Link from "next/link";
import { Award, CreditCard, Headphones, Package, ShieldCheck, Truck } from "lucide-react";
import { DEFAULT_TRUST_ITEMS, type TrustItem } from "@/lib/homepage-content";

const ICONS = { award: Award, truck: Truck, shield: ShieldCheck, card: CreditCard, package: Package, headset: Headphones };

export function TrustStrip({ items = DEFAULT_TRUST_ITEMS }: { items?: TrustItem[] }) {
  return (
    <section aria-label="আমাদের বিশেষত্ব" className="border-y border-[#E3D6BC] bg-[linear-gradient(180deg,#FCF7EA,#F4EAD7)]">
      <ul className="shell grid grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item, i) => {
          const Icon = ICONS[item.icon] || Award;
          const body = (
            <>
              <Icon aria-hidden className="h-8 w-8 shrink-0 text-[#A67C35] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 sm:h-10 sm:w-10" strokeWidth={1.4} />
              <span className="flex min-w-0 flex-col">
                <span className="text-[clamp(13px,1.3vw,18px)] font-bold leading-snug text-[#082B13]">{item.title}</span>
                {item.subtitle && <span className="text-[clamp(11.5px,1vw,14px)] leading-snug text-[#746B5B]">{item.subtitle}</span>}
              </span>
            </>
          );
          const cell = "flex h-full items-center gap-2.5 py-3.5 sm:justify-center sm:gap-3.5 sm:py-5";
          return (
            <li key={i} className={`reveal-item group min-w-0 px-1.5 ${i % 2 ? "border-l border-[#E3D6BC]" : ""} ${i === 2 ? "lg:border-l lg:border-[#E3D6BC]" : ""}`}>
              {item.href ? (
                <Link href={item.href} className={`${cell} hover:opacity-80`}>{body}</Link>
              ) : (
                <div className={cell}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
