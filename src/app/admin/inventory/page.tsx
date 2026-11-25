import React from "react";
import { requireAdmin } from "@/lib/auth";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import { adjustInventoryAction } from "@/actions/admin-products.action";
import { AlertTriangle, Plus, Minus, CheckCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { stockQuantity: "asc" },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { displayOrder: "asc" } },
    },
  });

  const lowStockCount = products.filter((p) => p.stockQuantity <= 10).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity <= 0).length;

  return (
    <div className="space-y-6 font-bengali">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">ইনভেন্টরি ও স্টক ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">
            রিয়েল-টাইম স্টক লেভেল পর্যবেক্ষণ এবং তাৎক্ষণিক স্টক বৃদ্ধি বা সমন্বয়
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-bold">মোট নিবন্ধিত পণ্য</div>
          <div className="text-2xl font-black text-primary font-sans mt-1">{products.length} টি</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
          <div className="text-xs text-amber-700 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>লো-স্টক সতর্কতা (১০ বা তার কম)</span>
          </div>
          <div className="text-2xl font-black text-amber-600 font-sans mt-1">{lowStockCount} টি</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="text-xs text-red-700 font-bold">স্টক শেষ (Out of Stock)</div>
          <div className="text-2xl font-black text-red-600 font-sans mt-1">{outOfStockCount} টি</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">পণ্য ও ছবি</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">বর্তমান স্টক</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">দ্রুত স্টক সমন্বয় (+ / -)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image
                        src={p.images[0]?.url || "/products/makra-tupi.jpg"}
                        alt={p.nameBn}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{p.nameBn}</div>
                      <div className="text-[10px] text-gray-400 font-sans">{p.nameEn}</div>
                    </div>
                  </td>

                  <td className="p-3.5 font-sans font-bold text-gray-600">{p.sku}</td>

                  <td className="p-3.5 text-primary font-medium">{p.category.nameBn}</td>

                  <td className="p-3.5 font-bold font-sans text-base">
                    <span
                      className={`px-2.5 py-1 rounded-lg ${
                        p.stockQuantity <= 0
                          ? "bg-red-100 text-red-800"
                          : p.stockQuantity <= 10
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.stockQuantity}
                    </span>
                  </td>

                  <td className="p-3.5">
                    {p.stockQuantity <= 0 ? (
                      <span className="font-bold text-red-600">স্টক শেষ</span>
                    ) : p.stockQuantity <= 10 ? (
                      <span className="font-bold text-amber-600">লো-স্টক</span>
                    ) : (
                      <span className="font-bold text-emerald-700">পর্যাপ্ত স্টক</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {/* +10 Button */}
                      <form
                        action={async () => {
                          "use server";
                          await requireAdmin();
                          await adjustInventoryAction(p.id, null, 10, "নতুন স্টক সংযোজন");
                          revalidatePath("/admin/inventory");
                        }}
                      >
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          +১০
                        </button>
                      </form>

                      {/* +50 Button */}
                      <form
                        action={async () => {
                          "use server";
                          await requireAdmin();
                          await adjustInventoryAction(p.id, null, 50, "পাইকারি স্টক বৃদ্ধি");
                          revalidatePath("/admin/inventory");
                        }}
                      >
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          +৫০
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
