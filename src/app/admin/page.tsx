import React from "react";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  Package,
  AlertTriangle,
  Building2,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    products,
    lowStockCount,
    wholesaleInquiries,
    recentOrders,
    payments,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { stockQuantity: { lte: 10 } } }),
    prisma.wholesaleInquiry.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.payment.findMany({
      where: { status: "VERIFIED" },
      select: { amount: true },
    }),
  ]);

  const totalCollectedRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 font-bengali">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary">
            ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            রিয়েল-টাইম বিক্রয়, অর্ডার ও স্টক ব্যবস্থাপনা পরিসংখ্যান
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-ivory text-xs font-bold shadow-sm transition-colors"
          >
            + নতুন পণ্য যুক্ত করুন
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">মোট অর্ডার</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-primary font-sans">
            {totalOrders}
          </div>
          <div className="text-[11px] text-gray-400">সর্বমোট নিবন্ধিত অর্ডার</div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-700 font-bold">অপেক্ষমান অর্ডার</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-600 font-sans">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-amber-600/80">ভেরিফিকেশন প্রয়োজন</div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-bold">সম্পন্ন ডেলিভারি</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 font-sans">
            {deliveredOrders}
          </div>
          <div className="text-[11px] text-emerald-600/80">সফলভাবে প্রাপ্ত</div>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">সংগৃহীত পেমেন্ট</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#063D2B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-maroon font-sans">
            {formatPrice(totalCollectedRevenue, "bn")}
          </div>
          <div className="text-[11px] text-gray-400">ভেরিফাইড পেমেন্ট রাজস্ব</div>
        </div>
      </div>

      {/* Secondary KPI Strip: Products, Low-Stock, Wholesale */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary shadow-sm flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FBF7EC] text-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold">মোট প্রকাশিত পণ্য</div>
              <div className="text-lg font-bold text-primary font-sans">{products} টি</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-400 shadow-sm flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold">লো-স্টক সতর্কতা</div>
              <div className="text-lg font-bold text-amber-600 font-sans">{lowStockCount} টি পণ্য</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link
          href="/admin/wholesale"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary shadow-sm flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold">পাইকারি অনুসন্ধান</div>
              <div className="text-lg font-bold text-primary font-sans">{wholesaleInquiries} টি আবেদন</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-base text-primary">সাম্প্রতিক অর্ডারসমূহ</h3>
          <Link
            href="/admin/orders"
            className="text-xs text-primary hover:text-gold font-bold flex items-center gap-1"
          >
            <span>সকল অর্ডার</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">অর্ডার নম্বর</th>
                <th className="p-3.5">গ্রাহকের নাম ও ফোন</th>
                <th className="p-3.5">ঠিকানা / জেলা</th>
                <th className="p-3.5">মোট মূল্য</th>
                <th className="p-3.5">পেমেন্ট মাধ্যম</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 font-bold font-sans text-primary">
                    {order.orderNumber}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-gray-800">{order.guestName}</div>
                    <div className="font-sans text-gray-500 text-[11px]">{order.guestPhone}</div>
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {order.upazila}, {order.district}
                  </td>
                  <td className="p-3.5 font-bold text-maroon font-sans">
                    {formatPrice(order.totalAmount, "bn")}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-[10px]">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-2.5 py-1 rounded bg-[#063D2B] hover:bg-primary-light text-ivory text-[11px] font-bold transition-colors"
                    >
                      বিস্তারিত
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
