import React from "react";
import { IslamicDivider } from "@/components/storefront/IslamicDivider";
import { getBusinessSettings } from "@/services/storefront.service";
import { Phone, MessageCircle, MapPin, Facebook, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  const phone = settings?.phoneSupport || "+880 1749160444";
  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/8801749160444";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/profile.php?id=61571320383081";
  const address = settings?.addressBn || "টাঙ্গাইল সদর কলেজ মোড় থেকে আইডিয়াল কলেজ রোড, একতালা বাম, বাংলাদেশ";

  return (
    <div className="page-ivory min-h-screen py-10 px-4 font-bengali">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <IslamicDivider title="যোগাযোগ করুন" />
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            যেকোনো প্রশ্ন, পণ্য জিজ্ঞাসা বা পাইকারি অর্ডারের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Methods */}
          <div className="premium-card p-6 md:p-8 rounded-3xl shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-primary border-b border-[#E5D9BD] pb-3">
              সরাসরি যোগাযোগ মাধ্যম
            </h3>

            <div className="space-y-4 text-xs md:text-sm">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FBF7EC] hover:bg-cream transition-colors text-text-primary"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-gold flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-primary">হটলাইন / কল সাপোর্ট</div>
                  <div className="font-sans font-bold text-maroon mt-0.5">{phone}</div>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors text-text-primary"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-emerald-900">হোয়াটসঅ্যাপ চ্যাট</div>
                  <div className="text-xs text-emerald-700 mt-0.5">তাৎক্ষণিক বার্তা পাঠান</div>
                </div>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-text-primary"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-blue-900">অফিসিয়াল ফেসবুক পেজ</div>
                  <div className="text-xs text-blue-700 mt-0.5">ফেসবুকে ইনবক্স করুন</div>
                </div>
              </a>
            </div>
          </div>

          {/* Location & Working Hours */}
          <div className="premium-card p-6 md:p-8 rounded-3xl shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-primary border-b border-[#E5D9BD] pb-3">
              অফিস ও কারখানা ঠিকানা
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-text-secondary leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary block font-bold">ঠিকানা:</strong>
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary block font-bold">কাস্টমার সাপোর্ট সময়:</strong>
                  <span>প্রতিদিন সকাল ৯:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত (নামাজের বিরতি ব্যতীত)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
