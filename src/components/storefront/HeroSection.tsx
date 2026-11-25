"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { GoldenIslamicArch } from "./GoldenIslamicArch";

export interface HeroSlide {
  id: string;
  badgeBn: string;
  titleBn: string;
  subtitleBn: string;
  descriptionBn: string;
  ctaTextBn: string;
  ctaLink: string;
  imageUrl: string | null;
}

const FALLBACK: HeroSlide = {
  id: "fallback",
  badgeBn: "সুন্নাহর অনুসরণে, দৈনন্দিন প্রয়োজনে",
  titleBn: "মানসম্মত ইসলামি",
  subtitleBn: "টুপি, পাগড়ি, রুমাল, তসবিহ ও কোরআনের গিলাফ",
  descriptionBn: "মসজিদ, মাদ্রাসা ও ব্যক্তিগত ব্যবহারের জন্য নির্বাচিত ও নির্ভরযোগ্য পণ্য।",
  ctaTextBn: "এখনই অর্ডার করুন",
  ctaLink: "/shop",
  imageUrl: "/hero/hero-products.webp",
};

/** decorative foliage at the right edge */
function Leaves({ className }: { className: string }) {
  const leaves = [
    [92, 12, -35, 1], [70, 30, -70, 0.85], [96, 46, -5, 0.9], [62, 58, -105, 0.7], [84, 70, -55, 1.05],
    [100, 92, 15, 0.8], [66, 96, -85, 0.9], [88, 116, -30, 0.75], [54, 122, -120, 0.6], [92, 140, -60, 0.85],
  ];
  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden>
      <path d="M122 4C96 30 92 90 108 168M104 40C88 46 74 44 62 36M102 96C88 104 74 106 58 100" stroke="#33481a" strokeWidth="2.5" fill="none" />
      {leaves.map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d="M0 0C10 -13 30 -13 44 0C30 13 10 13 0 0Z" fill={i % 3 === 0 ? "#5c7a26" : i % 3 === 1 ? "#44641d" : "#2f4c16"} />
          <path d="M2 0H40" stroke="#a9bd62" strokeWidth="0.8" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function SlideVisual({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const isCutout = !!slide.imageUrl?.startsWith("/hero/");
  return (
    <>
      <Image src="/hero/hero-scene.webp" alt="" fill sizes="(max-width: 1024px) 100vw, 62vw" priority={priority} className="object-cover object-bottom" />
      {slide.imageUrl &&
        (isCutout ? (
          <div className="absolute bottom-[0.5%] left-[17%] right-[1.5%] top-[8%]">
            <Image
              src={slide.imageUrl}
              alt="সাদা টুপি, চেক রুমাল, ভিআইপি হাজি রুমাল ও কম্পাসযুক্ত ডিজিটাল তসবিহ"
              fill
              sizes="(max-width: 1024px) 90vw, 52vw"
              priority={priority}
              className="object-contain object-bottom drop-shadow-[0_10px_14px_rgba(20,8,0,0.4)]"
            />
          </div>
        ) : (
          <div className="absolute bottom-[5%] left-[19%] right-[8%] top-[9%] overflow-hidden rounded-2xl border-[3px] border-[#e9bc52] shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
            <Image src={slide.imageUrl} alt={slide.titleBn} fill sizes="(max-width: 1024px) 80vw, 44vw" className="object-cover" />
          </div>
        ))}
    </>
  );
}

export function HeroSection({ banners }: { banners?: HeroSlide[] }) {
  const slides = banners && banners.length > 0 ? banners : [FALLBACK];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const dragStart = useRef<number | null>(null);
  const count = slides.length;
  const current = index % count;
  const slide = slides[current];

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [current, count, paused, reduceMotion, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="প্রধান ব্যানার"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (dragStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (dragStart.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - dragStart.current;
        if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        dragStart.current = null;
      }}
      className="emerald-surface relative overflow-hidden text-[#fffcf3] lg:h-[clamp(318px,31.2vw,520px)]"
    >
      <div aria-hidden className="pattern-geometric absolute inset-0 opacity-[0.13] [mask-image:radial-gradient(90%_100%_at_20%_40%,#000,transparent_85%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_45%,rgba(35,122,85,0.35),transparent_55%)]" />

      <div className="shell relative z-10 flex pb-5 pt-6 lg:h-full lg:items-center lg:py-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: reduceMotion ? 0 : -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-live={paused ? "polite" : "off"}
            className="w-full text-center lg:w-[41.5%] lg:pl-[clamp(8px,2.4vw,34px)] lg:text-left"
          >
            <p className="inline-block rounded-[10px] border border-[#f9e7ac] px-4 py-1.5 font-bold text-[#1d2208] shadow-[0_5px_14px_rgba(0,0,0,0.35)] [background:var(--gold-button-gradient)] text-[clamp(13px,1.38vw,21px)]">
              {slide.badgeBn}
            </p>
            <h1 className="mt-[clamp(6px,0.8vw,14px)] font-bold">
              <span className="gold-text block text-balance leading-[1.28] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] text-[clamp(32px,3.75vw,60px)]">
                {slide.titleBn}
              </span>
              <span className="mx-auto block max-w-[13.4em] text-balance leading-[1.28] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)] text-[clamp(22px,2.62vw,42px)] lg:mx-0">
                {slide.subtitleBn}
              </span>
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/decorations/golden-divider.svg" alt="" width={240} height={16} className="mx-auto my-[clamp(2px,0.5vw,10px)] w-[min(80%,340px)] lg:mx-0" />
            <p className="mx-auto max-w-[23em] text-balance leading-relaxed text-[#f1ead6] text-[clamp(13.5px,1.3vw,20px)] lg:mx-0">
              {slide.descriptionBn}
            </p>
            <Link href={slide.ctaLink || "/shop"} className="gold-button group mt-[clamp(10px,1.2vw,22px)] px-[clamp(18px,1.9vw,30px)] py-[clamp(7px,0.7vw,12px)] text-[clamp(15px,1.4vw,20px)]">
              <ShoppingCart className="h-[1.15em] w-[1.15em]" strokeWidth={2.4} />
              {slide.ctaTextBn}
              <ArrowRight className="h-[1.15em] w-[1.15em] transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* arch with the product composition: stacks under the text on small screens */}
      <GoldenIslamicArch className="relative h-[clamp(210px,62vw,430px)] w-full lg:absolute lg:inset-y-0 lg:left-[39.5%] lg:right-0 lg:h-auto lg:w-auto">
        <AnimatePresence initial={false}>
          <motion.div key={slide.id} initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0">
            <SlideVisual slide={slide} priority={current === 0} />
          </motion.div>
        </AnimatePresence>
        <Leaves className="absolute -right-1 -top-2 h-[56%] w-auto" />
        <Leaves className="absolute -bottom-6 -right-2 h-[48%] w-auto -scale-y-100" />
        <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_60px_rgba(20,8,0,0.45)]" />
      </GoldenIslamicArch>

      {count > 1 && (
        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center lg:left-[48.5%]">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)} aria-label={`স্লাইড ${i + 1}`} aria-current={i === current} className="p-[5px]">
              <span className={`block h-[9px] w-[9px] rounded-full shadow transition-all ${i === current ? "scale-110 [background:var(--gold-button-gradient)]" : "bg-[#fffcf3]/80"}`} />
            </button>
          ))}
        </div>
      )}
      <div className="gold-line absolute inset-x-0 bottom-0 z-20" />
    </section>
  );
}
