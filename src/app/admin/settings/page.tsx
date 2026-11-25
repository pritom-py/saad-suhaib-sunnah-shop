import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBusinessSettingsAction } from "@/actions/admin-cms.action";
import { Settings, Save, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  const handleUpdate = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const payload = {
      businessNameBn: formData.get("businessNameBn") as string,
      businessNameEn: formData.get("businessNameEn") as string,
      taglineBn: formData.get("taglineBn") as string,
      taglineEn: formData.get("taglineEn") as string,
      announcementBn: formData.get("announcementBn") as string,
      announcementEn: formData.get("announcementEn") as string,
      phoneSupport: formData.get("phoneSupport") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      whatsappUrl: formData.get("whatsappUrl") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      addressBn: formData.get("addressBn") as string,
      addressEn: formData.get("addressEn") as string,
      insideDhakaRate: Number(formData.get("insideDhakaRate") || 70),
      outsideDhakaRate: Number(formData.get("outsideDhakaRate") || 130),
      bkashNumber: formData.get("bkashNumber") as string,
      nagadNumber: formData.get("nagadNumber") as string,
      bankDetails: formData.get("bankDetails") as string,
      isCodEnabled: formData.get("isCodEnabled") === "on",
      isBkashEnabled: formData.get("isBkashEnabled") === "on",
      isNagadEnabled: formData.get("isNagadEnabled") === "on",
      isBankEnabled: formData.get("isBankEnabled") === "on",
    };

    await updateBusinessSettingsAction(payload);
    revalidatePath("/admin/settings");
    revalidatePath("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-bengali">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-primary">ব্যবসা ও সিস্টেম সেটিংস</h1>
        <p className="text-xs text-gray-500">
          ডেলিভারি চার্জ, কাস্টমার সাপোর্ট ফোন নম্বর, বিকাশ ও নগদ নম্বর এবং সাইট সেটিংস কনফিগারেশন
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form action={handleUpdate} className="space-y-6">
          {/* Section 1: Business Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-gray-100 pb-2">
              প্রতিষ্ঠানের নাম ও পরিচয়
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">প্রতিষ্ঠানের নাম (বাংলা)</label>
                <input
                  type="text"
                  name="businessNameBn"
                  defaultValue={settings?.businessNameBn}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">প্রতিষ্ঠানের নাম (ইংরেজি)</label>
                <input
                  type="text"
                  name="businessNameEn"
                  defaultValue={settings?.businessNameEn}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">ট্যাগলাইন / সাবটাইটেল</label>
              <input
                type="text"
                name="taglineBn"
                defaultValue={settings?.taglineBn}
                className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">টপ অ্যানাউন্সমেন্ট বার মেসেজ</label>
              <input
                type="text"
                name="announcementBn"
                defaultValue={settings?.announcementBn}
                className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary border-b border-gray-100 pb-2">
              যোগাযোগ ও সোশ্যাল লিংক
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">কাস্টমার সাপোর্ট ফোন নম্বর</label>
                <input
                  type="text"
                  name="phoneSupport"
                  defaultValue={settings?.phoneSupport}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">হোয়াটসঅ্যাপ লিংক</label>
                <input
                  type="text"
                  name="whatsappUrl"
                  defaultValue={settings?.whatsappUrl}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">অফিস / কারখানা ঠিকানা</label>
              <input
                type="text"
                name="addressBn"
                defaultValue={settings?.addressBn || ""}
                className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section 3: Delivery Charges */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary border-b border-gray-100 pb-2">
              ডেলিভারি চার্জ কনফিগারেশন
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ঢাকার ভিতরে ডেলিভারি রেট (৳)</label>
                <input
                  type="number"
                  name="insideDhakaRate"
                  defaultValue={settings?.insideDhakaRate}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ঢাকার বাইরে ডেলিভারি রেট (৳)</label>
                <input
                  type="number"
                  name="outsideDhakaRate"
                  defaultValue={settings?.outsideDhakaRate}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Accounts */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-primary border-b border-gray-100 pb-2">
              পেমেন্ট অ্যাকাউন্টস ও গেটওয়ে সেটিংস
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">বিকাশ পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  name="bkashNumber"
                  defaultValue={settings?.bkashNumber}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">নগদ পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  name="nagadNumber"
                  defaultValue={settings?.nagadNumber}
                  className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-lg px-3 py-2 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
                <input
                  type="checkbox"
                  name="isCodEnabled"
                  defaultChecked={settings?.isCodEnabled}
                  className="w-4 h-4 accent-primary"
                />
                <span>ক্যাশ অন ডেলিভারি চালু রাখুন</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
                <input
                  type="checkbox"
                  name="isBkashEnabled"
                  defaultChecked={settings?.isBkashEnabled}
                  className="w-4 h-4 accent-primary"
                />
                <span>বিকাশ পেমেন্ট চালু রাখুন</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
                <input
                  type="checkbox"
                  name="isNagadEnabled"
                  defaultChecked={settings?.isNagadEnabled}
                  className="w-4 h-4 accent-primary"
                />
                <span>নগদ পেমেন্ট চালু রাখুন</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#063D2B] hover:bg-[#12563D] text-ivory text-xs md:text-sm font-bold shadow transition-colors"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
