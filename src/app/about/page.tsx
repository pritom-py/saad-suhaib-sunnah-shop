import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { getBusinessSettings } from "@/services/storefront.service";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="page-ivory min-h-screen py-10 px-4 font-bengali">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <IslamicDivider title="আমাদের সম্পর্কে" />
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            সাদ সুহাইব সুন্নাহ শপ — সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের নির্ভরযোগ্য ঠিকানা
          </p>
        </div>

        {/* Story Card */}
        <div className="premium-card p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-[#E5D9BD]">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gold shadow-md flex-shrink-0">
              <Image
                src="/logo/logo.jpg"
                alt="সাদ সুহাইব সুন্নাহ শপ"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl font-black text-primary">
                {settings?.businessNameBn || "সাদ সুহাইব সুন্নাহ শপ"}
              </h2>
              <p className="text-xs md:text-sm text-text-secondary">
                {settings?.taglineBn || "সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের বিশ্বস্ত ঠিকানা"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-text-secondary leading-relaxed">
            <p>
              আলহামদুলিল্লাহ, <strong>সাদ সুহাইব সুন্নাহ শপ</strong> প্রতিষ্ঠিত হয়েছে মসজিদ, মাদ্রাসা এবং সাধারণ ধর্মপ্রাণ মুসলিম ভাইদের জন্য মানসম্মত, আরামদায়ক ও খাঁটি সুন্নতি পোশাক ও সামগ্রী পৌঁছে দেওয়ার লক্ষ্য নিয়ে।
            </p>
            <p>
              আমাদের প্রধান বিশেষত্ব হলো ইসলামি টুপি। মাকড়া টুপি, নরমাল এসি টুপি, ডাবল এমব্রয়ডারি এসি টুপি, ইমাটরে টুপি, কওমী উঁচু টুপি, জালি টুপি ছাড়াও আমরা সরবরাহ করি ফিটিং বাঁধা পাগড়ি, আফগান পাগড়ি, ভিআইপি হাজি রুমাল, ফিলিস্তিনি রুমাল, ডিজিটাল তসবিহ কাউন্টার এবং পবিত্র কোরআনুল কারিমের উন্নত জিপারযুক্ত গিলাফ।
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-[#FBF7EC] rounded-xl border border-gold/40 text-center space-y-1">
              <CheckCircle className="w-5 h-5 text-gold mx-auto" />
              <h4 className="font-bold text-primary text-xs">১০০% সুন্নাহসম্মত</h4>
              <p className="text-[11px] text-text-secondary">সততা ও আমানতদারিতার সাথে ব্যবসা</p>
            </div>
            <div className="p-4 bg-[#FBF7EC] rounded-xl border border-gold/40 text-center space-y-1">
              <CheckCircle className="w-5 h-5 text-gold mx-auto" />
              <h4 className="font-bold text-primary text-xs">উন্নত কোয়ালিটি</h4>
              <p className="text-[11px] text-text-secondary">আরামদায়ক কাপড় ও নিখুঁত সেলাই</p>
            </div>
            <div className="p-4 bg-[#FBF7EC] rounded-xl border border-gold/40 text-center space-y-1">
              <CheckCircle className="w-5 h-5 text-gold mx-auto" />
              <h4 className="font-bold text-primary text-xs">সারা দেশে ডেলিভারি</h4>
              <p className="text-[11px] text-text-secondary">দ্রুত ও নির্ভরযোগ্য কুরিয়ার সেবা</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
