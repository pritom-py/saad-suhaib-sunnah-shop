import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, CreditCard, Package, type LucideIcon } from "lucide-react";
import { DEFAULT_TRUST_ITEMS, type TrustItem } from "@/lib/homepage-content";

const ICONS: Record<string, LucideIcon> = { truck: Truck, shield: ShieldCheck, card: CreditCard, package: Package };

export function TrustStrip({ items = DEFAULT_TRUST_ITEMS }: { items?: TrustItem[] }) {
  return (
    <section aria-label="আমাদের সেবা" className="shell pt-2.5">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <linearGradient id="icon-gold" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0" stopColor="#8C5A0A" />
          <stop offset="0.45" stopColor="#D9AC3F" />
          <stop offset="0.6" stopColor="#E9BC52" />
          <stop offset="1" stopColor="#8C5A0A" />
        </linearGradient>
      </svg>
      <ul className="premium-card grid grid-cols-2 !rounded-[14px] py-1 lg:grid-cols-4 lg:py-0">
        {items.slice(0, 4).map((item, i) => {
          const Icon = ICONS[item.icon] || ShieldCheck;
          const body = (
            <>
              <Icon className="shrink-0 h-[clamp(30px,3.4vw,48px)] w-[clamp(30px,3.4vw,48px)]" stroke="url(#icon-gold)" strokeWidth={1.7} />
              <span className="max-w-[8.4em] text-balance font-bold leading-snug text-[#16221c] text-[clamp(13px,1.32vw,18px)]">{item.title}</span>
            </>
          );
          const cls = "flex h-full w-full items-center justify-center gap-[clamp(8px,1.4vw,20px)] px-2.5 py-2.5";
          return (
            <li key={i} className="relative flex min-h-[64px] items-center lg:min-h-[clamp(66px,6.3vw,96px)]">
              {i > 0 && <span aria-hidden className={`absolute left-0 top-[18%] h-[64%] w-px bg-gradient-to-b from-transparent via-[#c69532] to-transparent ${i === 2 ? "hidden lg:block" : ""}`} />}
              {item.href ? (
                <Link href={item.href} className={`${cls} rounded-lg transition-colors hover:bg-[#f7efdc]/60`}>{body}</Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
