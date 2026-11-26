import type { Metadata } from "next";
import { IMAGE_CREDITS } from "@/content/image-credits";

export const metadata: Metadata = { title: "ছবির কৃতিত্ব | সাদ সুহাইব সুন্নাহ শপ" };

export default function ImageCreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#082B13] md:text-3xl">ছবির কৃতিত্ব</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#4f5a53]">
        হোমপেজের স্লাইডারে ব্যবহৃত কিছু টুপির ছবি প্রতীকী; এগুলো উন্মুক্ত লাইসেন্সের ছবি, শপের পণ্যের ছবি নয়।
      </p>
      <p lang="en" className="mt-2 text-sm leading-relaxed text-[#4f5a53]">
        Changes made to the photos below: cropped, background removed, resized, lightly shaded and combined with illustrated
        backgrounds. Slider artwork adapted from CC BY-SA 4.0 photos is shared under CC BY-SA 4.0.
      </p>
      <ul className="mt-6 space-y-3">
        {IMAGE_CREDITS.map((c) => (
          <li key={c.source} lang="en" className="rounded-xl border border-[#E3D6BC] bg-white p-4 text-sm text-[#14291B]">
            <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-bold text-[#082B13] underline">
              {c.title}
            </a>{" "}
            by {c.author},{" "}
            <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer license" className="text-[#710D17] underline">
              {c.license}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
