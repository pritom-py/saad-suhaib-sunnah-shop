import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section aria-label="আমাদের সম্পর্কে" className="border-y border-[#E3D6BC] bg-[linear-gradient(100deg,#F4EAD7,#FCF7EA_55%,#F4EAD7)]">
      <div className="mx-auto grid max-w-[1600px] items-center md:grid-cols-[45%_1fr]">
        {/* decorative illustration */}
        <div className="reveal-item relative aspect-[880/580] w-full overflow-hidden bg-[#082B13]">
          <Image src="/about/mosque-arch.webp" alt="" fill sizes="(max-width: 768px) 100vw, 45vw" className="about-art object-cover" />
        </div>
        <div className="reveal-item space-y-3 px-5 py-6 md:px-[clamp(20px,4vw,64px)]">
          <p className="text-base font-bold text-[#082B13] sm:text-lg">আমাদের সম্পর্কে</p>
          <h2 className="text-[clamp(22px,2.5vw,36px)] font-bold leading-tight text-[#710D17]">সুন্নাহর সৌন্দর্য, ঐতিহ্যের ধারাবাহিকতা</h2>
          <p className="max-w-xl text-[clamp(14px,1.25vw,18px)] leading-relaxed text-[#3d4a40]">
            রুচিশীল ও মানসম্মত ইসলামিক পণ্যের ঠিকানা। টুপি, পাগড়ি, রুমালসহ নানা প্রয়োজনীয় পণ্য আমরা পৌঁছে দিচ্ছি সারা বাংলাদেশে।
          </p>
          <Link href="/about" className="btn-emerald px-6 py-2.5 text-sm">
            বিস্তারিত জানুন <ArrowRight className="h-4 w-4 text-[#EACB85]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
