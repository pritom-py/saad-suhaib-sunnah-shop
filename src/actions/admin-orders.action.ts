"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string,
  note?: string
) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, error: "অর্ডার পাওয়া যায়নি" };

    // Stock release on cancellation or return
    if (
      (newStatus === "CANCELLED" || newStatus === "RETURNED") &&
      order.status !== "CANCELLED" &&
      order.status !== "RETURNED"
    ) {
      for (const item of order.items) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        statusHistory: {
          create: {
            status: newStatus,
            note: note || `স্ট্যাটাস পরিবর্তন: ${newStatus}`,
            changedBy: session.email,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderId,
        details: `স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus}`,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, order: updated };
  } catch (err: any) {
    console.error("Update order status error:", err);
    return { success: false, error: err?.message || "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে" };
  }
}

export async function updateCourierAction(
  orderId: string,
  courierName: string,
  trackingNumber: string
) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    await prisma.order.update({
      where: { id: orderId },
      data: {
        courierName,
        trackingNumber,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function verifyPaymentAction(
  paymentId: string,
  status: "VERIFIED" | "REJECTED",
  rejectionReason?: string
) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) return { success: false, error: "পেমেন্ট রেকর্ড পাওয়া যায়নি" };

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status,
          verifiedAt: new Date(),
          verifiedBy: session.email,
          rejectionReason: status === "REJECTED" ? rejectionReason : null,
        },
      });

      // Update related order paymentStatus
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: status === "VERIFIED" ? "PAID" : "REJECTED",
        },
      });
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: status === "VERIFIED" ? "VERIFY_PAYMENT" : "REJECT_PAYMENT",
        entity: "Payment",
        entityId: paymentId,
        details: `পেমেন্ট ${status === "VERIFIED" ? "ভেরিফাই" : "বাতিল"} করা হয়েছে`,
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath(`/admin/orders/${payment.orderId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
