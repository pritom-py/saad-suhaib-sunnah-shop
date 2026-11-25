"use server";

import { prisma } from "@/lib/prisma";
import { wholesaleInquirySchema } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export async function submitWholesaleInquiryAction(formData: any) {
  try {
    const validated = wholesaleInquirySchema.parse(formData);

    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        customerName: validated.customerName,
        institutionName: validated.institutionName || null,
        phone: validated.phone,
        whatsapp: validated.whatsapp || null,
        district: validated.district,
        address: validated.address,
        productDetails: validated.productDetails,
        quantityNeeded: validated.quantityNeeded,
        additionalNotes: validated.additionalNotes || null,
        status: "NEW",
      },
    });

    revalidatePath("/admin/wholesale");
    return { success: true, inquiryId: inquiry.id };
  } catch (err: any) {
    console.error("Wholesale inquiry submission error:", err);
    return {
      success: false,
      error: err?.message || "তথ্য জমা দিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।",
    };
  }
}
