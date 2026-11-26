import React from "react";
import Image from "next/image";
import Link from "next/link";
import ART from "@/content/hero-art.json";

export type ArtName = keyof typeof ART.slides;

/**
 * Which built artwork a slide uses. The pictures originally stored for the four slides mean
 * "use the artwork"; any other picture chosen in Admin → CMS is shown as it is, framed in an arch.
 */
const ART_FOR_IMAGE: Record<string, ArtName> = {
  "/hero/hero-products.webp": "signature",
  "/products/clean/makra-tupi.jpg": "caps",
  "/products/clean/original-kalo-vip-haji-rumal.jpg": "rumal",
  "/products/clean/normal-ac-tupi.jpg": "wholesale",
};

export const artFor = (imageUrl: string | null): ArtName | null => (imageUrl ? (ART_FOR_IMAGE[imageUrl] ?? null) : "signature");

/* the slider caps are openly licensed pictures, so they are described as illustrations */
const ALT: Record<ArtName, string> = {
  signature: "প্রতীকী ছবি: নকশা করা ইসলামি টুপি",
  caps: "প্রতীকী ছবি: সূচিকর্ম করা ইসলামি টুপি",
  rumal: "রুমাল, সাথে প্রতীকী টুপির ছবি",
  wholesale: "প্রতীকী ছবি: বিভিন্ন রঙের ইসলামি টুপি",
};

/** golden specks that drift upwards; fixed positions keep server and browser output identical */
const DUST = [
  [52, 78, 4, 9, 0], [58, 40, 3, 12, 2.5], [64, 66, 5, 10, 5], [69, 22, 3, 13, 1], [73, 84, 4, 8, 3.5],
  [78, 52, 6, 11, 6], [82, 30, 3, 9, 4], [86, 72, 4, 12, 0.5], [90, 46, 3, 10, 7], [94, 82, 5, 13, 2],
  [47, 56, 3, 11, 4.5], [61, 88, 3, 9, 6.5], [76, 14, 4, 12, 3], [96, 24, 3, 10, 5.5],
];

interface Layered {
  art: ArtName | null;
  key: string;
  customImage: string | null;
}

function Products({ art, customImage, alt, priority, leaving }: { art: ArtName | null; customImage: string | null; alt: string; priority: boolean; leaving?: boolean }) {
  if (!art) {
    return (
      <div className={`${leaving ? "hero-out" : "hero-zoom-in"} absolute inset-x-[14%] bottom-[6%] top-[7%] lg:left-[34%] lg:right-[10%]`}>
        <div className="relative h-full w-full overflow-hidden rounded-b-2xl rounded-t-[999px] border-[3px] border-[#D5AD60] shadow-[0_16px_34px_rgba(0,0,0,0.55)]">
          {customImage && <Image src={customImage} alt={alt} fill sizes="(max-width: 1024px) 80vw, 45vw" className="hero-kenburns object-cover" />}
        </div>
      </div>
    );
  }
  return (
    <div className={`absolute inset-0 ${leaving ? "hero-out" : ""}`} role={leaving ? undefined : "img"} aria-label={leaving ? undefined : ALT[art]}>
      {ART.slides[art].map((layer) => (
        <div
          key={layer.src}
          className="hero-parallax absolute"
          style={
            {
              left: `${layer.left}%`,
              top: `${layer.top}%`,
              width: `${layer.width}%`,
              height: `${layer.height}%`,
              zIndex: layer.name === "back" ? 1 : 2,
              "--depth": layer.depth,
            } as React.CSSProperties
          }
        >
          <div className={leaving ? "h-full w-full" : `hero-rise hero-rise-${layer.name} h-full w-full`}>
            <Image src={layer.src} alt="" fill priority={priority} sizes="(max-width: 1024px) 40vw, 28vw" className="object-contain" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroStage({ art, artKey, customImage, alt, leaving }: { art: ArtName | null; artKey: string; customImage: string | null; alt: string; leaving: Layered | null }) {
  const box = (b: { left: number; top: number; width: number; height: number }) => ({ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` });

  return (
    // small screens: a 7:5 window onto the right-hand part of the wide scene
    <div className="relative order-2 aspect-[7/5] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[min(100%,calc(clamp(470px,42vw,620px)*1.744))]">
      <div className="absolute bottom-0 right-0 aspect-[1500/860] h-full">
        <div className="hero-parallax absolute inset-0" style={{ "--depth": 0.18 } as React.CSSProperties}>
          <Image src="/hero/layers/background.webp" alt="" fill priority sizes="(max-width: 1024px) 130vw, 75vw" className="hero-kenburns object-cover" />
        </div>

        {/* soft light breathing behind the arch window */}
        <div aria-hidden className="hero-glow absolute left-[56%] top-[2%] h-[70%] w-[42%] rounded-full bg-[radial-gradient(closest-side,rgba(255,221,140,0.55),transparent)] mix-blend-screen" />

        {leaving && <Products key={`out-${leaving.key}`} art={leaving.art} customImage={leaving.customImage} alt="" priority={false} leaving />}
        <Products key={artKey} art={art} customImage={customImage} alt={alt} priority={art === "signature"} />

        {art && (
          <>
            <div aria-hidden className="hero-leaves pointer-events-none absolute z-[1]" style={box(ART.leaves)}>
              <Image src="/hero/layers/leaves.webp" alt="" fill sizes="10vw" />
            </div>
            <div aria-hidden className="hero-lantern pointer-events-none absolute z-[1]" style={box(ART.lantern)}>
              <Image src="/hero/layers/lantern.webp" alt="" fill sizes="14vw" />
            </div>
          </>
        )}

        <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
          {DUST.map(([x, y, size, seconds, delay], i) => (
            <span key={i} className="hero-dust" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }} />
          ))}
        </div>
        {/* a band of light crosses the scene when the slide changes */}
        <div aria-hidden key={`sweep-${artKey}`} className="hero-sweep pointer-events-none absolute inset-y-0 z-[5] w-[22%]" />
      </div>
      {art && (
        <Link
          href="/image-credits"
          className="absolute right-2 top-2 z-[7] rounded-full bg-[#041B0C]/60 px-2.5 py-0.5 text-[10.5px] text-[#FCF7EA]/85 backdrop-blur-sm hover:text-[#EACB85] lg:bottom-3 lg:top-auto"
        >
          প্রতীকী ছবি · কৃতিত্ব
        </Link>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[6] hidden bg-[linear-gradient(90deg,#0b3218_0%,rgba(11,50,24,0)_30%)] lg:block" />
    </div>
  );
}
