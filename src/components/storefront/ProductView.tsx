"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Truck, Phone, FileText, Plus, Minus, Check } from "lucide-react";
import { formatPrice, toBengaliNumber } from "@/lib/locale";
import { useCart } from "@/context/CartContext";
import { WhatsAppIcon } from "./BrandIcons";
import { priceOf } from "@/lib/pricing";
import { PriceTag } from "./PriceTag";

export interface ProductViewProps {
  product: {
    id: string;
    sku: string;
    nameBn: string;
    nameEn: string;
    regularPrice: number | null;
    salePrice?: number | null;
    stockQuantity: number;
    shortDescBn?: string | null;
    category: { nameBn: string; slug: string };
    images: { url: string; altText?: string | null }[];
    variants: {
      id: string;
      sku: string;
      size?: string | null;
      color?: string | null;
      price?: number | null;
      stock: number;
    }[];
  };
  whatsappUrl?: string;
  phone?: string;
  delivery?: { inside: number; outside: number };
}

export function ProductView({
  product,
  whatsappUrl = "https://wa.me/8801749160444",
  phone = "+880 1749160444",
  delivery = { inside: 70, outside: 130 },
}: ProductViewProps) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url);
  const [variantId, setVariantId] = useState<string | null>(
    product.variants.find((v) => v.stock > 0)?.id ?? product.variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const priceKnown = product.regularPrice !== null && product.regularPrice !== undefined;
  const pricing = priceOf(product, variant?.price);
  const currentPrice = pricing.price;
  const currentStock = variant ? variant.stock : product.stockQuantity;
  const soldOut = currentStock <= 0;
  const blocked = !priceKnown || soldOut;

  const addToCart = () => {
    if (blocked) return;
    addItem(
      {
        productId: product.id,
        variantId: variant?.id || null,
        variantName: variant ? `${variant.size || ""} ${variant.color || ""}`.trim() : null,
        sku: variant?.sku || product.sku,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        price: currentPrice as number,
        imageUrl: selectedImage,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const buyNow = () => {
    if (blocked) return;
    addToCart();
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const message = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি সাদ সুহাইব সুন্নাহ শপ থেকে "${product.nameBn}" (SKU: ${product.sku}) সম্পর্কে বিস্তারিত জানতে আগ্রহী।`
  );

  const trackPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* Gallery */}
      <div className="space-y-3 lg:col-span-5">
        <div className="rounded-[20px] border border-[#d4af37] p-1.5 shadow-[var(--premium-shadow)] [background:var(--ivory-gradient)]">
          <div className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-[15px] bg-[#f7efdc]" onMouseMove={trackPointer} onMouseLeave={() => setZoom(null)}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={product.nameBn}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover transition-transform duration-200"
                style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                priority
              />
            )}
            {soldOut && (
              <span className="absolute inset-0 flex items-center justify-center bg-[#001c13]/60">
                <span className="rounded-lg bg-[#780e15] px-4 py-1.5 text-sm font-bold text-white">স্টক শেষ</span>
              </span>
            )}
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto p-0.5">
            {product.images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setSelectedImage(img.url)}
                aria-label={`ছবি ${toBengaliNumber(i + 1)}`}
                aria-pressed={selectedImage === img.url}
                className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition ${selectedImage === img.url ? "border-[#d4af37] shadow-[var(--gold-glow)]" : "border-[#e8dab5] opacity-75 hover:opacity-100"}`}
              >
                <Image src={img.url} alt={img.altText || product.nameBn} fill sizes="72px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="premium-card space-y-4 p-5 sm:p-7 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8dab5] pb-3 text-xs">
          <Link href={`/category/${product.category.slug}`} className="font-bold text-[#063d2b] hover:text-[#780e15]">
            ক্যাটাগরি: {product.category.nameBn}
          </Link>
          <span className="font-sans text-[#5f685f]">SKU: {variant?.sku || product.sku}</span>
        </div>

        <h1 className="text-2xl font-bold leading-snug text-[#063d2b] sm:text-[34px]">{product.nameBn}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decorations/golden-divider.svg" alt="" width={240} height={16} className="w-48" />

        <div className="flex flex-wrap items-center gap-4">
          <p>
            {priceKnown ? <PriceTag value={pricing} size="page" /> : <span className="text-lg font-bold text-[#780e15]">মূল্য জানতে যোগাযোগ করুন</span>}
          </p>
          <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold ${soldOut ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
            {!soldOut && <Check className="h-3.5 w-3.5" />}
            {soldOut ? "স্টক শেষ" : "স্টকে আছে"}
          </span>
        </div>

        {product.shortDescBn && <p className="leading-relaxed text-[#4f5a53]">{product.shortDescBn}</p>}

        {product.variants.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-sm font-bold text-[#063d2b]">সাইজ / ভেরিয়েন্ট নির্বাচন করুন:</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock <= 0}
                  aria-pressed={variantId === v.id}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${variantId === v.id ? "border-[#d4af37] bg-[#063d2b] text-white shadow-[var(--gold-glow)]" : "border-[#e3d3a8] bg-white text-[#14201a] hover:border-[#063d2b]"}`}
                >
                  {v.size || v.color || v.sku}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#063d2b]">পরিমাণ:</span>
          <div className="flex items-center rounded-lg border border-[#e3d3a8] bg-white">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-[#f7efdc]" aria-label="পরিমাণ কমান">
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center font-bold text-[#063d2b]">{toBengaliNumber(quantity)}</span>
            <button onClick={() => setQuantity((q) => Math.min(Math.max(1, currentStock), q + 1))} className="p-2.5 hover:bg-[#f7efdc]" aria-label="পরিমাণ বাড়ান">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={addToCart} disabled={blocked} className="btn-emerald h-12 !rounded-xl">
            {isAdded ? <Check className="h-5 w-5 text-[#f6d77a]" /> : <ShoppingCart className="h-5 w-5 text-[#f6d77a]" />}
            {isAdded ? "কার্টে যোগ হয়েছে!" : "কার্টে যোগ করুন"}
          </button>
          <button onClick={buyNow} disabled={blocked} className="gold-button h-12">
            <Zap className="h-5 w-5" /> এখনই কিনুন
          </button>
        </div>
        <a href={`${whatsappUrl}?text=${message}`} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1f9d55]/50 bg-[#effaf2] text-sm font-bold text-[#075e54] transition hover:bg-[#dff4e5]">
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> হোয়াটসঅ্যাপে এই পণ্য সম্পর্কে জানুন
        </a>

        <ul className="space-y-2 border-t border-[#e8dab5] pt-4 text-sm text-[#37433c]">
          <li className="flex items-start gap-2.5">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#b47b19]" />
            ডেলিভারি চার্জ: ঢাকার ভিতরে {formatPrice(delivery.inside)}, ঢাকার বাইরে {formatPrice(delivery.outside)}
          </li>
          <li className="flex items-start gap-2.5">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#b47b19]" />
            <span>
              <Link href="/delivery-policy" className="font-bold text-[#063d2b] underline underline-offset-4">ডেলিভারি নীতি</Link>
              {" · "}
              <Link href="/return-policy" className="font-bold text-[#063d2b] underline underline-offset-4">রিটার্ন ও এক্সচেঞ্জ নীতি</Link>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#b47b19]" />
            <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="font-sans font-semibold">{phone}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
