"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        slug: data.slug || data.sku.toLowerCase(),
        nameBn: data.nameBn,
        nameEn: data.nameEn,
        categoryId: data.categoryId,
        regularPrice: data.regularPrice ? Number(data.regularPrice) : null,
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : null,
        minWholesaleQty: Number(data.minWholesaleQty || 12),
        stockQuantity: Number(data.stockQuantity || 0),
        shortDescBn: data.shortDescBn,
        shortDescEn: data.shortDescEn,
        descBn: data.descBn,
        descEn: data.descEn,
        unitOfSale: data.unitOfSale || "piece",
        isPublished: data.isPublished ?? true,
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isIslamicCap: data.isIslamicCap ?? false,
        images: {
          create: (data.images || []).map((imgUrl: string, idx: number) => ({
            url: imgUrl,
            altText: data.nameBn,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, product };
  } catch (err: any) {
    console.error("Create product error:", err);
    return { success: false, error: err?.message || "পণ্য তৈরি ব্যর্থ হয়েছে" };
  }
}

export async function updateProductAction(id: string, data: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nameBn: data.nameBn,
        nameEn: data.nameEn,
        categoryId: data.categoryId,
        regularPrice: data.regularPrice ? Number(data.regularPrice) : null,
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : null,
        minWholesaleQty: Number(data.minWholesaleQty || 12),
        stockQuantity: Number(data.stockQuantity || 0),
        shortDescBn: data.shortDescBn,
        shortDescEn: data.shortDescEn,
        descBn: data.descBn,
        descEn: data.descEn,
        unitOfSale: data.unitOfSale || "piece",
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isIslamicCap: data.isIslamicCap,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    // Check if product is in any orders
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      // Soft-archive by unpublishing
      await prisma.product.update({
        where: { id },
        data: { isPublished: false },
      });
      return {
        success: true,
        message: "অর্ডারে বিদ্যমান থাকায় পণ্যটি স্থায়ীভাবে মুছে ফেলার বদলে ড্রাফট/আনপাবলিশ করা হয়েছে।",
      };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function adjustInventoryAction(
  productId: string,
  variantId: string | null,
  adjustment: number,
  reason: string
) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: { increment: adjustment } },
      });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: { increment: adjustment } },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "ADJUST_INVENTORY",
        entity: "Product",
        entityId: productId,
        details: `স্টক সমন্বয়: ${adjustment > 0 ? `+${adjustment}` : adjustment} (কারণ: ${reason})`,
      },
    });

    revalidatePath("/admin/inventory");
    return { success: true, product: updated };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
