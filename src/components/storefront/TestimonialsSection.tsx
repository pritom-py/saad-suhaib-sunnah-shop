import React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/content/testimonials";
import { SectionTitle } from "./SectionTitle";

export function TestimonialsSection() {
  if (!TESTIMONIALS.length) return null;

  return (
    <section className="shell py-6 sm:py-8">
      <SectionTitle title="গ্রাহকদের মতামত" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 sm:gap-5">
        {TESTIMONIALS.slice(0, 3).map((t) => (
          <figure key={t.name} className="flex items-center gap-4 rounded-xl border border-[#E3D6BC] bg-white/80 p-4 shadow-sm">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B68A3E] bg-[#F4EAD7] text-lg font-bold text-[#082B13]">
              {t.photo ? <Image src={t.photo} alt="" fill sizes="48px" className="object-cover" /> : t.name.trim().charAt(0)}
            </span>
            <div>
              <blockquote className="text-sm leading-relaxed text-[#14291B]">&ldquo;{t.comment}&rdquo;</blockquote>
              <figcaption className="mt-1 text-xs font-bold text-[#082B13]">— {t.name}</figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
