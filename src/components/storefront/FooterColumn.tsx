"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/** A footer column: collapsible on phones, always open from md up. */
export function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-t border-[#d4af37]/25 md:border-l md:border-t-0 md:border-[#3d7a5c]/70 md:pl-[clamp(14px,2vw,30px)]">
      <h2 className="text-[clamp(16px,1.45vw,21px)] font-bold text-white">
        <span className="hidden md:inline">{title}</span>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between py-3 md:hidden">
          {title}
          <ChevronDown className={`h-5 w-5 text-[#f6d77a] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      <div aria-hidden className="mb-1.5 hidden h-[2px] w-10 [background:var(--gold-gradient)] md:block" />
      <div id={id} className={`${open ? "block pb-3" : "hidden"} md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}
