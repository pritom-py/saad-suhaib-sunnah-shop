/**
 * Zod validation schema tests — checkout, wholesale, admin login
 * Tests match the exact field names from src/validations/schemas.ts
 */
import { describe, it, expect } from "vitest";
import {
  checkoutSchema,
  wholesaleInquirySchema,
  adminLoginSchema,
} from "@/validations/schemas";

describe("checkoutSchema", () => {
  const validCheckout = {
    fullName: "মোহাম্মদ আলী",
    phone: "01749160444",
    district: "ঢাকা",
    upazila: "মিরপুর",
    fullAddress: "মিরপুর-১০, বাসা ১২, ঢাকা",
    paymentMethod: "COD" as const,
    deliveryZone: "INSIDE_DHAKA" as const,
  };

  it("should validate a correct COD checkout payload", () => {
    const result = checkoutSchema.safeParse(validCheckout);
    expect(result.success).toBe(true);
  });

  it("should accept bKash as a valid payment method", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, paymentMethod: "BKASH" });
    expect(result.success).toBe(true);
  });

  it("should accept Nagad as a valid payment method", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, paymentMethod: "NAGAD" });
    expect(result.success).toBe(true);
  });

  it("should reject an unsupported payment method", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, paymentMethod: "PAYPAL" });
    expect(result.success).toBe(false);
  });

  it("should reject a missing phone number", () => {
    const { phone, ...noPhone } = validCheckout;
    const result = checkoutSchema.safeParse(noPhone);
    expect(result.success).toBe(false);
  });

  it("should reject an invalid Bangladeshi phone format", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("should reject a phone number starting with 012 (not a valid BD operator)", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, phone: "01249160444" });
    expect(result.success).toBe(false);
  });

  it("should accept international BD format +8801749160444", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, phone: "+8801749160444" });
    expect(result.success).toBe(true);
  });

  it("should reject a fullAddress shorter than 5 chars", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, fullAddress: "abc" });
    expect(result.success).toBe(false);
  });

  it("should reject a fullName shorter than 2 chars", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("should accept an optional email field when provided correctly", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, email: "buyer@example.com" });
    expect(result.success).toBe(true);
  });

  it("should reject an invalid email format", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("wholesaleInquirySchema", () => {
  const validWholesale = {
    customerName: "রহিম উদ্দিন",
    phone: "01711000000",
    district: "চট্টগ্রাম",
    address: "চকবাজার, চট্টগ্রাম শহর",
    productDetails: "ইসলামিক টুপি ও পাগড়ি (বিভিন্ন সাইজ)",
    quantityNeeded: "৫০০ পিস প্রতি মাসে",
  };

  it("should validate a correct wholesale inquiry", () => {
    const result = wholesaleInquirySchema.safeParse(validWholesale);
    expect(result.success).toBe(true);
  });

  it("should accept an optional institutionName", () => {
    const result = wholesaleInquirySchema.safeParse({
      ...validWholesale,
      institutionName: "আল-আমিন ট্রেডার্স",
    });
    expect(result.success).toBe(true);
  });

  it("should reject a missing customerName", () => {
    const { customerName, ...noName } = validWholesale;
    const result = wholesaleInquirySchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it("should reject a missing phone", () => {
    const { phone, ...noPhone } = validWholesale;
    const result = wholesaleInquirySchema.safeParse(noPhone);
    expect(result.success).toBe(false);
  });

  it("should reject a productDetails shorter than 5 chars", () => {
    const result = wholesaleInquirySchema.safeParse({ ...validWholesale, productDetails: "abc" });
    expect(result.success).toBe(false);
  });
});

describe("adminLoginSchema", () => {
  it("should validate correct admin credentials", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@saadsuhaib.local",
      password: "ExampleOnly#12345",
    });
    expect(result.success).toBe(true);
  });

  it("should reject an invalid email format", () => {
    const result = adminLoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject a password shorter than 6 characters", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@saadsuhaib.local",
      password: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("should accept exactly 6-char password", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@saadsuhaib.local",
      password: "abc123",
    });
    expect(result.success).toBe(true);
  });
});
