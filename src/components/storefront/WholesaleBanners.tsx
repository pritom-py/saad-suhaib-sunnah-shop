import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Package } from "lucide-react";

export interface PromoBanner {
  position: string;
  titleBn: string;
  subtitleBn: string | null;
  ctaTextBn: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
}

const frame =
  "relative flex min-h-[116px] overflow-hidden rounded-[14px] border border-[#d4af37] shadow-[0_8px_20px_rgba(0,28,19,0.22)] lg:min-h-[clamp(104px,10.2vw,160px)]";

function Divider() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/decorations/golden-divider.svg" alt="" width={240} height={16} className="w-[min(70%,230px)]" />;
}

export function WholesaleBanner({ banner }: { banner: PromoBanner }) {
  return (
    <div className={`${frame} items-center bg-[linear-gradient(100deg,#04291b_0%,#0b4a30_46%,#4d6020_78%,#a8832b_100%)]`}>
      <div aria-hidden className="pattern-geometric absolute inset-0 opacity-[0.12]" />
      {banner.imageUrl && <Image src={banner.imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-25 mix-blend-luminosity" />}
      <div aria-hidden className="mosque absolute -left-5 bottom-0 h-[78%] w-[27%] opacity-90" />
      <div aria-hidden className="mosque absolute -right-8 bottom-0 h-full w-[30%] opacity-25" />
      <svg aria-hidden viewBox="0 0 120 90" className="absolute -left-2 -top-2 h-[72%]">
        <path d="M0 8C30 14 54 10 86 0" stroke="#586f24" strokeWidth="2" fill="none" />
        {[[8, 10, 62], [24, 12, 98], [38, 11, 55], [52, 8, 108], [66, 5, 48], [12, 8, 125], [32, 10, 138]].map(([x, y, r], i) => (
          <path key={i} d="M0 0C7 -10 21 -10 31 0C21 10 7 10 0 0Z" fill={i % 2 ? "#6d8a2c" : "#c69b2f"} transform={`translate(${x} ${y}) rotate(${r})`} />
        ))}
      </svg>

      <div className="relative z-10 flex w-full flex-col items-center py-2 pl-[17%] pr-3 text-center">
        <h3 className="max-w-[12.5em] text-balance font-bold leading-[1.32] text-[#ffe79c] [text-shadow:0_2px_6px_rgba(0,0,0,0.45)] text-[clamp(17px,1.85vw,29px)]">
          {banner.titleBn}
        </h3>
        <div className="mt-0.5 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:flex-nowrap lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col items-center">
            {banner.subtitleBn && <p className="font-semibold text-white text-[clamp(12px,1.18vw,18px)]">{banner.subtitleBn}</p>}
            <Divider />
          </div>
          <Link href={banner.ctaLink || "/wholesale"} className="gold-button shrink-0 !rounded-[8px] px-3 py-1 text-[clamp(12px,1.15vw,17px)]">
            <Phone className="h-[1.1em] w-[1.1em]" />
            {banner.ctaTextBn || "যোগাযোগ করুন"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BulkOrderBanner({ banner }: { banner: PromoBanner }) {
  return (
    <Link
      href={banner.ctaLink || "/wholesale"}
      aria-label={`${banner.titleBn} ${banner.subtitleBn || ""} — ${banner.ctaTextBn || "যোগাযোগ করুন"}`}
      className={`${frame} group items-center [background:var(--maroon-gradient)]`}
    >
      <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.12]" />
      {banner.imageUrl && (
        <div className="absolute inset-y-0 right-0 w-[37%] [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]">
          <Image src={banner.imageUrl} alt="স্তূপ করা সাদা টুপি" fill sizes="(max-width: 768px) 40vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5b2a00]/35 via-transparent to-[#ffb84d]/20" />
        </div>
      )}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-y-0 right-0 h-full w-[37%]">
        <path d="M24 0L0 100" stroke="#f6d77a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d="M18 0L-6 100" stroke="#b47b19" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="relative z-10 flex w-[66%] items-center gap-[clamp(6px,1vw,18px)] py-2 pl-[clamp(10px,1.6vw,28px)]">
        <Package aria-hidden className="shrink-0 text-[#f6d77a] drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] h-[clamp(34px,4.6vw,70px)] w-[clamp(34px,4.6vw,70px)]" strokeWidth={1.5} />
        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <h3 className="font-bold leading-[1.32] text-white text-[clamp(18px,2.05vw,32px)]">{banner.titleBn}</h3>
          <p className="text-balance font-bold leading-snug text-[#ffe08a] text-[clamp(13px,1.42vw,22px)]">{banner.subtitleBn}</p>
          <Divider />
        </div>
      </div>
    </Link>
  );
}

export function WholesaleBanners({ banners }: { banners: PromoBanner[] }) {
  const left = banners.find((b) => b.position === "WHOLESALE_LEFT");
  const right = banners.find((b) => b.position === "WHOLESALE_RIGHT");
  if (!left && !right) return null;
  return (
    <section aria-label="পাইকারি অর্ডার" className="shell grid gap-3 pb-3 pt-[clamp(12px,1.6vw,28px)] md:grid-cols-2">
      {left && <WholesaleBanner banner={left} />}
      {right && <BulkOrderBanner banner={right} />}
    </section>
  );
}
