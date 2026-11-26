"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { priceOf } from "@/lib/pricing";
import { PriceTag } from "./PriceTag";
import { useCart } from "@/context/CartContext";
import type { ProductCardProps } from "./ProductCard";

export function QuickView({ product, onClose }: { product: ProductCardProps["product"]; onClose: () => void }) {
  const { addItem } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const variants = product.variants || [];
  const [variantId, setVariantId] = useState<string | null>(variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? null);
  const variant = variants.find((v) => v.id === variantId);
  const pricing = priceOf(product, variant?.price);
  const price = pricing.price;
  const priceKnown = product.regularPrice !== null;
  const stock = variant ? variant.stock : product.stockQuantity;
  const image = product.images?.[0]?.url;

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  const add = () => {
    if (!priceKnown || stock <= 0) return;
    addItem({
      productId: product.id,
      variantId: variant?.id ?? null,
      variantName: variant ? `${variant.size || ""} ${variant.color || ""}`.trim() : null,
      sku: variant?.sku || product.sku,
      nameBn: product.nameBn,
      nameEn: product.nameEn,
      price: price as number,
      imageUrl: image,
    });
    onClose();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label={product.nameBn}
      className="m-auto w-[min(92vw,680px)] rounded-2xl border border-[#d4af37] bg-[#fffcf3] p-0 shadow-2xl backdrop:bg-[#001c13]/65 motion-safe:animate-[rise_200ms_ease]"
    >
      <div className="relative grid sm:grid-cols-2">
        <button onClick={onClose} aria-label="বন্ধ করুন" className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-[#063d2b] shadow">
          <X className="h-4 w-4" />
        </button>
        <div className="relative aspect-square bg-[#f7efdc]">{image && <Image src={image} alt={product.nameBn} fill sizes="340px" className="object-cover" />}</div>
        <div className="flex flex-col gap-3 p-5">
          <h2 className="pr-8 text-xl font-bold leading-snug text-[#063d2b]">{product.nameBn}</h2>
          <p className="text-2xl font-bold text-[#780e15]">{priceKnown ? <PriceTag value={pricing} /> : "মূল্য জানতে যোগাযোগ করুন"}</p>
          {product.shortDescBn && <p className="text-sm leading-relaxed text-[#4f5a53]">{product.shortDescBn}</p>}
          {variants.length > 0 && (
            <fieldset>
              <legend className="mb-1.5 text-xs font-bold text-[#063d2b]">সাইজ নির্বাচন করুন</legend>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={v.stock <= 0}
                    aria-pressed={v.id === variantId}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${v.id === variantId ? "border-[#d4af37] bg-[#063d2b] text-white" : "border-[#e3d3a8] bg-white text-[#14201a]"}`}
                  >
                    {v.size || v.color || v.sku}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <button onClick={add} disabled={!priceKnown || stock <= 0} className="btn-emerald h-11 text-sm">
              <ShoppingCart className="h-4 w-4 text-[#f6d77a]" />
              {stock <= 0 ? "স্টক শেষ" : "কার্টে যোগ করুন"}
            </button>
            <Link href={`/product/${product.slug}`} className="text-center text-sm font-bold text-[#063d2b] underline decoration-[#d4af37] underline-offset-4">
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
