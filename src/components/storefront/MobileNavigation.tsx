"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PackageSearch, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toBengaliNumber } from "@/lib/locale";

/** Phone-only bottom bar. Hidden where it would compete with buying buttons. */
export function MobileNavigation() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  if (pathname.startsWith("/checkout") || pathname.startsWith("/product/")) return null;

  const item = (active: boolean) => `flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] font-semibold ${active ? "text-[#f6d77a]" : "text-[#fffcf3]"}`;

  return (
    <>
      {/* reserves room so the bar never covers the end of the page */}
      <div aria-hidden className="h-[54px] bg-[#001c13] md:hidden" />
      <nav aria-label="মোবাইল মেনু" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d4af37] bg-gradient-to-b from-[#063d2b] to-[#001c13] pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex">
          <Link href="/" className={item(pathname === "/")}>
            <Home className="h-5 w-5" /> হোম
          </Link>
          <Link href="/shop" className={item(pathname === "/shop" || pathname.startsWith("/category"))}>
            <LayoutGrid className="h-5 w-5" /> ক্যাটাগরি
          </Link>
          <button onClick={() => setIsCartOpen(true)} className={item(false)}>
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d3202b] px-1 text-[10px] text-white">
                  {toBengaliNumber(totalItems)}
                </span>
              )}
            </span>
            কার্ট
          </button>
          <Link href="/track-order" className={item(pathname === "/track-order")}>
            <PackageSearch className="h-5 w-5" /> আমার অর্ডার
          </Link>
        </div>
      </nav>
    </>
  );
}
