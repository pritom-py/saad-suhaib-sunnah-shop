import React from "react";
import { formatPrice, toBengaliNumber } from "@/lib/locale";
import type { Price } from "@/lib/pricing";

/**
 * Price display. With an offer: the offer price large in orange, then the regular price crossed out
 * and the percentage saved.
 */
export function PriceTag({ value, size = "card" }: { value: Price; size?: "card" | "page" }) {
  const page = size === "page";
  const main = page ? "text-[40px] sm:text-5xl" : "text-[clamp(18px,1.8vw,24px)]";

  if (value.original === null) {
    return <span className={`${main} font-bold leading-tight text-[#780e15]`}>{formatPrice(value.price)}</span>;
  }
  return (
    <span className="flex flex-col leading-tight">
      <span className={`${main} font-semibold text-[#F4511E]`}>
        <span className="sr-only">অফার মূল্য </span>
        {formatPrice(value.price)}
      </span>
      <span className={`flex items-center gap-2 ${page ? "mt-0.5 text-lg" : "text-[13px]"}`}>
        <del className="text-[#8a8a8a]">
          <span className="sr-only">নিয়মিত মূল্য </span>
          {formatPrice(value.original)}
        </del>
        {value.percent > 0 && <span className="font-semibold text-[#333333]">-{toBengaliNumber(value.percent)}%</span>}
      </span>
    </span>
  );
}
