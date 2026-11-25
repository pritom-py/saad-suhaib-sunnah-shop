"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-geo";
import { formatPrice } from "@/lib/locale";
import { createOrderAction } from "@/actions/checkout.action";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export interface CheckoutConfig {
  insideDhakaRate: number;
  outsideDhakaRate: number;
  bkashNumber: string;
  nagadNumber: string;
  isCodEnabled: boolean;
  isBkashEnabled: boolean;
  isNagadEnabled: boolean;
  phone: string;
}

const toBn = (n: number) => formatPrice(n, "bn");

export function CheckoutForm({ config }: { config: CheckoutConfig }) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("ঢাকা");
  const [upazila, setUpazila] = useState("মিরপুর");
  const [fullAddress, setFullAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"INSIDE_DHAKA" | "OUTSIDE_DHAKA">(
    "INSIDE_DHAKA"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "BKASH" | "NAGAD" | "BANK_TRANSFER"
  >(config.isCodEnabled ? "COD" : config.isBkashEnabled ? "BKASH" : "NAGAD");
  const [senderAccount, setSenderAccount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delivery charge calculation
  const deliveryCharge = deliveryZone === "INSIDE_DHAKA" ? config.insideDhakaRate : config.outsideDhakaRate;
  const totalAmount = subtotal + deliveryCharge;

  // Selected district's upazilas
  const selectedDistrictObj = BANGLADESH_DISTRICTS.find(
    (d) => d.nameBn === district || d.nameEn.toLowerCase() === district.toLowerCase()
  );

  const handleDistrictChange = (dNameBn: string) => {
    setDistrict(dNameBn);
    const found = BANGLADESH_DISTRICTS.find((d) => d.nameBn === dNameBn);
    if (found && found.upazilas.length > 0) {
      setUpazila(found.upazilas[0].nameBn);
    }
    if (dNameBn === "ঢাকা") {
      setDeliveryZone("INSIDE_DHAKA");
    } else {
      setDeliveryZone("OUTSIDE_DHAKA");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("আপনার কার্ট খালি। অনুগ্রহ করে পণ্য নির্বাচন করুন।");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !district.trim() || !fullAddress.trim()) {
      setErrorMsg("অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।");
      return;
    }

    if (
      (paymentMethod === "BKASH" || paymentMethod === "NAGAD") &&
      !transactionId.trim()
    ) {
      setErrorMsg("অনুগ্রহ করে আপনার পেমেন্টের ট্রানজেকশন আইডি (TrxID) লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
      }));

      const payload = {
        fullName,
        phone,
        altPhone: altPhone || undefined,
        email: email || undefined,
        district,
        upazila,
        fullAddress,
        orderNotes: orderNotes || undefined,
        deliveryZone,
        paymentMethod,
        couponCode: couponCode || undefined,
        senderAccount: senderAccount || undefined,
        transactionId: transactionId || undefined,
      };

      const res = await createOrderAction(payload, orderItems);

      if (res.success && res.orderNumber) {
        clearCart();
        router.push(`/order-success?orderNumber=${res.orderNumber}`);
      } else {
        setErrorMsg(res.error || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "অপ্রত্যাশিত ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 font-bengali text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cream text-primary flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-primary">আপনার কার্ট বর্তমানে খালি</h2>
        <p className="text-xs text-text-secondary">
          অর্ডার সম্পন্ন করতে প্রথমে আপনার পছন্দের পণ্য কার্টে যুক্ত করুন।
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 rounded-lg btn-emerald text-xs transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পণ্য ক্যাটালগে যান</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-ivory min-h-screen py-8 px-4 font-bengali">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
            অর্ডার নিশ্চিতকরণ ও চেকআউট
          </h1>
          <p className="text-xs md:text-sm text-text-secondary">
            কোনো অ্যাকাউন্ট ছাড়াই সহজ ও দ্রুত অর্ডারের ব্যবস্থা। সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs md:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery & Customer Info (7 cols) */}
          <div className="lg:col-span-7 premium-card p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            {/* Step 1: Customer Details */}
            <div className="space-y-4">
              <h2 className="text-base md:text-lg font-bold text-primary border-b border-[#E5D9BD] pb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-ivory text-xs flex items-center justify-center font-sans">
                  ১
                </span>
                <span>গ্রাহকের ঠিকানা ও তথ্য</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    আপনার পূর্ণ নাম <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: হাফেজ মোঃ আব্দুল্লাহ"
                    className="field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    মোবাইল নম্বর <span className="text-maroon">*</span>
                  </label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="যেমন: 018XXXXXXXX"
                    className="field font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="field font-sans"
                  />
                </div>
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    জেলা <span className="text-maroon">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="field"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.nameBn}>
                        {d.nameBn} ({d.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    উপজেলা / থানা <span className="text-maroon">*</span>
                  </label>
                  {selectedDistrictObj && selectedDistrictObj.upazilas.length > 0 ? (
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="field"
                    >
                      {selectedDistrictObj.upazilas.map((u, idx) => (
                        <option key={idx} value={u.nameBn}>
                          {u.nameBn} ({u.nameEn})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      placeholder="উপজেলা বা থানার নাম"
                      className="field"
                    />
                  )}
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">
                  সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-maroon">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="বাড়ি/হোল্ডিং নম্বর, রোড, এলাকা বা গ্রামের নাম বিস্তারিত লিখুন..."
                  className="field"
                />
              </div>

              {/* Order Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">
                  অর্ডার সংক্রান্ত বিশেষ নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="যেমন: নামাজের পর ডেলিভারি দিলে ভালো হয়"
                  className="field"
                />
              </div>
            </div>

            {/* Step 2: Delivery Zone */}
            <div className="space-y-3 pt-2">
              <h2 className="text-base md:text-lg font-bold text-primary border-b border-[#E5D9BD] pb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-ivory text-xs flex items-center justify-center font-sans">
                  ২
                </span>
                <span>ডেলিভারি এলাকা ও চার্জ</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryZone === "INSIDE_DHAKA"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#E5D9BD] hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "INSIDE_DHAKA"}
                      onChange={() => setDeliveryZone("INSIDE_DHAKA")}
                      className="accent-primary w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-primary">ঢাকার ভিতরে</div>
                      <div className="text-[11px] text-text-secondary">হোম ডেলিভারি (২-৩ দিন)</div>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-maroon">{toBn(config.insideDhakaRate)}</span>
                </label>

                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryZone === "OUTSIDE_DHAKA"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#E5D9BD] hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "OUTSIDE_DHAKA"}
                      onChange={() => setDeliveryZone("OUTSIDE_DHAKA")}
                      className="accent-primary w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-primary">ঢাকার বাইরে</div>
                      <div className="text-[11px] text-text-secondary">হোম / কুরিয়ার ডেলিভারি (৩-৫ দিন)</div>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-maroon">{toBn(config.outsideDhakaRate)}</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-3 pt-2">
              <h2 className="text-base md:text-lg font-bold text-primary border-b border-[#E5D9BD] pb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-ivory text-xs flex items-center justify-center font-sans">
                  ৩
                </span>
                <span>পেমেন্ট মাধ্যম নির্বাচন করুন</span>
              </h2>

              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                {config.isCodEnabled && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#E5D9BD] hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-primary w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="text-xs md:text-sm font-bold text-primary">
                      ক্যাশ অন ডেলিভারি (Cash on Delivery)
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      পণ্য হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন।
                    </div>
                  </div>
                </label>
                )}

                {/* bKash */}
                {config.isBkashEnabled && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "BKASH"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#E5D9BD] hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "BKASH"}
                    onChange={() => setPaymentMethod("BKASH")}
                    className="accent-primary w-4 h-4 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs md:text-sm font-bold text-primary">
                        বিকাশ (bKash Send Money)
                      </div>
                      <span className="bg-[#E2136E] text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded">
                        bKash
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      আমাদের বিকাশ নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি দিন।
                    </div>

                    {paymentMethod === "BKASH" && (
                      <div className="mt-3 p-3 premium-card rounded-lg space-y-2 text-xs">
                        <p className="text-text-primary">
                          বিকাশ নম্বর: <strong className="font-sans text-primary">{config.bkashNumber}</strong>
                        </p>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="TrxID (ট্রানজেকশন আইডি লিখুন)"
                          className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded px-3 py-1.5 text-xs font-sans text-primary uppercase"
                        />
                      </div>
                    )}
                  </div>
                </label>
                )}

                {/* Nagad */}
                {config.isNagadEnabled && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "NAGAD"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#E5D9BD] hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "NAGAD"}
                    onChange={() => setPaymentMethod("NAGAD")}
                    className="accent-primary w-4 h-4 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs md:text-sm font-bold text-primary">
                        নগদ (Nagad Send Money)
                      </div>
                      <span className="bg-[#F7941D] text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded">
                        Nagad
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      আমাদের নগদ নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি দিন।
                    </div>

                    {paymentMethod === "NAGAD" && (
                      <div className="mt-3 p-3 premium-card rounded-lg space-y-2 text-xs">
                        <p className="text-text-primary">
                          নগদ নম্বর: <strong className="font-sans text-primary">{config.nagadNumber}</strong>
                        </p>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="TrxID (ট্রানজেকশন আইডি লিখুন)"
                          className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded px-3 py-1.5 text-xs font-sans text-primary uppercase"
                        />
                      </div>
                    )}
                  </div>
                </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 premium-card p-6 rounded-2xl shadow-sm space-y-5 sticky top-20">
            <h2 className="text-base font-bold text-primary border-b border-[#E5D9BD] pb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <span>অর্ডারের বিবরণ ({items.length})</span>
            </h2>

            {/* Items List */}
            <div className="space-y-3 divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "base"}`}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-12 h-12 rounded-lg bg-[#F5EFDF] border border-[#E5D9BD] overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/products/makra-tupi.jpg"}
                        alt={item.nameBn}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary line-clamp-1">{item.nameBn}</h4>
                      {item.variantName && (
                        <span className="text-[10px] text-text-secondary">
                          {item.variantName}
                        </span>
                      )}
                      <div className="text-[11px] text-text-secondary">
                        {formatPrice(item.price, "bn")} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-primary font-sans">
                    {formatPrice(item.price * item.quantity, "bn")}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="space-y-1">
              <label htmlFor="coupon" className="text-xs font-bold text-primary">কুপন কোড (ঐচ্ছিক)</label>
              <input
                id="coupon"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="যেমন: SUNNAH10"
                className="field font-sans uppercase"
              />
              <p className="text-[11px] text-text-secondary">কুপনের শর্ত পূরণ হলে অর্ডার নিশ্চিত করার সময় ছাড় যুক্ত হবে।</p>
            </div>

            {/* Calculations */}
            <div className="border-t border-[#E5D9BD] pt-4 space-y-2 text-xs md:text-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span>উপমোট (Subtotal):</span>
                <span className="font-bold text-text-primary">{formatPrice(subtotal, "bn")}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-text-primary">{formatPrice(deliveryCharge, "bn")}</span>
              </div>
              <div className="border-t border-dashed border-[#E5D9BD] pt-2 flex items-center justify-between text-base font-extrabold text-primary">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-xl text-maroon font-black">{formatPrice(totalAmount, "bn")}</span>
              </div>
            </div>

            {/* Primary Order Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className="gold-button group w-full py-3.5 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin " />
                  <span>অর্ডার প্রস্তুত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>অর্ডার নিশ্চিত করুন</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-text-secondary text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>আপনার তথ্য শুধু অর্ডার ডেলিভারির কাজে ব্যবহৃত হয়।</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
