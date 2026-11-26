import { prisma } from "@/lib/prisma";
import { bengaliVariants } from "@/lib/bengali-text";

export async function getBusinessSettings() {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
    return settings;
  } catch (err) {
    console.error("Error fetching business settings:", err);
    return null;
  }
}

export async function getHeroBanners() {
  try {
    return await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isPublished: true } } },
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "asc" },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
        variants: { where: { isActive: true } },
      },
      take: 8,
    });
  } catch {
    return [];
  }
}

export async function getIslamicCaps() {
  try {
    return await prisma.product.findMany({
      where: { isPublished: true, isIslamicCap: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
        variants: { where: { isActive: true } },
      },
      take: 10,
    });
  } catch {
    return [];
  }
}

export async function getNewArrivals() {
  try {
    return await prisma.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
      },
      take: 6,
    });
  } catch {
    return [];
  }
}

export async function getPromotionalBanners() {
  try {
    return await prisma.promotionalBanner.findMany({
      where: { isActive: true },
    });
  } catch {
    return [];
  }
}

export async function getNavigationItems() {
  try {
    return await prisma.navigationItem.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            category: true,
            variants: { where: { isActive: true } },
          },
        },
      },
    });
  } catch {
    return null;
  }
}


export async function searchProducts(params: {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  isIslamicCap?: boolean;
}) {
  try {
    const where: any = { isPublished: true };

    if (params.q) {
      where.OR = bengaliVariants(params.q.trim()).flatMap((q) =>
        ["nameBn", "nameEn", "descBn", "descEn", "sku"].map((field) => ({ [field]: { contains: q, mode: "insensitive" as const } }))
      );
    }

    if (params.category) {
      where.category = { slug: params.category };
    }

    if (params.isIslamicCap !== undefined) {
      where.isIslamicCap = params.isIslamicCap;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.regularPrice = {};
      if (params.minPrice !== undefined) where.regularPrice.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.regularPrice.lte = params.maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price-asc") orderBy = { regularPrice: "asc" };
    if (params.sort === "price-desc") orderBy = { regularPrice: "desc" };
    if (params.sort === "popular") orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];

    return await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });
  } catch (err) {
    console.error("Search products error:", err);
    return [];
  }
}

export async function getContentPage(slug: string) {
  try {
    return await prisma.contentPage.findUnique({
      where: { slug, isPublished: true },
    });
  } catch {
    return null;
  }
}

export async function getHomepageSections() {
  try {
    return await prisma.homepageSection.findMany();
  } catch {
    return [];
  }
}

export async function getNavigationData() {
  try {
    const [navItems, categories] = await Promise.all([
      prisma.navigationItem.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: {
          slug: true,
          nameBn: true,
          products: { where: { isPublished: true }, select: { slug: true, nameBn: true }, orderBy: { createdAt: "asc" }, take: 12 },
        },
      }),
    ]);
    return { navItems, categories };
  } catch {
    return { navItems: [], categories: [] };
  }
}
