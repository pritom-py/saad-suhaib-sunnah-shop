import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

interface CategoryData {
  slug: string;
  nameBn: string;
  imageUrl: string | null;
}

/** The five tiles of the approved design. Artwork is built from the shop's own product photos. */
const TILES = [
  { slug: "caps", label: "টুপি", art: "caps" },
  { slug: "turbans", label: "পাগড়ি", art: "turbans" },
  { slug: "scarves", label: "রুমাল", art: "scarves" },
  { slug: "tasbih", label: "ডিজিটাল তসবিহ", art: "tasbih" },
  { slug: "quran-covers", label: "কোরআনের গিলাফ", art: "others" },
];

export function CategorySection({ categories, subtitles = {} }: { categories: CategoryData[]; subtitles?: Record<string, string> }) {
  const tiles = TILES.flatMap((tile) => {
    const category = categories.find((c) => c.slug === tile.slug);
    if (!category) return [];
    // A picture chosen in the admin replaces the built artwork.
    const custom = category.imageUrl && category.imageUrl !== `/categories/${tile.slug}.jpg` ? category.imageUrl : null;
    return [{ ...tile, custom }];
  });

  return (
    <section className="shell pb-6 pt-5 sm:pb-8 sm:pt-7">
      <SectionTitle title="আমাদের সংগ্রহ" />
      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-4 sm:gap-x-5">
        {tiles.map((tile) => (
          <li key={tile.slug} className="reveal-item w-[calc(33.333%-8px)] sm:w-[calc(20%-16px)]">
            <Link href={`/category/${tile.slug}`} className="group flex flex-col items-center">
              <span className="relative block aspect-[480/580] w-full transition-all duration-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_16px_rgba(214,173,96,0.75)]">
                {tile.custom ? (
                  <span className="absolute inset-0 overflow-hidden rounded-b-lg rounded-t-[999px] border-[3px] border-[#B68A3E] bg-[#082B13]">
                    <Image src={tile.custom} alt="" fill sizes="(max-width: 640px) 33vw, 20vw" className="object-cover" />
                  </span>
                ) : (
                  <Image src={`/categories/arch/${tile.art}.webp`} alt="" fill sizes="(max-width: 640px) 33vw, 20vw" className="object-contain drop-shadow-[0_8px_10px_rgba(4,27,12,0.22)] transition-transform duration-500 group-hover:scale-[1.03]" />
                )}
              </span>
              <span className="mt-2 text-center text-[clamp(13px,1.5vw,21px)] font-bold leading-snug text-[#082B13] group-hover:text-[#710D17]">{tile.label}</span>
              {subtitles[tile.slug] && <span className="text-center text-xs text-[#746B5B]">{subtitles[tile.slug]}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
