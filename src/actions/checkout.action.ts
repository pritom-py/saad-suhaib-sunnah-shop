"use server";

import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export interface OrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export async function createOrderAction(
  formData: any,
  items: OrderItemInput[]
): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "আপনার শপিং কার্ট খালি।" };
    }

    // 1. Validate Form Input with Zod
    const validatedData = checkoutSchema.parse(formData);

    // 2. Fetch business settings for delivery charges
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
    const insideDhakaRate = settings?.insideDhakaRate ?? 70;
    const outsideDhakaRate = settings?.outsideDhakaRate ?? 130;
    const deliveryCharge =
      validatedData.deliveryZone === "INSIDE_DHAKA" ? insideDhakaRate : outsideDhakaRate;

    // 3. Fetch products and calculate server-side subtotal
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isPublished: true },
      include: { variants: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const verifiedOrderItems: {
      productId: string;
      variantId?: string | null;
      productNameBn: string;
      productNameEn: string;
      variantName?: string | null;
      sku: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }[] = [];

    for (const item of items) {
      const dbProd = productMap.get(item.productId);
      if (!dbProd) {
        return { success: false, error: "কিছু পণ্য আর স্টকে বা সিস্টেমে বিদ্যমান নেই।" };
      }

      // Check unconfirmed price rule
      let price = dbProd.regularPrice;
      let sku = dbProd.sku;
      let variantName: string | null = null;

      if (item.variantId) {
        const variant = dbProd.variants.find((v) => v.id === item.variantId);
        if (variant) {
          if (variant.price !== null && variant.price !== undefined) {
            price = variant.price;
          }
          sku = variant.sku;
          variantName = `${variant.size || ""} ${variant.color || ""}`.trim() || null;

          if (variant.stock < item.quantity) {
            return {
              success: false,
              error: `দুঃখিত, ${dbProd.nameBn} (${variantName}) এর পর্যাপ্ত স্টক নেই।`,
            };
          }
        }
      } else {
        if (dbProd.stockQuantity < item.quantity) {
          return {
            success: false,
            error: `দুঃখিত, ${dbProd.nameBn} এর পর্যাপ্ত স্টক নেই।`,
          };
        }
      }

      if (price === null || price === undefined) {
        return {
          success: false,
          error: `${dbProd.nameBn} এর মূল্য বর্তমানে নিশ্চিত নয়। অনুগ্রহ করে আমাদের সাথে সরাসরি যোগাযোগ করুন।`,
        };
      }

      const itemTotal = price * item.quantity;
      calculatedSubtotal += itemTotal;

      verifiedOrderItems.push({
        productId: dbProd.id,
        variantId: item.variantId || null,
        productNameBn: dbProd.nameBn,
        productNameEn: dbProd.nameEn,
        variantName,
        sku,
        unitPrice: price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // 4. Validate Coupon if provided
    let discount = 0;
    let couponId: string | null = null;
    if (validatedData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: validatedData.couponCode.toUpperCase(), isActive: true },
      });

      if (coupon) {
        const now = new Date();
        const isNotExpired = !coupon.endDate || new Date(coupon.endDate) >= now;
        const meetsMinAmount = !coupon.minOrderAmount || calculatedSubtotal >= coupon.minOrderAmount;

        if (isNotExpired && meetsMinAmount) {
          couponId = coupon.id;
          if (coupon.type === "PERCENTAGE") {
            discount = (calculatedSubtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
        }
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal - discount + deliveryCharge);

    // 5. Generate unique Order Number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `SS-${timestamp}-${randomSuffix}`;

    // 6. Execute atomic database transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create Customer profile if does not exist
      let customer = await tx.customer.findUnique({
        where: { phone: validatedData.phone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: validatedData.fullName,
            phone: validatedData.phone,
            email: validatedData.email || null,
            isGuest: true,
          },
        });
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          guestName: validatedData.fullName,
          guestPhone: validatedData.phone,
          guestAltPhone: validatedData.altPhone || null,
          guestEmail: validatedData.email || null,
          district: validatedData.district,
          upazila: validatedData.upazila,
          fullAddress: validatedData.fullAddress,
          orderNotes: validatedData.orderNotes || null,
          subtotal: calculatedSubtotal,
          discount,
          deliveryCharge,
          totalAmount,
          status: "PENDING",
          paymentStatus:
            validatedData.paymentMethod === "COD" ? "UNPAID" : "PENDING_VERIFICATION",
          paymentMethod: validatedData.paymentMethod,
          deliveryZone: validatedData.deliveryZone,
          items: {
            create: verifiedOrderItems.map((oi) => ({
              productId: oi.productId,
              variantId: oi.variantId,
              productNameBn: oi.productNameBn,
              productNameEn: oi.productNameEn,
              variantName: oi.variantName,
              sku: oi.sku,
              unitPrice: oi.unitPrice,
              quantity: oi.quantity,
              totalPrice: oi.totalPrice,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "কাস্টমার কর্তৃক অর্ডার সাবমিট করা হয়েছে।",
            },
          },
        },
      });

      // Record Payment record if bKash, Nagad, or Bank
      if (
        validatedData.paymentMethod === "BKASH" ||
        validatedData.paymentMethod === "NAGAD" ||
        validatedData.paymentMethod === "BANK_TRANSFER"
      ) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: validatedData.paymentMethod,
            amount: totalAmount,
            transactionId: validatedData.transactionId || null,
            accountNumber: validatedData.senderAccount || null,
            status: "PENDING",
            notes: "কাস্টমার ট্রানজেকশন সাবমিট করেছে, অ্যাডমিন ভেরিফিকেশন প্রয়োজন।",
          },
        });
      }

      // Record coupon usage
      if (couponId) {
        await tx.couponUsage.create({
          data: {
            couponId,
            orderId: order.id,
            userPhone: validatedData.phone,
          },
        });
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Decrement Inventory safely
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    },
    // A hosted database adds network time to each query, and a sleeping one needs time to wake.
    // Prisma's 5 second default made orders fail.
    { maxWait: 10_000, timeout: 30_000 });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    return { success: true, orderNumber: newOrder.orderNumber };
  } catch (err: any) {
    console.error("Order creation failed:", err);
    return {
      success: false,
      error: err?.message || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
    };
  }
}
