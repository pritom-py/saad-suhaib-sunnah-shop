import React from "react";

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <span aria-hidden className={`flex flex-1 items-center justify-end gap-2 sm:flex-none ${flip ? "-scale-x-100" : ""}`}>
      <span className="flourish-line h-px w-full bg-gradient-to-r from-transparent to-[#B68A3E] sm:w-24" />
      <span className="flourish-gem h-2 w-2 shrink-0 rotate-45 border border-[#B68A3E]" />
      <span className="flourish-gem h-1.5 w-1.5 shrink-0 rotate-45 bg-[#B68A3E]" />
    </span>
  );
}

/** Centred section heading with the gold flourishes of the approved design. */
export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7 sm:gap-4">
      <Flourish />
      <h2 className="shrink-0 text-center text-[clamp(22px,2.4vw,34px)] font-bold leading-snug text-[#082B13]">{title}</h2>
      <Flourish flip />
    </div>
  );
}
