import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createProductAction } from "@/actions/admin-products.action";
import { isValidOffer } from "@/lib/pricing";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { displayOrder: "asc" } });

  const handleCreate = async (formData: FormData) => {
    "use server";
    await requireAdmin();

    const nameBn = formData.get("nameBn") as string;
    const nameEn = formData.get("nameEn") as string;
    const sku = formData.get("sku") as string;
    const categoryId = formData.get("categoryId") as string;
    const regularPrice = formData.get("regularPrice") ? Number(formData.get("regularPrice")) : null;
    const wholesalePrice = formData.get("wholesalePrice") ? Number(formData.get("wholesalePrice")) : null;
    const offer = formData.get("salePrice") ? Number(formData.get("salePrice")) : null;
    // an offer that is not below the regular price is not saved
    const salePrice = isValidOffer(regularPrice, offer) ? offer : null;
    const stockQuantity = Number(formData.get("stockQuantity") || 0);
    const shortDescBn = formData.get("shortDescBn") as string;
    const descBn = formData.get("descBn") as string;
    const isIslamicCap = formData.get("isIslamicCap") === "on";
    const imageUrl = (formData.get("imageUrl") as string) || "/products/makra-tupi.jpg";

    const res = await createProductAction({
      nameBn,
      nameEn,
      sku,
      slug: sku.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      categoryId,
      regularPrice,
      salePrice,
      wholesalePrice,
      stockQuantity,
      shortDescBn,
      descBn,
      isIslamicCap,
      isPublished: true,
      images: [imageUrl],
    });

    if (res.success) {
      redirect("/admin/products");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-bengali">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-primary">নতুন পণ্য যুক্ত করুন</h1>
          <p className="text-xs text-gray-500">সঠিক তথ্য ও ছবি দিয়ে নতুন পণ্য ক্যাটালগে অন্তর্ভুক্ত করুন</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form action={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">বাংলা নাম *</label>
              <input
                type="text"
                name="nameBn"
                required
                placeholder="যেমন: মাকড়া টুপি"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">ইংরেজি নাম *</label>
              <input
                type="text"
                name="nameEn"
                required
                placeholder="e.g. Makra Tupi"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">SKU (কোড) *</label>
              <input
                type="text"
                name="sku"
                required
                placeholder="যেমন: SS-TUPI-020"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">ক্যাটাগরি *</label>
              <select
                name="categoryId"
                required
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-bold text-primary">অফার মূল্য (৳) — অফার না থাকলে ফাঁকা রাখুন (খুচরা মূল্যের চেয়ে কম হতে হবে)</span>
            <input type="number" name="salePrice" min={0} step="any" className="field" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">খুচরা মূল্য (৳)</label>
              <input
                type="number"
                name="regularPrice"
                placeholder="যেমন: 70"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
              <span className="text-[10px] text-gray-400">ফাঁকা রাখলে "মূল্য জানতে যোগাযোগ করুন" দেখাবে</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">পাইকারি মূল্য (৳)</label>
              <input
                type="number"
                name="wholesalePrice"
                placeholder="যেমন: 55"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">স্টক পরিমাণ *</label>
              <input
                type="number"
                name="stockQuantity"
                defaultValue={50}
                required
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary">ছবির পাথ / ইউআরএল</label>
            <input
              type="text"
              name="imageUrl"
              defaultValue="/products/makra-tupi.jpg"
              placeholder="/products/your-image.jpg"
              className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary">সংক্ষিপ্ত বিবরণ</label>
            <input
              type="text"
              name="shortDescBn"
              placeholder="এক লাইনে পণ্যের মূল বৈশিষ্ট্য..."
              className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary">বিস্তারিত বিবরণ</label>
            <textarea
              name="descBn"
              rows={3}
              placeholder="পণ্যের উপাদান, মাপ ও বৈশিষ্ট্য বিস্তারিত লিখুন..."
              className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isIslamicCap"
              name="isIslamicCap"
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="isIslamicCap" className="text-xs font-bold text-primary">
              এটি একটি ইসলামি টুপি (টুপির বিশেষ সংগ্রহ সেকশনে প্রদর্শন করুন)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#063D2B] hover:bg-[#12563D] text-ivory text-xs md:text-sm font-bold shadow transition-colors"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>পণ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
