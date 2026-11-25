import bnLocales from "@/locales/bn.json";
import enLocales from "@/locales/en.json";

export type Locale = "bn" | "en";

export const defaultLocale: Locale = "bn";

export function getDictionary(locale: Locale = "bn") {
  return locale === "en" ? enLocales : bnLocales;
}

// Convert English numbers to Bengali numbers
export function toBengaliNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return "";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}

// Format Price with Currency Symbol
export function formatPrice(amount: number | null | undefined, locale: Locale = "bn"): string {
  if (amount === null || amount === undefined) {
    return locale === "bn" ? "মূল্য জানতে যোগাযোগ করুন" : "Call for Price";
  }
  const formatted = locale === "bn" ? toBengaliNumber(amount) : amount.toString();
  return `৳ ${formatted}`;
}
