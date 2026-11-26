"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { toBengaliNumber } from "@/lib/locale";
import { HeroStage, artFor } from "./HeroStage";

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
  badgeBn: "সুন্নাহ • রুচি • মান",
  titleBn: "প্রিমিয়াম ইসলামিক",
  subtitleBn: "টুপির সংগ্রহ",
  descriptionBn: "ঐতিহ্য, রুচি ও আরামের সমন্বয়ে নির্বাচিত মানসম্মত টুপির সংগ্রহ",
  ctaTextBn: "সংগ্রহ দেখুন",
  ctaLink: "/shop",
  imageUrl: null,
};

const DURATION = 7000;
const LEAVING = 800;

/** Bengali must be animated word by word: splitting letters would break the conjuncts. */
function Words({ text, from }: { text: string; from: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <span className="hero-word" style={{ animationDelay: `${from + i * 90}ms` }}>
            {word}
          </span>
        </React.Fragment>
      ))}
    </>
  );
}

/** gold corner of the multifoil arch that frames the banner */
function Corner({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={`pointer-events-none absolute top-0 z-20 h-[clamp(64px,10vw,160px)] w-auto ${className}`}>
      <path d="M0 0H160C132 4 112 12 104 30C80 24 58 36 56 58C34 56 18 72 22 94C8 100 2 122 0 160Z" fill="#041B0C" />
      <path className="hero-draw" pathLength={1} d="M160 0C132 4 112 12 104 30C80 24 58 36 56 58C34 56 18 72 22 94C8 100 2 122 0 160" fill="none" stroke="#D5AD60" strokeWidth="3" />
      <path className="hero-draw [animation-delay:250ms]" pathLength={1} d="M146 0C124 5 108 14 100 24C76 20 52 34 50 53C28 52 13 70 16 90C6 98 2 112 0 124" fill="none" stroke="#B68A3E" strokeWidth="1.4" opacity=".8" />
    </svg>
  );
}

