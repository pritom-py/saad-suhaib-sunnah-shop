import React from "react";
import { requireAdmin } from "@/lib/auth";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const handleCreateCategory = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const nameBn = formData.get("nameBn") as string;
    const nameEn = formData.get("nameEn") as string;
    const slug = formData.get("slug") as string;
    const imageUrl = (formData.get("imageUrl") as string) || "/products/makra-tupi.jpg";

    await prisma.category.create({
      data: {
        nameBn,
        nameEn,
        slug: slug.toLowerCase().trim(),
        imageUrl,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/");
  };

  return (
    <div className="space-y-6 font-bengali">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">ক্যাটাগরি ব্যবস্থাপনা (Categories)</h1>
          <p className="text-xs text-gray-500">মোট {categories.length} টি ক্যাটাগরি রয়েছে</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Category List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">ছবি ও নাম</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">পণ্য সংখ্যা</th>
                <th className="p-3.5">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image
                        src={cat.imageUrl || "/products/makra-tupi.jpg"}
                        alt={cat.nameBn}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{cat.nameBn}</div>
                      <div className="text-[11px] text-gray-400 font-sans">{cat.nameEn}</div>
                    </div>
                  </td>

                  <td className="p-3.5 font-sans font-bold text-gray-600">{cat.slug}</td>

                  <td className="p-3.5 font-sans font-bold text-primary">
                    {cat._count.products} টি পণ্য
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      সক্রিয়
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Add Category Form (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-primary border-b border-gray-100 pb-2">
            নতুন ক্যাটাগরি তৈরি করুন
          </h3>

          <form action={handleCreateCategory} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">বাংলা নাম</label>
              <input
                type="text"
                name="nameBn"
                required
                placeholder="যেমন: আতর ও লোবান"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">ইংরেজি নাম</label>
              <input
                type="text"
                name="nameEn"
                required
                placeholder="e.g. Attar & Perfumes"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                required
                placeholder="e.g. attar"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary">ছবির পাথ / ইউআরএল</label>
              <input
                type="text"
                name="imageUrl"
                defaultValue="/products/makra-tupi.jpg"
                className="w-full bg-[#FBF7EC]/50 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-[#063D2B] hover:bg-primary-dark text-ivory text-xs font-bold shadow transition-colors"
            >
              ক্যাটাগরি যুক্ত করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
