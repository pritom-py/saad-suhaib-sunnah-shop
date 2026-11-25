import { z } from "zod";

// Bangladeshi Mobile Number Regex: 013, 014, 015, 016, 017, 018, 019
export const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

// Checkout Form Validation
export const checkoutSchema = z.object({
  fullName: z.string().min(2, "পূর্ণ নাম আবশ্যক (কমপক্ষে ২ অক্ষর)"),
  phone: z
    .string()
    .regex(bdPhoneRegex, "সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 01749160444)"),
  altPhone: z
    .string()
    .optional()
    .refine((val) => !val || bdPhoneRegex.test(val), {
      message: "বিকল্প ফোন নম্বরটি সঠিক নয়",
    }),
  email: z.string().email("সঠিক ইমেইল এড্রেস লিখুন").optional().or(z.literal("")),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  upazila: z.string().min(1, "উপজেলা / থানা লিখুন বা নির্বাচন করুন"),
  fullAddress: z.string().min(5, "সম্পূর্ণ ঠিকানা লিখুন (বাসা/রোড/এলাকা)"),
  orderNotes: z.string().max(500, "অর্ডার নোট ৫০০ অক্ষরের মধ্যে রাখুন").optional(),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "BANK_TRANSFER"]),
  deliveryZone: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]),
  couponCode: z.string().optional(),
  senderAccount: z.string().optional(),
  transactionId: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Wholesale Inquiry Validation
export const wholesaleInquirySchema = z.object({
  customerName: z.string().min(2, "আপনার নাম আবশ্যক"),
  institutionName: z.string().optional(),
  phone: z
    .string()
    .regex(bdPhoneRegex, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন"),
  whatsapp: z.string().optional(),
  district: z.string().min(1, "জেলা উল্লেখ করুন"),
  address: z.string().min(5, "সম্পূর্ণ ঠিকানা উল্লেখ করুন"),
  productDetails: z.string().min(5, "কোন কোন পণ্য প্রয়োজন তা লিখুন"),
  quantityNeeded: z.string().min(1, "আনুমানিক পরিমাণ লিখুন"),
  additionalNotes: z.string().optional(),
});

export type WholesaleInquiryInput = z.infer<typeof wholesaleInquirySchema>;

// Admin Login Validation
export const adminLoginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Product CRUD Validation
export const productSchema = z.object({
  nameBn: z.string().min(2, "বাংলা নাম আবশ্যক"),
  nameEn: z.string().min(2, "ইংরেজি নাম আবশ্যক"),
  sku: z.string().min(2, "SKU আবশ্যক"),
  categoryId: z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
  regularPrice: z.number().nullable().optional(),
  salePrice: z.number().nullable().optional(),
  wholesalePrice: z.number().nullable().optional(),
  minWholesaleQty: z.number().min(1).default(12),
  stockQuantity: z.number().min(0).default(0),
  shortDescBn: z.string().optional(),
  shortDescEn: z.string().optional(),
  descBn: z.string().optional(),
  descEn: z.string().optional(),
  unitOfSale: z.string().default("piece"),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isIslamicCap: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

// Coupon Validation
export const couponSchema = z.object({
  code: z.string().min(3, "কুপন কোড কমপক্ষে ৩ অক্ষর").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive("ছাড়ের পরিমাণ ০ এর বেশি হতে হবে"),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
