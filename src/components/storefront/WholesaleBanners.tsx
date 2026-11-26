import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PromoBanner {
  position: string;
  titleBn: string;
  subtitleBn: string | null;
  ctaTextBn: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
}

const DEFAULTS: PromoBanner[] = [
  { position: "WHOLESALE_LEFT", titleBn: "পাইকারি কেনাকাটা", subtitleBn: "ব্যবসায়ীদের জন্য বিশেষ সুবিধা", ctaTextBn: "বিস্তারিত জানুন", ctaLink: "/wholesale", imageUrl: null },
  { position: "WHOLESALE_RIGHT", titleBn: "খুচরা সংগ্রহ", subtitleBn: "আপনার পছন্দের ইসলামিক টুপি", ctaTextBn: "এখনই অর্ডার করুন", ctaLink: "/category/caps", imageUrl: null },
];

/** pictures that mean "no custom image chosen", so the built artwork is shown */
const SEEDED_IMAGES = ["/products/clean/normal-ac-tupi.jpg"];

export function WholesaleBanners({ banners }: { banners?: PromoBanner[] }) {
  // text, link, picture and on/off come from Admin → CMS; the defaults cover an empty database
  const list = banners?.length ? [...banners].sort((a, b) => a.position.localeCompare(b.position)) : DEFAULTS;

  return (
    <section aria-label="প্রমোশনাল ব্যানার" className="shell grid gap-3 pb-6 sm:gap-5 sm:pb-8 md:grid-cols-2">
      {list.slice(0, 2).map((banner) => {
        const right = banner.position === "WHOLESALE_RIGHT";
        const custom = banner.imageUrl && !SEEDED_IMAGES.includes(banner.imageUrl) ? banner.imageUrl : null;
        return (
          <div
            key={banner.position}
            className={`reveal-item group relative flex min-h-[170px] items-center overflow-hidden rounded-2xl border border-[#B68A3E]/60 shadow-md lg:min-h-[clamp(180px,17vw,260px)] ${
              right ? "bg-[linear-gradient(110deg,#45060C,#710D17_55%,#8B1822)]" : "bg-[linear-gradient(110deg,#041B0C,#082B13_55%,#1d4a24)]"
            }`}
          >
            <div aria-hidden className="pattern-geometric absolute inset-0 opacity-[0.08]" />
            <div className="relative z-10 w-[56%] space-y-2 py-5 pl-5 lg:pl-8">
              <h3 className="text-balance text-[clamp(19px,2.2vw,32px)] font-bold leading-tight text-[#F0D699]">{banner.titleBn}</h3>
              {banner.subtitleBn && <p className="text-[clamp(13px,1.2vw,17px)] leading-snug text-[#FCF7EA]">{banner.subtitleBn}</p>}
              <Link href={banner.ctaLink || "/wholesale"} className="gold-button shine !rounded-full px-4 py-2 text-[clamp(12.5px,1.1vw,15px)]">
                {banner.ctaTextBn || "বিস্তারিত জানুন"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute inset-y-2 right-1 w-[46%]">
              {custom ? (
                <span className="absolute inset-2 overflow-hidden rounded-xl border-2 border-[#B68A3E]">
                  <Image src={custom} alt="" fill sizes="(max-width: 768px) 46vw, 23vw" className="object-cover" />
                </span>
              ) : (
                <span className="float-slow absolute inset-0 transition-[scale] duration-500 group-hover:scale-105">
                  <Image src={right ? "/banners/retail-cap.webp" : "/banners/wholesale-caps.webp"} alt="" fill sizes="(max-width: 768px) 46vw, 23vw" className="object-contain object-bottom" />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
