import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { DEFAULT_CATEGORY_SUBTITLES } from "@/lib/homepage-content";

interface CategoryCardData {
  slug: string;
  nameBn: string;
  imageUrl: string | null;
}

export function CategoryCard({ category, subtitle }: { category: CategoryCardData; subtitle?: string }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block rounded-[18px] border border-[#d9bd72]/70 p-[3px] shadow-[0_5px_14px_rgba(0,43,29,0.16)] transition duration-300 [background:var(--ivory-gradient)] hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-[0_14px_28px_rgba(0,43,29,0.24)]"
    >
      <span className="relative block aspect-[180/177] overflow-hidden rounded-[15px] bg-[#f7efdc]">
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={category.nameBn}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </span>
      <span className="absolute inset-x-[5px] bottom-[5px] flex min-h-[30%] flex-col items-center justify-center rounded-[12px] border border-[#d4af37]/40 bg-gradient-to-b from-[#0d5a3f] via-[#063d2b] to-[#002b1d] px-1 py-1 text-center shadow-[0_-3px_10px_rgba(0,28,19,0.3)]">
        <span className="font-bold leading-snug text-white text-[clamp(14px,1.35vw,20px)]">{category.nameBn}</span>
        {subtitle && <span className="leading-snug text-[#f3ecd6] text-[clamp(10.5px,0.98vw,14px)]">{subtitle}</span>}
      </span>
    </Link>
  );
}

export function CategorySection({
  categories,
  subtitles = DEFAULT_CATEGORY_SUBTITLES,
}: {
  categories: CategoryCardData[];
  subtitles?: Record<string, string>;
}) {
  if (!categories.length) return null;
  return (
    <section className="reveal shell pt-[clamp(14px,1.8vw,32px)]">
      <SectionHeading title="পণ্য ক্যাটাগরি" />
      <ul className="mt-[clamp(8px,1vw,20px)] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[clamp(14px,1.7vw,26px)] lg:px-[clamp(0px,0.9vw,14px)]">
        {categories.slice(0, 5).map((cat, i) => (
          // the fifth card spans the row on two-column phones so the grid stays balanced
          <li key={cat.slug} className={i === 4 ? "col-span-2 mx-auto w-[calc(50%-6px)] sm:col-span-1 sm:w-auto sm:mx-0" : ""}>
            <CategoryCard category={cat} subtitle={subtitles[cat.slug]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
