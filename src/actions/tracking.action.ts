"use server";

import { prisma } from "@/lib/prisma";

export async function trackOrderAction(orderNumber: string, phone: string) {
  try {
    const cleanOrderNumber = String(orderNumber ?? "").trim();
    // digits only (Bengali numerals accepted), so spaces, dashes and +88 do not matter
    const digits = String(phone ?? "")
      .replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6))
      .replace(/\D/g, "");

    if (!cleanOrderNumber || !digits) {
      return { success: false, error: "অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই লিখুন।" };
    }
    // A partial number must never match: it would expose another customer's name and address.
    if (digits.length < 11) {
      return { success: false, error: "অর্ডারে ব্যবহৃত সম্পূর্ণ ১১ ডিজিটের মোবাইল নম্বর লিখুন।" };
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: cleanOrderNumber,
        guestPhone: { endsWith: digits.slice(-10) }, // last 10 digits: ignores the 0 / +880 prefix
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        payments: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "প্রদত্ত তথ্যের সাথে কোনো অর্ডার পাওয়া যায়নি। নম্বর দুটি পুনরায় মিলিয়ে নিন।",
      };
    }

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        guestName: order.guestName,
        guestPhone: order.guestPhone,
        district: order.district,
        upazila: order.upazila,
        fullAddress: order.fullAddress,
        courierName: order.courierName,
        trackingNumber: order.trackingNumber,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalAmount,
        items: order.items,
        statusHistory: order.statusHistory,
      },
    };
  } catch (err: any) {
    console.error("Order tracking error:", err);
    return { success: false, error: "ট্র্যাকিং তথ্য লোড করতে সমস্যা হয়েছে।" };
  }
}
