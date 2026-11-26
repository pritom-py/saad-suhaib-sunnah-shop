"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, Heart, Loader2, ShoppingCart } from "lucide-react";
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
    isNewArrival?: boolean;
    images?: { url: string; altText?: string | null }[];
    variants?: { id: string; sku: string; size?: string | null; color?: string | null; price?: number | null; stock: number }[];
  };
}

/** favourite marks are remembered in this browser only */
const FAVOURITES = "saad_favourites";
const readFavourites = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES) || "[]");
  } catch {
    return [];
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [navigating, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => setLiked(readFavourites().includes(product.id)), [product.id]);

  const image = product.images?.[0]?.url;
  const hasVariants = !!product.variants?.length;
  const priceKnown = product.regularPrice !== null && product.regularPrice !== undefined;
  const soldOut = product.stockQuantity <= 0;
  const href = `/product/${product.slug}`;

  const toggleFavourite = () => {
    const others = readFavourites().filter((id) => id !== product.id);
    localStorage.setItem(FAVOURITES, JSON.stringify(liked ? others : [...others, product.id]));
    setLiked(!liked);
  };

  const order = () => {
    // a size has to be chosen on the product page, and unpriced items cannot be ordered online
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

  const round = "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#E3D6BC] bg-white/90 shadow-sm";

  return (
    <article className="premium-product-card group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Link href={href} className="shine relative block aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#FCF7EA,#F4EAD7)]">
          {image && (
            <Image
              src={image}
              alt={product.images?.[0]?.altText || product.nameBn}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 17vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-[#041B0C]/60">
              <span className="rounded-md bg-[#710D17] px-3 py-1 text-xs font-bold text-white">স্টক শেষ</span>
            </span>
          )}
        </Link>
        {product.isNewArrival && (
          <span className="absolute left-2 top-2 rounded-md bg-[#EACB85] px-2 py-0.5 text-[11px] font-bold text-[#082B13]">নতুন</span>
        )}
        <button
          type="button"
          onClick={toggleFavourite}
          aria-pressed={liked}
          aria-label={`${product.nameBn} পছন্দ চিহ্নিত করুন`}
          className={`${round} right-2 top-2 text-[#710D17] transition-transform hover:scale-110`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-[#710D17]" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          aria-label={`${product.nameBn} দ্রুত দেখুন`}
          className={`${round} bottom-2 right-2 hidden text-[#082B13] opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 md:flex`}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-3 pt-2 sm:px-4">
        <h3 className="flex min-h-[2.7em] items-center text-[clamp(13.5px,1.3vw,18px)] font-bold leading-[1.35] text-[#14291B]">
          <Link href={href} className="line-clamp-2 hover:text-[#082B13]">{product.nameBn}</Link>
        </h3>
        <p className="mb-2 flex min-h-[1.8em] items-center font-bold leading-none text-[#710D17]">
          {priceKnown ? <span className="text-[clamp(18px,1.8vw,24px)]">{formatPrice(product.regularPrice)}</span> : <span className="text-xs">মূল্য জানতে যোগাযোগ করুন</span>}
        </p>
        <button type="button" onClick={order} disabled={soldOut || navigating} className="btn-emerald shine mt-auto h-10 w-full text-[clamp(12.5px,1.15vw,16px)]">
          {navigating ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4 text-[#EACB85]" /> : <ShoppingCart className="h-4 w-4 shrink-0" />}
          <span aria-live="polite">{soldOut ? "স্টক শেষ" : added ? "যোগ হয়েছে" : !priceKnown ? "বিস্তারিত দেখুন" : hasVariants ? "সাইজ বেছে নিন" : "কার্টে যোগ করুন"}</span>
        </button>
      </div>

      {preview && <QuickView product={product} onClose={() => setPreview(false)} />}
    </article>
  );
}
