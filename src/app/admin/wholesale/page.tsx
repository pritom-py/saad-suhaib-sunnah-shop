import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Building2, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminWholesalePage() {
  await requireAdmin();
  const inquiries = await prisma.wholesaleInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const handleUpdateStatus = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    await prisma.wholesaleInquiry.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/wholesale");
  };

  return (
    <div className="space-y-6 font-bengali">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">পাইকারি ও প্রাতিষ্ঠানিক অনুসন্ধান</h1>
          <p className="text-xs text-gray-500">
            মসজিদ, মাদ্রাসা ও পাইকারি ক্রেতাদের আবেদন ও কোটেশন প্রস্তুতি
          </p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            বর্তমানে কোনো নতুন পাইকারি অনুসন্ধান নেই।
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base">
                      {inq.customerName}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {inq.institutionName || "স্বতন্ত্র পাইকারি ক্রেতা"} • {inq.district}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inq.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : inq.status === "QUOTATION_PREPARED"
                        ? "bg-blue-100 text-blue-800"
                        : inq.status === "CONTACTED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-[#FBF7EC]/60 p-3.5 rounded-xl border border-gold/40">
                  <div className="flex items-center gap-2 text-primary">
                    <Phone className="w-4 h-4 text-gold" />
                    <span>ফোন: <strong className="font-sans">{inq.phone}</strong></span>
                    {inq.whatsapp && (
                      <span className="text-emerald-700">(হোয়াটসঅ্যাপ: {inq.whatsapp})</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">ঠিকানা: </span>
                    <span className="font-medium">{inq.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">তারিখ: </span>
                    <span className="font-sans font-medium">
                      {new Date(inq.createdAt).toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <div>
                    <strong className="text-primary block">প্রয়োজনীয় পণ্যের তালিকা:</strong>
                    <p className="text-gray-700 mt-0.5">{inq.productDetails}</p>
                  </div>
                  <div>
                    <strong className="text-primary">আনুমানিক পরিমাণ: </strong>
                    <span className="text-maroon font-bold font-sans">{inq.quantityNeeded}</span>
                  </div>
                  {inq.additionalNotes && (
                    <div>
                      <strong className="text-gray-500">নোট: </strong>
                      <span className="italic">{inq.additionalNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${inq.phone.replace(/[^0-9+]/g, "")}`}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>সরাসরি কল দিন</span>
                  </a>

                  {inq.whatsapp && (
                    <a
                      href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      হোয়াটসঅ্যাপ চ্যাট
                    </a>
                  )}
                </div>

                <form action={handleUpdateStatus} className="flex items-center gap-2 w-full sm:w-auto">
                  <input type="hidden" name="id" value={inq.id} />
                  <select
                    name="status"
                    defaultValue={inq.status}
                    className="bg-[#FBF7EC] border border-[#E5D9BD] rounded-lg px-2.5 py-1 text-xs font-bold text-primary focus:outline-none"
                  >
                    <option value="NEW">NEW (নতুন)</option>
                    <option value="CONTACTED">CONTACTED (যোগাযোগ সম্পন্ন)</option>
                    <option value="QUOTATION_PREPARED">QUOTATION_PREPARED (কোটেশন প্রস্তুত)</option>
                    <option value="ACCEPTED">ACCEPTED (অর্ডার গৃহীত)</option>
                    <option value="REJECTED">REJECTED (বাতিল)</option>
                    <option value="COMPLETED">COMPLETED (সম্পন্ন)</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-dark text-ivory text-xs font-bold transition-colors"
                  >
                    আপডেট
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
