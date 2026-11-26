/** CMS-editable homepage copy stored in HomepageSection.contentJson, with safe defaults. */

export interface TrustItem {
  icon: "award" | "truck" | "shield" | "card" | "package" | "headset";
  title: string;
  subtitle?: string;
  href?: string;
}

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  { icon: "award", title: "মানসম্মত পণ্য", subtitle: "বাছাই করা সংগ্রহ" },
  { icon: "truck", title: "সারা দেশে ডেলিভারি", subtitle: "ডেলিভারি নীতি দেখুন", href: "/delivery-policy" },
  // The return policy is still marked "pending client confirmation": link to it, promise no number of days.
  { icon: "package", title: "রিটার্ন ও এক্সচেঞ্জ", subtitle: "নীতি দেখুন", href: "/return-policy" },
  { icon: "headset", title: "গ্রাহক সেবা", subtitle: "যেকোনো প্রশ্নে যোগাযোগ করুন", href: "/contact" },
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
