import React from "react";
import { requireAdmin } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/locale";
import { updateOrderStatusAction, updateCourierAction } from "@/actions/admin-orders.action";
import { ArrowLeft, Truck, CheckCircle2, Shield } from "lucide-react";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  const handleStatusUpdate = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const newStatus = formData.get("status") as string;
    const note = formData.get("note") as string;
    await updateOrderStatusAction(order.id, newStatus, note);
    redirect(`/admin/orders/${order.id}`);
  };

  const handleCourierUpdate = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const courierName = formData.get("courierName") as string;
    const trackingNumber = formData.get("trackingNumber") as string;
    await updateCourierAction(order.id, courierName, trackingNumber);
    redirect(`/admin/orders/${order.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-bengali">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-primary flex items-center gap-2">
              <span>অর্ডার বিবরণ:</span>
              <span className="font-sans text-maroon">{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-gray-500">
              তারিখ: {new Date(order.createdAt).toLocaleString("bn-BD")}
            </p>
          </div>
        </div>

        <PrintButton />
      </div>

      {/* Main Grid: Details & Status Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Order Items & Customer Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Address Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-primary border-b border-gray-100 pb-2">
              গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">নাম:</span>
                <span className="font-bold text-gray-800 text-sm">{order.guestName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">ফোন নম্বর:</span>
                <span className="font-bold text-primary font-sans">{order.guestPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 block">ঠিকানা:</span>
                <span className="font-medium text-gray-700">
                  {order.fullAddress}, {order.upazila}, {order.district}
                </span>
              </div>
              {order.orderNotes && (
                <div className="col-span-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <strong>নোট:</strong> {order.orderNotes}
                </div>
              )}
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm text-primary">
              অর্ডারের পণ্যসমূহ ({order.items.length})
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF7EC] font-bold text-text-primary">
                <tr>
                  <th className="p-3">পণ্য</th>
                  <th className="p-3">মূল্য</th>
                  <th className="p-3">পরিমাণ</th>
                  <th className="p-3 text-right">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <div className="font-bold text-gray-800">{item.productNameBn}</div>
                      {item.variantName && (
                        <div className="text-[10px] text-gray-500">{item.variantName}</div>
                      )}
                      <div className="text-[10px] text-gray-400 font-sans">{item.sku}</div>
                    </td>
                    <td className="p-3 font-sans font-bold text-gray-600">
                      {formatPrice(item.unitPrice, "bn")}
                    </td>
                    <td className="p-3 font-sans font-bold text-primary">{item.quantity}</td>
                    <td className="p-3 text-right font-sans font-bold text-maroon">
                      {formatPrice(item.totalPrice, "bn")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-1.5 text-xs text-right">
              <div className="flex justify-between">
                <span className="text-gray-500">উপমোট:</span>
                <span className="font-bold font-sans">{formatPrice(order.subtotal, "bn")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ডেলিভারি চার্জ:</span>
                <span className="font-bold font-sans">{formatPrice(order.deliveryCharge, "bn")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>ছাড় (কুপন):</span>
                  <span className="font-bold font-sans">-{formatPrice(order.discount, "bn")}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-extrabold text-primary">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-base font-black text-maroon font-sans">
                  {formatPrice(order.totalAmount, "bn")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Status Updates & Courier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change Status Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-primary border-b border-gray-100 pb-2">
              অর্ডার স্ট্যাটাস পরিবর্তন
            </h3>

            <form action={handleStatusUpdate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">স্ট্যাটাস</label>
                <select
                  name="status"
                  defaultValue={order.status}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs font-bold text-primary focus:outline-none focus:border-primary"
                >
                  <option value="PENDING">PENDING (অপেক্ষমান)</option>
                  <option value="CONFIRMED">CONFIRMED (নিশ্চিত)</option>
                  <option value="PROCESSING">PROCESSING (প্রস্তুত হচ্ছে)</option>
                  <option value="PACKED">PACKED (প্যাকিং সম্পন্ন)</option>
                  <option value="SHIPPED">SHIPPED (কুরিয়ারে হস্তান্তর)</option>
                  <option value="DELIVERED">DELIVERED (ডেলিভারি সম্পন্ন)</option>
                  <option value="CANCELLED">CANCELLED (বাতিল)</option>
                  <option value="RETURNED">RETURNED (ফেরত)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">স্ট্যাটাস নোট (অভ্যন্তরীণ)</label>
                <input
                  type="text"
                  name="note"
                  placeholder="যেমন: ফোনে কাস্টমার কনফার্ম করেছেন"
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-dark text-ivory text-xs font-bold shadow transition-colors"
              >
                স্ট্যাটাস আপডেট করুন
              </button>
            </form>
          </div>

          {/* Courier Assignment */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-primary border-b border-gray-100 pb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold" />
              <span>কুরিয়ার ও ট্র্যাকিং তথ্য</span>
            </h3>

            <form action={handleCourierUpdate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">কুরিয়ার সার্ভিসের নাম</label>
                <input
                  type="text"
                  name="courierName"
                  defaultValue={order.courierName || "Steadfast Courier"}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ট্র্যাকিং কনসাইনমেন্ট নম্বর</label>
                <input
                  type="text"
                  name="trackingNumber"
                  defaultValue={order.trackingNumber || ""}
                  placeholder="যেমন: ST-12345678"
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#063D2B] hover:bg-primary-light text-ivory text-xs font-bold shadow transition-colors"
              >
                কুরিয়ার ট্র্যাকিং সেভ করুন
              </button>
            </form>
          </div>

          {/* Status History Audit */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-primary border-b border-gray-100 pb-2">
              স্ট্যাটাস ইতিহাস ও অডিট
            </h3>
            <div className="space-y-2 text-xs">
              {order.statusHistory.map((hist) => (
                <div key={hist.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between font-bold text-primary">
                    <span>{hist.status}</span>
                    <span className="text-[10px] text-gray-400 font-sans">
                      {new Date(hist.createdAt).toLocaleString("bn-BD")}
                    </span>
                  </div>
                  {hist.note && <div className="text-gray-600 mt-1">{hist.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
