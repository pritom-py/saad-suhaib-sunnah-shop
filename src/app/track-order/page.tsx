"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrderAction } from "@/actions/tracking.action";
import { formatPrice } from "@/lib/locale";
import {
  Search,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";

// --- Inner component that uses useSearchParams ---
function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMsg("অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই প্রবেশ করান।");
      return;
    }

    setLoading(true);
    try {
      const res = await trackOrderAction(orderNumber, phone);
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setErrorMsg(res.error || "অর্ডার ট্র্যাকিং তথ্য পাওয়া যায়নি।");
      }
    } catch {
      setErrorMsg("তথ্য লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: "PENDING", label: "অর্ডার গৃহীত" },
    { key: "CONFIRMED", label: "অর্ডার নিশ্চিত" },
    { key: "PROCESSING", label: "প্রস্তুত হচ্ছে" },
    { key: "SHIPPED", label: "কুরিয়ারে হস্তান্তর" },
    { key: "DELIVERED", label: "ডেলিভারি সম্পন্ন" },
  ];

  const getStepIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
      case "PACKED":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      case "CANCELLED":
      case "RETURNED":
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="page-ivory min-h-[75vh] py-10 px-4 font-bengali">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <IslamicDivider title="অর্ডার ট্র্যাকিং" />
          <p className="text-xs md:text-sm text-text-secondary mt-1 max-w-lg mx-auto">
            আপনার অর্ডার নম্বর এবং অর্ডারে ব্যবহৃত মোবাইল নম্বর দিয়ে বর্তমান ডেলিভারি স্ট্যাটাস জানুন।
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="premium-card p-6 md:p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">অর্ডার নম্বর</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="যেমন: SS-123456-789"
                  className="field font-sans uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01749160444"
                  className="field font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl btn-emerald font-bold text-sm shadow-md transition-all disabled:bg-gray-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>তথ্য যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-gold" />
                  <span>ট্র্যাক করুন</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Result View */}
        {order && (
          <div className="premium-card p-6 md:p-8 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5D9BD] pb-4">
              <div>
                <span className="text-[11px] text-text-secondary">অর্ডার নম্বর:</span>
                <h3 className="text-xl font-black text-maroon font-sans">
                  {order.orderNumber}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-text-secondary">বর্তমান অবস্থা:</span>
                <div className="text-sm font-extrabold text-primary">
                  {order.status === "DELIVERED"
                    ? "ডেলিভারি সম্পন্ন"
                    : order.status === "SHIPPED"
                    ? "কুরিয়ারে ট্রানজিটে আছে"
                    : order.status === "CANCELLED"
                    ? "বাতিল করা হয়েছে"
                    : "প্রক্রিয়াধীন"}
                </div>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            {order.status !== "CANCELLED" && (
              <div className="py-4">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />

                  {statusSteps.map((step, idx) => {
                    const isPassed = currentStep >= idx;
                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed
                              ? "bg-primary text-gold border-2 border-gold shadow-sm scale-110"
                              : "bg-gray-200 text-gray-500 border border-gray-300"
                          }`}
                        >
                          {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] md:text-xs text-center whitespace-nowrap font-medium ${
                            isPassed ? "text-primary font-bold" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Courier Tracking Info if assigned */}
            {order.trackingNumber && (
              <div className="p-3.5 bg-[#FBF7EC] rounded-xl border border-gold/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold" />
                  <span>কুরিয়ার: <strong>{order.courierName || "সুন্দরবন / স্টিডফাস্ট"}</strong></span>
                </div>
                <div className="font-sans font-bold text-primary">
                  ট্র্যাকিং কোড: {order.trackingNumber}
                </div>
              </div>
            )}

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <p><strong>গ্রাহকের নাম:</strong> {order.guestName}</p>
                <p><strong>মোবাইল নম্বর:</strong> {order.guestPhone}</p>
                <p><strong>ডেলিভারি ঠিকানা:</strong> {order.fullAddress}, {order.upazila}, {order.district}</p>
              </div>
              <div className="text-left md:text-right">
                <p><strong>পেমেন্ট মাধ্যম:</strong> {order.paymentMethod}</p>
                <p><strong>পেমেন্ট স্ট্যাটাস:</strong> {order.paymentStatus}</p>
                <p className="text-sm font-bold text-maroon mt-1">
                  সর্বমোট: {formatPrice(order.totalAmount, "bn")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Page component: wraps content in Suspense for static generation ---
export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center page-ivory">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4A43B]" />
            <p className="font-bengali text-sm text-[#063D2B]">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
