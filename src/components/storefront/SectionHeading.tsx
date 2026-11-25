import React from "react";

function Side({ flip = false }: { flip?: boolean }) {
  return (
    <span aria-hidden className={`flex flex-1 items-center justify-end gap-1.5 sm:flex-none ${flip ? "-scale-x-100" : ""}`}>
      <span className="h-[2px] w-full max-w-[96px] rounded-full bg-gradient-to-r from-transparent via-[#c69532] to-[#8c5a0a] sm:w-[clamp(44px,7vw,104px)]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/decorations/section-ornament.svg" alt="" width={40} height={28} className="h-6 w-9 shrink-0 sm:h-7 sm:w-10" />
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
        <Side />
        <Tag className="max-w-[72%] text-balance font-bold leading-snug text-[#06341f] text-[clamp(21px,2.3vw,34px)]">
          {title}
        </Tag>
        <Side flip />
      </div>
      {subtitle && <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-[#4f5a53]">{subtitle}</p>}
    </div>
  );
}
