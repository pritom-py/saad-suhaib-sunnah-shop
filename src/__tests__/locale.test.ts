/**
 * Locale utility tests — Bengali number formatting, price formatting
 */
import { describe, it, expect } from "vitest";
import { toBengaliNumber, formatPrice } from "@/lib/locale";

describe("toBengaliNumber", () => {
  it("should convert ASCII digits to Bengali digits", () => {
    expect(toBengaliNumber(0)).toBe("০");
    expect(toBengaliNumber(1)).toBe("১");
    expect(toBengaliNumber(9)).toBe("৯");
    expect(toBengaliNumber(10)).toBe("১০");
    expect(toBengaliNumber(100)).toBe("১০০");
    expect(toBengaliNumber(1234567)).toBe("১২৩৪৫৬৭");
  });

  it("should handle string input", () => {
    expect(toBengaliNumber("42")).toBe("৪২");
    expect(toBengaliNumber("0")).toBe("০");
  });

  it("should handle zero", () => {
    expect(toBengaliNumber(0)).toBe("০");
  });
});

describe("formatPrice", () => {
  it("should format a price in Bengali with ৳ symbol", () => {
    const formatted = formatPrice(70, "bn");
    expect(formatted).toContain("৳");
    expect(formatted).toContain("৭০");
  });

  it("should format a price in English with ৳ symbol", () => {
    const formatted = formatPrice(500, "en");
    expect(formatted).toContain("৳");
    expect(formatted).toContain("500");
  });

  it("should handle decimal prices", () => {
    const formatted = formatPrice(99.5, "en");
    expect(formatted).toContain("৳");
  });

  it("should handle zero price", () => {
    const formatted = formatPrice(0, "bn");
    expect(formatted).toContain("৳");
  });
});
