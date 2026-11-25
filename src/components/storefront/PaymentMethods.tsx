import React from "react";

export interface PaymentFlags {
  isCodEnabled?: boolean;
  isBkashEnabled?: boolean;
  isNagadEnabled?: boolean;
  isBankEnabled?: boolean;
}

/**
 * Lists only the methods switched on in Admin → Settings. These are brand-coloured text
 * wordmarks: no official logo files have been supplied. They describe manual Send Money /
 * cash options and do not imply an integrated payment gateway.
 */
export function PaymentMethods({ flags }: { flags?: PaymentFlags | null }) {
  const methods = [
    { on: flags?.isBkashEnabled ?? true, label: "bKash", color: "#C2105C", font: "font-sans" },
    { on: flags?.isNagadEnabled ?? true, label: "নগদ", color: "#C8301E", font: "" },
    { on: flags?.isBankEnabled ?? false, label: "ব্যাংক ট্রান্সফার", color: "#00654A", font: "" },
    { on: flags?.isCodEnabled ?? true, label: "ক্যাশ অন ডেলিভারি", color: "#063D2B", font: "" },
  ].filter((m) => m.on);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <span className="text-[13px] font-semibold text-[#fffcf3]">পেমেন্ট মাধ্যম:</span>
      <ul className="flex flex-wrap items-center justify-center rounded-lg border border-[#d4af37] bg-[#fffcf3] px-1.5 py-1 shadow">
        {methods.map((m, i) => (
          <li key={m.label} className={`px-3 text-[15px] font-bold leading-7 ${m.font} ${i ? "border-l border-[#e3d3a8]" : ""}`} style={{ color: m.color }}>
            {m.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
