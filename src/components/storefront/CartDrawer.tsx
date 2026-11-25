"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, toBengaliNumber } from "@/lib/locale";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsCartOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
    // setIsCartOpen is a stable state setter
  }, [isCartOpen, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="শপিং কার্ট">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-[#001c13]/60" />
          <motion.div
            initial={{ x: reduceMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 flex w-[min(100vw-40px,420px)] flex-col bg-[#fffcf3] shadow-2xl"
          >
            <div className="emerald-surface flex items-center justify-between p-4 text-[#fffcf3]">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ShoppingBag className="h-5 w-5 text-[#f6d77a]" /> শপিং কার্ট ({toBengaliNumber(totalItems)})
              </h2>
              <button ref={closeRef} onClick={() => setIsCartOpen(false)} className="rounded-full p-1.5 transition hover:bg-white/15" aria-label="কার্ট বন্ধ করুন">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="gold-line" />

            <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
              {items.length === 0 ? (
                <div className="space-y-4 py-16 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] bg-[#f7efdc] text-[#063d2b]">
                    <ShoppingBag className="h-8 w-8" />
                  </span>
                  <p className="text-sm font-semibold text-[#4f5a53]">আপনার কার্ট বর্তমানে খালি আছে</p>
                  <Link href="/shop" onClick={() => setIsCartOpen(false)} className="btn-emerald px-5 py-2 text-sm">
                    পণ্য দেখুন
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || "base"}`} className="premium-card flex items-center gap-3 !rounded-xl p-2.5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#e3d3a8] bg-[#f7efdc]">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.nameBn} fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-[#14201a]">{item.nameBn}</h3>
                      {item.variantName && <p className="truncate text-[11px] text-[#4f5a53]">সাইজ: {item.variantName}</p>}
                      <p className="text-sm font-bold text-[#780e15]">{formatPrice(item.price)}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-[#e3d3a8] bg-white">
                          <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-1.5 hover:bg-[#f7efdc]" aria-label="পরিমাণ কমান">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold text-[#063d2b]">{toBengaliNumber(item.quantity)}</span>
                          <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-1.5 hover:bg-[#f7efdc]" aria-label="পরিমাণ বাড়ান">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.productId, item.variantId)} className="p-1.5 text-[#a42127] hover:text-[#490609]" aria-label={`${item.nameBn} সরান`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-right text-sm font-bold text-[#063d2b]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-[#d4af37]/50 bg-[#f7efdc] p-4">
                <div className="flex items-center justify-between font-bold">
                  <span>উপমোট:</span>
                  <span className="text-xl text-[#780e15]">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-[#4f5a53]">ডেলিভারি চার্জ চেকআউটের সময় জেলা অনুযায়ী যুক্ত হবে।</p>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="gold-button w-full py-3">
                  অর্ডারে এগিয়ে যান <ArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={() => setIsCartOpen(false)} className="w-full py-1 text-center text-sm font-semibold text-[#063d2b]">
                  আরও কেনাকাটা করুন
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
