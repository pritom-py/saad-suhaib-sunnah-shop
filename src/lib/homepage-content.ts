/** CMS-editable homepage copy stored in HomepageSection.contentJson, with safe defaults. */

export interface TrustItem {
  icon: "truck" | "shield" | "card" | "package";
  title: string;
  href?: string;
}

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  { icon: "truck", title: "সারা বাংলাদেশে ডেলিভারি", href: "/delivery-policy" },
  { icon: "shield", title: "বিশ্বস্ত ও মানসম্মত পণ্য" },
  { icon: "card", title: "বিকাশ ও নগদ পেমেন্ট সুবিধা" },
  // The return policy is still marked "pending client confirmation", so this links to the policy
  // instead of promising a facility. Change the title in Admin → CMS once it is confirmed.
  { icon: "package", title: "রিটার্ন ও এক্সচেঞ্জ নীতি", href: "/return-policy" },
];

export const DEFAULT_CATEGORY_SUBTITLES: Record<string, string> = {
  caps: "(বিভিন্ন ডিজাইন)",
  turbans: "(অরিজিনাল কালো, ফিটিং)",
  scarves: "(বিভিন্ন সাইজ)",
  tasbih: "(কম্পাসসহ)",
  "quran-covers": "(বিভিন্ন সাইজ ও ডিজাইন)",
};

function parse<T>(json: string | null | undefined): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function trustItemsFrom(json?: string | null): TrustItem[] {
  const data = parse<{ items?: TrustItem[] }>(json);
  return data?.items?.length ? data.items : DEFAULT_TRUST_ITEMS;
}

export function categorySubtitlesFrom(json?: string | null): Record<string, string> {
  const data = parse<{ subtitles?: Record<string, string> }>(json);
  return { ...DEFAULT_CATEGORY_SUBTITLES, ...(data?.subtitles || {}) };
}
