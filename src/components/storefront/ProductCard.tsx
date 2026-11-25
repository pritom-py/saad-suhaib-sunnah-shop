"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, Loader2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/locale";
import { useCart } from "@/context/CartContext";
import { QuickView } from "./QuickView";

export interface ProductCardProps {
  product: {
    id: string;
    sku: string;
    slug: string;
    nameBn: string;
    nameEn: string;
    shortDescBn?: string | null;
    regularPrice: number | null;
    stockQuantity: number;
    images?: { url: string; altText?: string | null }[];
    variants?: { id: string; sku: string; size?: string | null; color?: string | null; price?: number | null; stock: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [navigating, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const image = product.images?.[0]?.url;
  const hasVariants = !!product.variants?.length;
  const priceKnown = product.regularPrice !== null && product.regularPrice !== undefined;
  const soldOut = product.stockQuantity <= 0;
  const href = `/product/${product.slug}`;

  const order = () => {
    if (!priceKnown || hasVariants) {
      startTransition(() => router.push(href));
      return;
    }
    addItem({
      productId: product.id,
      variantId: null,
      sku: product.sku,
      nameBn: product.nameBn,
      nameEn: product.nameEn,
      price: product.regularPrice as number,
      imageUrl: image,
    });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="premium-product-card group flex h-full flex-col p-[5px] pb-2.5">
      <div className="relative">
        <Link href={href} className="relative block aspect-[5/4] overflow-hidden rounded-[10px] bg-[#f7efdc]">
          {image && (
            <Image
              src={image}
              alt={product.images?.[0]?.altText || product.nameBn}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-[#001c13]/60">
              <span className="rounded-md bg-[#780e15] px-3 py-1 text-xs font-bold text-white">স্টক শেষ</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setPreview(true)}
          aria-label={`${product.nameBn} দ্রুত দেখুন`}
          className="absolute right-1.5 top-1.5 hidden h-8 w-8 items-center justify-center rounded-full border border-[#d4af37] bg-[#fffcf3]/95 text-[#063d2b] opacity-0 shadow transition focus-visible:opacity-100 group-hover:opacity-100 md:flex"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center px-1 pt-1.5 text-center">
        <h3 className="flex min-h-[2.65em] items-center font-bold leading-[1.32] text-[#14201a] text-[clamp(13.5px,1.3vw,19px)]">
          <Link href={href} className="line-clamp-2 text-balance transition-colors hover:text-[#063d2b]">
            {product.nameBn}
          </Link>
        </h3>

        <p className="mb-1.5 mt-0.5 flex min-h-[1.9em] items-center font-bold leading-none text-[#780e15] text-[clamp(18px,1.75vw,26px)]">
          {priceKnown ? formatPrice(product.regularPrice) : <span className="text-xs font-semibold text-[#780e15]">মূল্য জানতে যোগাযোগ করুন</span>}
        </p>

        <button
          onClick={order}
          disabled={soldOut || navigating}
          className="btn-emerald mt-auto h-[clamp(32px,2.9vw,42px)] w-full text-[clamp(13px,1.18vw,17px)] sm:w-[82%]"
        >
          {navigating ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#f6d77a]" />
          ) : added ? (
            <Check className="h-4 w-4 text-[#f6d77a]" />
          ) : (
            <ShoppingCart className="h-[1.1em] w-[1.1em] text-[#fff2c2]" />
          )}
          <span aria-live="polite">{soldOut ? "স্টক শেষ" : added ? "যোগ হয়েছে" : priceKnown ? "অর্ডার করুন" : "বিস্তারিত দেখুন"}</span>
        </button>
      </div>

      {preview && <QuickView product={product} onClose={() => setPreview(false)} />}
    </article>
  );
}
