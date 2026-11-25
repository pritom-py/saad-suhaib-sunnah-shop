import React from "react";
import { MosqueIcon } from "./BrandIcons";

/** Compact emerald banner used at the top of inner pages. */
export function PageBanner({ title, eyebrow, description }: { title: string; eyebrow?: string; description?: string | null }) {
  return (
    <div className="emerald-surface relative overflow-hidden rounded-2xl border border-[#d4af37] p-6 text-[#fffcf3] shadow-[var(--premium-shadow)] md:p-8">
      <div aria-hidden className="pattern-geometric absolute inset-0 opacity-[0.13]" />
      <div aria-hidden className="mosque absolute -right-4 bottom-0 h-[92%] w-64 opacity-30" />
      <div className="relative max-w-2xl">
        {eyebrow && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[#f6d77a]">
            <MosqueIcon className="h-4 w-4" /> {eyebrow}
          </p>
        )}
        <h1 className="gold-text inline-block text-3xl font-bold leading-snug md:text-[42px]">{title}</h1>
        <p className="text-sm leading-relaxed text-[#e6eee4] md:text-base">{description || "বাছাই করা ইসলামি পণ্যের সংগ্রহ।"}</p>
      </div>
    </div>
  );
}
