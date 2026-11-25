import React from "react";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import { verifyPaymentAction } from "@/actions/admin-orders.action";
import { CheckCircle2, XCircle, CreditCard, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  return (
    <div className="space-y-6 font-bengali">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">পেমেন্ট ভেরিফিকেশন (Payments)</h1>
          <p className="text-xs text-gray-500">
            বিকাশ, নগদ ও ব্যাংক পেমেন্টের ট্রানজেকশন যাচাই ও অনুমোদন
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF7EC] text-text-primary uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">তারিখ ও সময়</th>
                <th className="p-3.5">অর্ডার নম্বর</th>
                <th className="p-3.5">পেমেন্ট মাধ্যম</th>
                <th className="p-3.5">টাকার পরিমাণ</th>
                <th className="p-3.5">ট্রানজেকশন আইডি (TrxID)</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 text-gray-500 font-sans text-[11px]">
                    {new Date(p.createdAt).toLocaleString("bn-BD")}
                  </td>

                  <td className="p-3.5">
                    <Link
                      href={`/admin/orders/${p.orderId}`}
                      className="font-bold text-primary hover:underline font-sans"
                    >
                      {p.order.orderNumber}
                    </Link>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold font-sans text-xs ${
                        p.method === "BKASH"
                          ? "bg-[#E2136E]/10 text-[#E2136E]"
                          : p.method === "NAGAD"
                          ? "bg-[#F7941D]/10 text-[#F7941D]"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.method}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-maroon font-sans text-sm">
                    {formatPrice(p.amount, "bn")}
                  </td>

                  <td className="p-3.5 font-bold font-sans text-gray-800">
                    {p.transactionId ? (
                      <span className="bg-gray-100 px-2 py-1 rounded select-all">
                        {p.transactionId}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    {p.status === "PENDING" && (
                      <div className="inline-flex items-center gap-1.5">
                        <form
                          action={async () => {
                            "use server";
                            await requireAdmin();
                            await verifyPaymentAction(p.id, "VERIFIED");
                            revalidatePath("/admin/payments");
                          }}
                        >
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-colors"
                          >
                            অনুমোদন
                          </button>
                        </form>

                        <form
                          action={async () => {
                            "use server";
                            await requireAdmin();
                            await verifyPaymentAction(p.id, "REJECTED", "ভুল ট্রানজেকশন আইডি");
                            revalidatePath("/admin/payments");
                          }}
                        >
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition-colors"
                          >
                            বাতিল
                          </button>
                        </form>
                      </div>
                    )}
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
