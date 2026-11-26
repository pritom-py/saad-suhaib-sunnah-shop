import React from "react";
import { requireAdmin } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import { priceOf } from "@/lib/pricing";
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { deleteProductAction } from "@/actions/admin-products.action";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const where: any = {};

  if (params.q) {
    where.OR = [
      { nameBn: { contains: params.q, mode: 'insensitive' } },
      { nameEn: { contains: params.q, mode: 'insensitive' } },
      { sku: { contains: params.q, mode: 'insensitive' } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6 font-bengali">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">পণ্য ব্যবস্থাপনা (Products)</h1>
          <p className="text-xs text-gray-500">
            মোট {products.length} টি পণ্য নিবন্ধিত রয়েছে
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#063D2B] hover:bg-[#12563D] text-ivory text-xs font-bold shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>নতুন পণ্য যুক্ত করুন</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Link
            href="/admin/products"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              !params.category ? "bg-primary text-ivory" : "bg-gray-100 text-gray-700"
            }`}
          >
            সকল
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/products?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                params.category === c.slug
                  ? "bg-primary text-ivory"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {c.nameBn}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">ছবি ও নাম</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">মূল্য</th>
                <th className="p-3.5">স্টক</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image
                        src={prod.images[0]?.url || "/products/makra-tupi.jpg"}
                        alt={prod.nameBn}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{prod.nameBn}</div>
                      <div className="text-[11px] text-gray-400 font-sans">{prod.nameEn}</div>
                    </div>
                  </td>

                  <td className="p-3.5 font-sans font-bold text-gray-600">{prod.sku}</td>

                  <td className="p-3.5 text-primary font-medium">{prod.category.nameBn}</td>

                  <td className="p-3.5 font-bold text-maroon font-sans text-sm">
                    {formatPrice(priceOf(prod).price, "bn")}
                    {priceOf(prod).original !== null && (
                      <del className="block text-[11px] font-medium text-gray-400">{formatPrice(prod.regularPrice, "bn")}</del>
                    )}
                  </td>

                  <td className="p-3.5 font-sans font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        prod.stockQuantity <= 5
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {prod.stockQuantity} টি
                    </span>
                  </td>

                  <td className="p-3.5">
                    {prod.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> প্রকাশিত
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> ড্রাফট
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        aria-label={`${prod.nameBn} সম্পাদনা করুন`}
                        className="inline-flex items-center gap-1 rounded bg-[#063d2b] px-2 py-1 text-[11px] font-bold text-white"
                      >
                        <Edit2 className="h-3 w-3" /> এডিট
                      </Link>
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold text-[11px]"
                      >
                        ভিউ
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await requireAdmin();
                          await deleteProductAction(prod.id);
                        }}
                      >
                        <button
                          type="submit"
                          title="মুছুন বা আর্কাইভ করুন"
                          className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
