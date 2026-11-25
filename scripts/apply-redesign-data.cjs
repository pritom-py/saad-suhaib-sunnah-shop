/**
 * One-time, idempotent content update for the redesign. It never resets or deletes data,
 * and only replaces a value while it still holds the original seeded one.
 *
 *   node --env-file=.env scripts/apply-redesign-data.cjs
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cleanDir = path.join(__dirname, "..", "public", "products", "clean");
const cleaned = new Set(fs.readdirSync(cleanDir));
const toClean = (url) => {
  const m = /^\/products\/([^/]+\.jpg)$/.exec(url || "");
  return m && cleaned.has(m[1]) ? `/products/clean/${m[1]}` : null;
};

/** Category cards use their own tighter crops (public/categories). */
const CATEGORY_SOURCES = {
  caps: ["/products/makra-tupi.jpg", "/products/clean/double-embroidery-ac-tupi.jpg"],
  turbans: ["/products/fitting-bandha-pagri.jpg", "/products/clean/fitting-bandha-pagri.jpg"],
  scarves: ["/products/original-kalo-vip-haji-rumal.jpg", "/products/clean/original-kalo-vip-haji-rumal.jpg"],
  tasbih: ["/products/digital-tasbih.jpg", "/products/clean/digital-tasbih.jpg"],
  "quran-covers": ["/products/quraner-gilaf.jpg", "/products/clean/quraner-gilaf.jpg"],
};

const EXTRA_SLIDES = [
  {
    id: "hero-2",
    badgeBn: "টুপির সংগ্রহ",
    titleBn: "আরামদায়ক ইসলামি টুপি",
    subtitleBn: "জালি, এসি, কওমী ও এমব্রয়ডারি ডিজাইন",
    descriptionBn: "বিভিন্ন ডিজাইনের টুপি দেখে আপনার পছন্দেরটি বেছে নিন।",
    ctaTextBn: "টুপির সংগ্রহ দেখুন",
    ctaLink: "/category/caps",
    imageUrl: "/products/clean/makra-tupi.jpg",
    displayOrder: 2,
  },
  {
    id: "hero-3",
    badgeBn: "রুমাল ও পাগড়ি",
    titleBn: "বাছাই করা রুমাল",
    subtitleBn: "হাজি রুমাল, কাশ্মীরা ও ফিলিস্তিনি রুমাল",
    descriptionBn: "নামাজ ও দৈনন্দিন ব্যবহারের জন্য রুমাল ও গামছা।",
    ctaTextBn: "রুমাল দেখুন",
    ctaLink: "/category/scarves",
    imageUrl: "/products/clean/original-kalo-vip-haji-rumal.jpg",
    displayOrder: 3,
  },
  {
    id: "hero-4",
    badgeBn: "পাইকারি অর্ডার",
    titleBn: "মসজিদ ও মাদ্রাসার জন্য",
    subtitleBn: "বেশি পরিমাণে অর্ডারের জন্য যোগাযোগ করুন",
    descriptionBn: "আপনার প্রয়োজনীয় পণ্য ও পরিমাণ জানিয়ে পাইকারি ফর্মটি পূরণ করুন।",
    ctaTextBn: "পাইকারি অনুসন্ধান",
    ctaLink: "/wholesale",
    imageUrl: "/products/clean/normal-ac-tupi.jpg",
    displayOrder: 4,
  },
];

async function main() {
  let changed = 0;

  for (const img of await prisma.productImage.findMany()) {
    const url = toClean(img.url);
    if (url) {
      await prisma.productImage.update({ where: { id: img.id }, data: { url } });
      changed++;
    }
  }

  for (const cat of await prisma.category.findMany()) {
    const url = CATEGORY_SOURCES[cat.slug]?.includes(cat.imageUrl) ? `/categories/${cat.slug}.jpg` : toClean(cat.imageUrl);
    if (url) {
      await prisma.category.update({ where: { id: cat.id }, data: { imageUrl: url } });
      changed++;
    }
  }

  const hero = await prisma.heroBanner.findUnique({ where: { id: "hero-1" } });
  if (hero && (!hero.imageUrl || hero.imageUrl === "/products/makra-tupi.jpg")) {
    await prisma.heroBanner.update({ where: { id: "hero-1" }, data: { imageUrl: "/hero/hero-products.webp" } });
    changed++;
  }
  // extra slides are added only on a store that still has just the original one
  if ((await prisma.heroBanner.count()) === 1 && hero) {
    for (const slide of EXTRA_SLIDES) await prisma.heroBanner.create({ data: slide });
    changed += EXTRA_SLIDES.length;
  }

  const bulk = await prisma.promotionalBanner.findFirst({ where: { position: "WHOLESALE_RIGHT" } });
  if (bulk && !bulk.imageUrl) {
    await prisma.promotionalBanner.update({ where: { id: bulk.id }, data: { imageUrl: "/products/clean/normal-ac-tupi.jpg" } });
    changed++;
  }

  console.log(`Redesign content applied. Records changed: ${changed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