export function HeroSection({ banners }: { banners?: HeroSlide[] }) {
  const slides = banners?.length ? banners : [FALLBACK];
  const count = slides.length;
  const [{ current, previous }, setSlides] = useState({ current: 0, previous: null as number | null });
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);
  const section = useRef<HTMLElement>(null);
  const dragStart = useRef<number | null>(null);
  const slide = slides[current % count];
  const paused = hovered || stopped || reduced;
  // a short second line keeps the large two-line headline of the design
  const shortSubtitle = slide.subtitleBn.length <= 22;

  const show = useCallback(
    (next: number) =>
      setSlides((s) => {
        const target = ((next % count) + count) % count;
        return target === s.current ? s : { current: target, previous: s.current };
      }),
    [count],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setTimeout(() => show(current + 1), DURATION);
    return () => clearTimeout(t);
  }, [current, count, paused, show]);

  useEffect(() => {
    if (previous === null) return;
    const t = setTimeout(() => setSlides((s) => ({ ...s, previous: null })), LEAVING);
    return () => clearTimeout(t);
  }, [previous, current]);

  // the layers drift with the mouse: CSS variables avoid re-rendering on every move
  const tilt = (x: number, y: number) => {
    section.current?.style.setProperty("--mx", x.toFixed(3));
    section.current?.style.setProperty("--my", y.toFixed(3));
  };

  const arrow =
    "absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D5AD60]/70 bg-[#041B0C]/55 text-[#F7E2AC] opacity-0 backdrop-blur-sm transition hover:scale-110 hover:bg-[#D5AD60] hover:text-[#082B13] focus-visible:opacity-100 group-hover/hero:opacity-100 lg:flex";

  return (
    <section
      ref={section}
      aria-roledescription="carousel"
      aria-label="প্রধান ব্যানার"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") show(current + 1);
        if (e.key === "ArrowLeft") show(current - 1);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        tilt(0, 0);
      }}
      onMouseMove={(e) => {
        if (reduced) return;
        const box = e.currentTarget.getBoundingClientRect();
        tilt((e.clientX - box.left) / box.width - 0.5, (e.clientY - box.top) / box.height - 0.5);
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onTouchStart={(e) => (dragStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (dragStart.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - dragStart.current;
        if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
        dragStart.current = null;
      }}
      className="group/hero relative flex flex-col overflow-hidden bg-[#0b3218] text-[#FCF7EA] lg:block lg:h-[clamp(470px,42vw,620px)]"
    >
      <div aria-hidden className="pattern-geometric hero-pattern absolute inset-0 opacity-[0.09]" />

      <HeroStage
        art={artFor(slide.imageUrl)}
        artKey={slide.id}
        customImage={slide.imageUrl}
        alt={slide.titleBn}
        leaving={previous === null ? null : { art: artFor(slides[previous].imageUrl), key: slides[previous].id, customImage: slides[previous].imageUrl }}
      />

      <Corner className="left-0" />
      <Corner className="right-0 -scale-x-100" />

      <div className="shell relative z-10 order-1 pb-5 pt-9 lg:pointer-events-none lg:flex lg:h-full lg:items-center lg:py-0">
        <div key={slide.id} aria-live={paused ? "polite" : "off"} className="w-full text-center lg:pointer-events-auto lg:w-[40%] lg:pl-[clamp(6px,1.6vw,28px)] lg:text-left">
          <p className="hero-fade flex items-center justify-center gap-3 text-[clamp(14px,1.45vw,21px)] font-semibold text-[#EACB85] lg:justify-start">
            <span aria-hidden className="hero-line h-px w-9 shrink-0 bg-[#B68A3E]" />
            {slide.badgeBn}
            <span aria-hidden className="hero-line h-px w-9 shrink-0 bg-[#B68A3E]" />
          </p>
          <h1 className="mt-2 font-bold [filter:drop-shadow(0_3px_8px_rgba(0,0,0,0.5))]">
            <span className="block text-balance text-[clamp(32px,4.1vw,62px)] leading-[1.24] text-[#F7E2AC]">
              <Words text={slide.titleBn} from={120} />
            </span>
            <span className={`block text-balance leading-[1.3] ${shortSubtitle ? "text-[clamp(32px,4.1vw,62px)] text-[#F7E2AC]" : "mt-1 text-[clamp(19px,2.1vw,31px)] text-white"}`}>
              <Words text={slide.subtitleBn} from={320} />
            </span>
          </h1>
          <p className="hero-fade mx-auto mt-3 max-w-[24em] text-balance text-[clamp(14px,1.35vw,20px)] leading-relaxed text-[#FCF7EA]/90 [animation-delay:620ms] [text-shadow:0_2px_6px_rgba(0,0,0,0.6)] lg:mx-0">
            {slide.descriptionBn}
          </p>
          <div className="hero-fade mt-5 [animation-delay:760ms]">
            <Link href={slide.ctaLink || "/shop"} className="gold-button shine shine-auto group !rounded-full px-8 py-2.5 text-[clamp(15px,1.35vw,20px)]">
              {slide.ctaTextBn}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => show(current - 1)} aria-label="আগের স্লাইড" className={`${arrow} left-3`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button type="button" onClick={() => show(current + 1)} aria-label="পরের স্লাইড" className={`${arrow} right-3`}>
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-2.5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#B68A3E]/40 bg-[#041B0C]/60 px-2 py-1 backdrop-blur-sm">
            {slides.map((s, i) => (
              <button key={s.id} type="button" onClick={() => show(i)} aria-label={`স্লাইড ${i + 1}`} aria-current={i === current} className="p-[5px]">
                <span className={`relative block h-2 overflow-hidden rounded-full transition-all duration-500 ${i === current ? "w-9 bg-white/25" : "w-2 bg-white/55 hover:bg-white"}`}>
                  {i === current && (
                    <span
                      key={`${s.id}-${paused}`}
                      className={`absolute inset-0 origin-left rounded-full bg-[#EACB85] ${paused ? "" : "hero-progress"}`}
                      style={paused ? undefined : { animationDuration: `${DURATION}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStopped((v) => !v)}
              aria-label={stopped ? "স্লাইড চালু করুন" : "স্লাইড থামান"}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-[#F7E2AC] hover:bg-white/10"
            >
              {stopped ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <span className="hidden pr-1 text-[11px] font-semibold text-[#F7E2AC] sm:inline">
              {toBengaliNumber(current + 1)}/{toBengaliNumber(count)}
            </span>
          </div>
        </>
      )}
      <div className="gold-line absolute inset-x-0 bottom-0 z-20" />
    </section>
  );
}
