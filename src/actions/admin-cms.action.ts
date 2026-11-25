"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBusinessSettingsAction(formData: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        businessNameBn: formData.businessNameBn,
        businessNameEn: formData.businessNameEn,
        taglineBn: formData.taglineBn,
        taglineEn: formData.taglineEn,
        announcementBn: formData.announcementBn,
        announcementEn: formData.announcementEn,
        phoneSupport: formData.phoneSupport,
        whatsappNumber: formData.whatsappNumber,
        whatsappUrl: formData.whatsappUrl,
        facebookUrl: formData.facebookUrl,
        addressBn: formData.addressBn,
        addressEn: formData.addressEn,
        insideDhakaRate: Number(formData.insideDhakaRate),
        outsideDhakaRate: Number(formData.outsideDhakaRate),
        bkashNumber: formData.bkashNumber,
        nagadNumber: formData.nagadNumber,
        bankDetails: formData.bankDetails,
        isCodEnabled: formData.isCodEnabled === true || formData.isCodEnabled === "true",
        isBkashEnabled: formData.isBkashEnabled === true || formData.isBkashEnabled === "true",
        isNagadEnabled: formData.isNagadEnabled === true || formData.isNagadEnabled === "true",
        isBankEnabled: formData.isBankEnabled === true || formData.isBankEnabled === "true",
      },
      create: {
        id: "default",
        businessNameBn: formData.businessNameBn,
        businessNameEn: formData.businessNameEn,
        phoneSupport: formData.phoneSupport,
        whatsappNumber: formData.whatsappNumber,
      },
    });

    revalidatePath("/");
    revalidatePath("/checkout");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || "সেটিংস আপডেট ব্যর্থ হয়েছে" };
  }
}

export async function updateHeroBannerAction(id: string, data: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const updated = await prisma.heroBanner.update({
      where: { id },
      data: {
        badgeBn: data.badgeBn,
        badgeEn: data.badgeEn,
        titleBn: data.titleBn,
        titleEn: data.titleEn,
        subtitleBn: data.subtitleBn,
        subtitleEn: data.subtitleEn,
        descriptionBn: data.descriptionBn,
        descriptionEn: data.descriptionEn,
        ctaTextBn: data.ctaTextBn,
        ctaTextEn: data.ctaTextEn,
        ctaLink: data.ctaLink,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/cms");
    return { success: true, banner: updated };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateContentPageAction(slug: string, data: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "অননুমোদিত অ্যাক্সেস" };

    const updated = await prisma.contentPage.update({
      where: { slug },
      data: {
        titleBn: data.titleBn,
        titleEn: data.titleEn,
        contentBn: data.contentBn,
        contentEn: data.contentEn,
        isPublished: data.isPublished,
      },
    });

    revalidatePath(`/${slug}`);
    revalidatePath("/admin/cms");
    return { success: true, page: updated };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
