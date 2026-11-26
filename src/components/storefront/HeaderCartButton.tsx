"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toBengaliNumber } from "@/lib/locale";

/** cart control in the header: live item count, opens the cart drawer */
export function HeaderCartButton() {
  const { totalItems, setIsCartOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={`কার্ট খুলুন (${totalItems} টি পণ্য)`}
      className="flex flex-col items-center gap-0.5 text-[#FCF7EA]/90 transition-colors hover:text-[#EACB85]"
    >
      <span className="relative">
        <ShoppingCart className="h-6 w-6 text-[#EACB85]" />
        <span key={totalItems} className={`${totalItems ? "badge-pop " : ""}absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-[#B68A3E] bg-[#710D17] px-1 text-[10px] font-bold text-white`}>
          {toBengaliNumber(totalItems)}
        </span>
      </span>
      <span className="hidden text-xs font-medium sm:inline">কার্ট</span>
    </button>
  );
}
