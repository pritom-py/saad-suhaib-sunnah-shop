"use client";

import React, { useState } from "react";
import { submitWholesaleInquiryAction } from "@/actions/wholesale.action";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-geo";
import { Building2, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function WholesalePage() {
  const [customerName, setCustomerName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [district, setDistrict] = useState("টাঙ্গাইল");
  const [address, setAddress] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim() || !phone.trim() || !address.trim() || !productDetails.trim() || !quantityNeeded.trim()) {
      setErrorMsg("অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await submitWholesaleInquiryAction({
        customerName,
        institutionName,
        phone,
        whatsapp: whatsapp || undefined,
        district,
        address,
        productDetails,
        quantityNeeded,
        additionalNotes: additionalNotes || undefined,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.error || "তথ্য জমা দিতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-ivory min-h-screen py-10 px-4 font-bengali">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <IslamicDivider title="মসজিদ, মাদ্রাসা ও ব্যবসায়ীদের জন্য পাইকারি অর্ডার" />
          <p className="text-xs md:text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
            মসজিদ কমিটি, মাদ্রাসার শিক্ষক-শিক্ষার্থী, ইসলামি বক্তা ও পাইকারি খুচরা ব্যবসায়ীদের জন্য বিশেষ ছাড়ে এবং সুলভ মূল্যে সর্বোচ্চ মানের টুপি, পাগড়ি, রুমাল, তসবিহ ও গিলাফ সরবরাহের নিশ্চয়তা।
          </p>
        </div>

        {/* Benefits Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="premium-card p-5 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">প্রাতিষ্ঠানিক সুবিধা</h3>
            <p className="text-xs text-text-secondary">
              মসজিদ ও মাদ্রাসার জন্য বিশেষ সম্মানজনক ছাড় ও অগ্রাধিকার ডেলিভারি।
            </p>
          </div>

          <div className="premium-card p-5 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-gold-dark flex items-center justify-center mx-auto">
              <span className="font-bold text-sm">৳</span>
            </div>
            <h3 className="font-bold text-primary text-sm">পাইকারি সুলভ মূল্য</h3>
            <p className="text-xs text-text-secondary">
              পণ্য ও পরিমাণ অনুযায়ী পাইকারি মূল্য জানতে ফর্মটি পূরণ করুন।
            </p>
          </div>

          <div className="premium-card p-5 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">সরাসরি পরামর্শ</h3>
            <p className="text-xs text-text-secondary">
              অর্ডারের সাইজ, কালার ও পরিমাণ নিয়ে সরাসরি প্রতিনিধির সাথে পরামর্শের সুযোগ।
            </p>
          </div>
        </div>

        {/* Wholesale Form Card */}
        <div className="premium-card p-6 md:p-10 rounded-3xl shadow-md max-w-2xl mx-auto space-y-6">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-primary">
                আপনার পাইকারি তথ্য সফলভাবে গৃহীত হয়েছে!
              </h2>
              <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                ধন্যবাদ। আমাদের পাইকারি সেলস টিম খুব শীঘ্রই আপনার দেওয়া নম্বরে যোগাযোগ করে বিশেষ কোটেশন ও বিস্তারিত সুবিধা জানাবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-primary border-b border-[#E5D9BD] pb-2">
                পাইকারি অর্ডারের তথ্যাদি জমা দিন
              </h3>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    আপনার নাম <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: মাওলানা আব্দুর রহমান"
                    className="field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    প্রতিষ্ঠান / মাদ্রাসা / দোকানের নাম
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="যেমন: বাইতুস সালাম জামে মসজিদ"
                    className="field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    মোবাইল নম্বর <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="field font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">
                    হোয়াটসঅ্যাপ নম্বর (যদি আলাদা হয়)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="field font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary">জেলা</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
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
                    আনুমানিক পরিমাণ <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    placeholder="যেমন: ১০০ পিস টুপি / ৫ ডজন রুমাল"
                    className="field"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">
                  সম্পূর্ণ ঠিকানা <span className="text-maroon">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="উপজেলা, বাজার/এলাকা বা সম্পূর্ণ ঠিকানা লিখুন..."
                  className="field"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">
                  কোন কোন পণ্য প্রয়োজন? <span className="text-maroon">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  placeholder="যেমন: মাকড়া টুপি ৫০ পিস, নরমাল এসি টুপি ১০০ পিস এবং কোরআনের গিলাফ ২০ পিস প্রয়োজন..."
                  className="field"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">
                  অতিরিক্ত কোনো নোট বা বিশেষ চাহিদা
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="যেমন: আগামী ১০ দিনের মধ্যে ডেলিভারি দরকার"
                  className="field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl btn-emerald font-bold text-sm shadow-md transition-all disabled:bg-gray-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>জমা হচ্ছে...</span>
                  </>
                ) : (
                  <span>পাইকারি তথ্য সাবমিট করুন</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
