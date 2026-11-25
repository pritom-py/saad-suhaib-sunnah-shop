import React from "react";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import { Eye, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const where: any = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.q) {
    where.OR = [
      { orderNumber: { contains: params.q } },
      { guestPhone: { contains: params.q } },
      { guestName: { contains: params.q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const statuses = [
    { key: "", label: "সকল অর্ডার" },
    { key: "PENDING", label: "অপেক্ষমান" },
    { key: "CONFIRMED", label: "নিশ্চিত" },
    { key: "PROCESSING", label: "প্রস্তুত হচ্ছে" },
    { key: "SHIPPED", label: "কুরিয়ারে হস্তান্তর" },
    { key: "DELIVERED", label: "ডেলিভারি সম্পন্ন" },
    { key: "CANCELLED", label: "বাতিল" },
  ];

  return (
    <div className="space-y-6 font-bengali">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">অর্ডার ব্যবস্থাপনা (Orders)</h1>
          <p className="text-xs text-gray-500">মোট {orders.length} টি অর্ডার পাওয়া গেছে</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((s) => (
          <Link
            key={s.key}
            href={s.key ? `/admin/orders?status=${s.key}` : "/admin/orders"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              (params.status || "") === s.key
                ? "bg-primary text-ivory shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">অর্ডার নম্বর ও তারিখ</th>
                <th className="p-3.5">গ্রাহকের নাম ও ফোন</th>
                <th className="p-3.5">ডেলিভারি জেলা</th>
                <th className="p-3.5">পণ্য সংখ্যা</th>
                <th className="p-3.5">মোট প্রদেয়</th>
                <th className="p-3.5">পেমেন্ট</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold font-sans text-primary text-sm">{o.orderNumber}</div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("bn-BD")}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-gray-800">{o.guestName}</div>
                    <div className="font-sans text-[11px] text-gray-500">{o.guestPhone}</div>
                  </td>

                  <td className="p-3.5 text-gray-600">{o.district}</td>

                  <td className="p-3.5 font-bold font-sans text-primary">
                    {o.items.reduce((acc, i) => acc + i.quantity, 0)} টি
                  </td>

                  <td className="p-3.5 font-bold text-maroon font-sans text-sm">
                    {formatPrice(o.totalAmount, "bn")}
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-gray-800 text-[11px]">{o.paymentMethod}</div>
                    <span
                      className={`text-[10px] font-bold ${
                        o.paymentStatus === "PAID"
                          ? "text-emerald-700"
                          : o.paymentStatus === "REJECTED"
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : o.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#063D2B] hover:bg-primary-light text-ivory text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold" />
                      <span>বিস্তারিত</span>
                    </Link>
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
