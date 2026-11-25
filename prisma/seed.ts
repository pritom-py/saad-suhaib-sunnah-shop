import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Saad Suhaib Sunnah Shop...');

  // 1. Demo Administrator
  const demoEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@saadsuhaib.local';
  const demoPassword = process.env.DEMO_ADMIN_PASSWORD;
  if (!demoPassword) throw new Error('Set DEMO_ADMIN_PASSWORD in .env before seeding.');
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',
      name: 'সুপার অ্যাডমিন (Super Admin)',
      phone: '+880 1749160444',
    },
    create: {
      email: demoEmail,
      name: 'সুপার অ্যাডমিন (Super Admin)',
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: '+880 1749160444',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Business Settings
  const settings = await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessNameBn: 'সাদ সুহাইব সুন্নাহ শপ',
      businessNameEn: 'Saad Suhaib Sunnah Shop',
      taglineBn: 'সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের বিশ্বস্ত ঠিকানা',
      taglineEn: 'Trusted destination for Sunnah-compliant & essential Islamic products',
      announcementBn: 'মসজিদ, মাদ্রাসা ও সাধারণ মুসলিম ভাইদের বিশ্বস্ত ইসলামি পণ্যের অনলাইন শপ',
      announcementEn: 'Online shop of trusted Islamic products for mosques, madrasas & Muslims',
      phoneSupport: '+880 1749160444',
      whatsappNumber: '+880 1749160444',
      whatsappUrl: 'https://wa.me/8801749160444',
      facebookUrl: 'https://www.facebook.com/profile.php?id=61571320383081',
      addressBn: 'টাঙ্গাইল সদর কলেজ মোড় থেকে আইডিয়াল কলেজ রোড, একতালা বাম, বাংলাদেশ',
      addressEn: 'Tangail Sadar College More to Ideal College Road, 1st Floor Left, Bangladesh',
      insideDhakaRate: 70,
      outsideDhakaRate: 130,
      bkashNumber: '+880 1749160444 (Personal / Send Money)',
      nagadNumber: '+880 1749160444 (Personal / Send Money)',
      bankDetails: 'Islami Bank Bangladesh PLC (Account details pending client confirmation)',
      isCodEnabled: true,
      isBkashEnabled: true,
      isNagadEnabled: true,
      isBankEnabled: false,
    },
  });
  console.log('✅ Business settings initialized');

  // 3. Categories
  const categoriesData = [
    {
      slug: 'caps',
      nameBn: 'ইসলামি টুপি',
      nameEn: 'Islamic Caps',
      descriptionBn: 'বিভিন্ন আকর্ষণীয় ডিজাইনের আরামদায়ক ও টেকসই টুপি',
      descriptionEn: 'Comfortable and durable Islamic prayer caps in various designs',
      imageUrl: '/categories/caps.jpg',
      displayOrder: 1,
      isFeatured: true,
    },
    {
      slug: 'turbans',
      nameBn: 'পাগড়ি',
      nameEn: 'Turbans / Pagri',
      descriptionBn: 'অরিজিনাল কালো, ফিটিং বাঁধা ও আফগান পাগড়ি',
      descriptionEn: 'Original black, pre-tied fitting and Afghan turbans',
      imageUrl: '/categories/turbans.jpg',
      displayOrder: 2,
      isFeatured: true,
    },
    {
      slug: 'scarves',
      nameBn: 'রুমাল / গামছা',
      nameEn: 'Scarves / Rumal',
      descriptionBn: 'ভিআইপি হাজি রুমাল, কাশ্মীরা ও ফিলিস্তিনি রুমাল',
      descriptionEn: 'VIP Haji scarves, Kashmiri and Palestinian keffiyehs',
      imageUrl: '/categories/scarves.jpg',
      displayOrder: 3,
      isFeatured: true,
    },
    {
      slug: 'tasbih',
      nameBn: 'ডিজিটাল তসবিহ',
      nameEn: 'Digital Tasbih',
      descriptionBn: 'কম্পাসযুক্ত ও ফিঙ্গার ডিজিটাল তসবিহ কাউন্টার',
      descriptionEn: 'Digital tasbih counters with compass and LED finger counters',
      imageUrl: '/categories/tasbih.jpg',
      displayOrder: 4,
      isFeatured: true,
    },
    {
      slug: 'quran-covers',
      nameBn: 'কোরআনের গিলাফ',
      nameEn: 'Quran Covers',
      descriptionBn: 'বিভিন্ন সাইজ, কালার ও উন্নত লেদার জিপারযুক্ত গিলাফ',
      descriptionEn: 'High quality zippered leatherette Quran covers in various colors',
      imageUrl: '/categories/quran-covers.jpg',
      displayOrder: 5,
      isFeatured: true,
    },
    {
      slug: 'miswak-accessories',
      nameBn: 'মেসওয়াক ও অন্যান্য',
      nameEn: 'Miswak & Accessories',
      descriptionBn: 'অরিজিনাল জয়তুনের প্যাকেট মেসওয়াক',
      descriptionEn: 'Original olive miswak in fresh sealed packaging',
      imageUrl: '/products/clean/packet-miswak.jpg',
      displayOrder: 6,
      isFeatured: false,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✅ ${categoriesData.length} categories seeded`);

  // 4. Products (Actual client dataset from images & prompt)
  const productsData = [
    {
      sku: 'SS-RUMAL-001',
      slug: 'original-kalo-vip-haji-rumal',
      nameBn: 'অরিজিনাল কালো ভিআইপি হাজি রুমাল',
      nameEn: 'Original Black VIP Haji Rumal',
      shortDescBn: 'উন্নত কোয়ালিটির আরামদায়ক সুতি কাপড় ও আকর্ষণীয় এমব্রয়ডারি পাড়যুক্ত ভিআইপি হাজি রুমাল।',
      shortDescEn: 'Premium export quality cotton fabric VIP Haji scarf with elegant borders.',
      descBn: 'আসল বিদেশি সুতি কাপড়ে তৈরি অরিজিনাল কালো ভিআইপি হাজি রুমাল। নামাজ, হজ্জ, উমরাহ ও দৈনন্দিন ব্যবহারের জন্য অত্যন্ত আরামদায়ক এবং দীর্ঘস্থায়ী। সাইজ: ৫৬ ইঞ্চি।',
      descEn: 'Authentic high grade cotton VIP Haji rumal. Ideal for prayer, Hajj, Umrah, and everyday use. Size: 56 inch.',
      categorySlug: 'scarves',
      regularPrice: 500,
      salePrice: null,
      wholesalePrice: 420,
      minWholesaleQty: 10,
      stockQuantity: 45,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: true,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/original-kalo-vip-haji-rumal.jpg'],
    },
    {
      sku: 'SS-TUPI-001',
      slug: 'imatore-tupi',
      nameBn: 'ইমাটরে টুপি',
      nameEn: 'Imatore Tupi',
      shortDescBn: 'সুন্দর ফিনিশিং ও নিখুঁত সেলাইয়ের আরামদায়ক ইমাটরে টুপি।',
      shortDescEn: 'Finely crafted and comfortable Imatore prayer cap.',
      descBn: 'ইমাটরে টুপি মাথার মাপ অনুযায়ী দারুণভাবে ফিট হয়। উন্নত সুতি কাপড় ও চমৎকার টেক্সচার সমৃদ্ধ যা দীর্ঘ সময় পরিধানেও পরম শান্তি দেয়।',
      descEn: 'Premium Imatore cap fitting smoothly. Breathable fabric ensuring comfort during extended wear.',
      categorySlug: 'caps',
      regularPrice: 62,
      salePrice: null,
      wholesalePrice: 50,
      minWholesaleQty: 24,
      stockQuantity: 120,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: true,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/imatore-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-002',
      slug: 'makra-tupi',
      nameBn: 'মাকড়া টুপি',
      nameEn: 'Makra Tupi',
      shortDescBn: 'জনপ্রিয় জালি ডিজাইনের আরামদায়ক ও হালকা ওজনের মাকড়া টুপি।',
      shortDescEn: 'Popular net-patterned lightweight and breathable Makra cap.',
      descBn: 'মাকড়া টুপি চমৎকার জালি ডিজাইনে তৈরি। এটি বাতাস চলাচলে সহায়ক হওয়ায় গরমে অত্যন্ত আরামদায়ক। সব বয়সী মুসলিম ভাইদের পছন্দের শীর্ষে।',
      descEn: 'Classic Makra net design offering maximum ventilation. Very popular among all age groups.',
      categorySlug: 'caps',
      regularPrice: 70,
      salePrice: null,
      wholesalePrice: 55,
      minWholesaleQty: 24,
      stockQuantity: 95,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: true,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/makra-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-003',
      slug: 'normal-ac-tupi',
      nameBn: 'নরমাল এসি টুপি',
      nameEn: 'Normal AC Tupi',
      shortDescBn: 'সুলভ মূল্যে আরামদায়ক বাতাস চলাচল উপযোগী নরমাল এসি টুপি।',
      shortDescEn: 'Affordable and breathable everyday AC net prayer cap.',
      descBn: 'সাশ্রয়ী মূল্যের এসি জালি টুপি। মসজিদ ও মাদ্রাসার ছাত্র ও নিয়মিত নামাজিদের জন্য সেরা পছন্দ।',
      descEn: 'Economical AC prayer cap with side embroidery and cooling mesh. Excellent for madrasa students.',
      categorySlug: 'caps',
      regularPrice: 25,
      salePrice: null,
      wholesalePrice: 20,
      minWholesaleQty: 36,
      stockQuantity: 200,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: true,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/normal-ac-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-004',
      slug: 'qawmi-uchu-tupi',
      nameBn: 'কওমী উঁচু টুপি',
      nameEn: 'Qawmi Uchu Tupi',
      shortDescBn: 'আসল সুতি কাপড়ে তৈরি ঐতিহ্যবাহী কওমী উঁচু টুপি।',
      shortDescEn: 'Traditional high-crown Qawmi cap made of pure breathable fabric.',
      descBn: 'কওমী মাদ্রাসা ও আলেম সমাজের ঐতিহ্যবাহী চমৎকার উঁচু টুপি। নিখুঁত সূচিকর্ম ও দৃঢ় স্টিচিং।',
      descEn: 'Traditional tall Qawmi cap favored by Islamic scholars and madrasa students. Durable stitching.',
      categorySlug: 'caps',
      regularPrice: 46,
      salePrice: null,
      wholesalePrice: 38,
      minWholesaleQty: 24,
      stockQuantity: 80,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: true,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/qawmi-uchu-tupi.jpg', '/products/clean/qawmi-tupi-asol.jpg'],
    },
    {
      sku: 'SS-PAGRI-001',
      slug: 'fitting-bandha-pagri',
      nameBn: 'ফিটিং বাঁধা পাগড়ি',
      nameEn: 'Fitting Bandha Pagri (Pre-tied Turban)',
      shortDescBn: 'রেডিমেড বাঁধা আকর্ষণীয় ডিজাইনের ফিটিং পাগড়ি।',
      shortDescEn: 'Ready-to-wear neatly tied and elegant fitting turban.',
      descBn: 'খুব সহজেই পরিধানযোগ্য রেডিমেড বাঁধা ফিটিং পাগড়ি। কোনো ঝামেলা ছাড়াই পরিপাটিভাবে পরিধান করা যায়। সুতি ও আরামদায়ক টেক্সচার।',
      descEn: 'Hassle-free pre-tied fitting turban. Perfect for daily prayer, jummah and Islamic gatherings.',
      categorySlug: 'turbans',
      regularPrice: 300,
      salePrice: null,
      wholesalePrice: 250,
      minWholesaleQty: 12,
      stockQuantity: 40,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
      isIslamicCap: false,
      images: ['/products/clean/fitting-bandha-pagri.jpg'],
    },
    {
      sku: 'SS-PAGRI-002',
      slug: 'afghan-pagri',
      nameBn: 'আফগান পাগড়ি',
      nameEn: 'Afghan Pagri',
      shortDescBn: 'আফগান এক্সপোর্ট কোয়ালিটি আকর্ষণীয় স্ট্রাইপ পাগড়ি।',
      shortDescEn: 'Export quality striped Afghan style turban scarf.',
      descBn: 'উন্নত মানের কাপড়ে তৈরি আফগান ঐতিহ্যবাহী পাগড়ি। সাদা ও কালো কালার ভেরিয়েন্টে পাওয়া যায়।',
      descEn: 'Afghan export quality pagri with horizontal stripes. Available in white and black.',
      categorySlug: 'turbans',
      regularPrice: 290,
      salePrice: null,
      wholesalePrice: 240,
      minWholesaleQty: 12,
      stockQuantity: 50,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
      isIslamicCap: false,
      images: ['/products/clean/afghan-pagri.jpg'],
    },
    {
      sku: 'SS-TASBIH-001',
      slug: 'digital-tasbih',
      nameBn: 'ডিজিটাল তসবিহ (কম্পাসসহ)',
      nameEn: 'Digital Tasbih with Compass',
      shortDescBn: 'কিবলা কম্পাস ও স্পষ্ট ডিসপ্লেযুক্ত ডিজিটাল তসবিহ কাউন্টার।',
      shortDescEn: 'Digital tasbih counter with built-in Qibla direction compass and clear LCD display.',
      descBn: 'ডিজিটাল তসবিহ কাউন্টারটিতে রয়েছে দিক নির্ণায়ক কম্পাস, দ্রুত রিসেট বাটন এবং দীর্ঘমেয়াদী ব্যাটারি ব্যাকআপ। লাল, সাদা, কালো কালারে পাওয়া যায়।',
      descEn: 'Digital finger and hand tasbih counter with directional compass, quick reset button, and durable battery. Multiple colors.',
      categorySlug: 'tasbih',
      regularPrice: 280,
      salePrice: null,
      wholesalePrice: 220,
      minWholesaleQty: 12,
      stockQuantity: 60,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
      isIslamicCap: false,
      images: ['/products/clean/digital-tasbih.jpg'],
    },
    {
      sku: 'SS-GILAF-001',
      slug: 'quraner-gilaf',
      nameBn: 'কোরআনের গিলাফ',
      nameEn: 'Quran Cover (Zippered)',
      shortDescBn: 'উন্নত লেদারেট ম্যাটেরিয়াল ও জিপারযুক্ত প্রিমিয়াম কোরআনের গিলাফ।',
      shortDescEn: 'High quality faux leather zippered protective Quran cover in vibrant colors.',
      descBn: 'পবিত্র কোরআনুল কারিম ধুলাবালি থেকে সুরক্ষিত রাখতে টেকসই ও আকর্ষণীয় গিলাফ। জিপার থাকায় কোরআন নিরাপদে থাকে। বিভিন্ন কালার যেমন নীল, গোল্ডেন, কালো, লাল, গোলাপি ইত্যাদি বিদ্যমান।',
      descEn: 'Protects the Holy Quran from dust and wear. Full zippered enclosure with geometric embossed finish.',
      categorySlug: 'quran-covers',
      regularPrice: 55,
      salePrice: null,
      wholesalePrice: 42,
      minWholesaleQty: 24,
      stockQuantity: 150,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/quraner-gilaf.jpg'],
    },
    {
      sku: 'SS-TUPI-005',
      slug: 'double-embroidery-ac-tupi',
      nameBn: 'ডাবল এমব্রয়ডারি এসি টুপি',
      nameEn: 'Double Embroidery AC Tupi',
      shortDescBn: 'চমৎকার ডাবল লেয়ার এমব্রয়ডারি ও জালিযুক্ত প্রিমিয়াম এসি টুপি।',
      shortDescEn: 'Double layer embroidered premium AC prayer cap with breathable mesh.',
      descBn: 'শীর্ষ মানের সূক্ষ্ম ডাবল এমব্রয়ডারি কাজ এবং উপরে শীতল বাতাস প্রবাহ নিশ্চিত করার জালি। দীর্ঘস্থায়ী ও রুচিশীল।',
      descEn: 'Delicate double-stitch embroidery with cooling top net. Elegant and durable.',
      categorySlug: 'caps',
      regularPrice: 45,
      salePrice: null,
      wholesalePrice: 35,
      minWholesaleQty: 24,
      stockQuantity: 85,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/double-embroidery-ac-tupi-alt.jpg', '/products/clean/double-embroidery-ac-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-006',
      slug: 'padma-tupi',
      nameBn: 'পদ্ম টুপি',
      nameEn: 'Padma Tupi',
      shortDescBn: 'পদ্ম ফুলের নকশাযুক্ত রুচিশীল সূচিকর্মের টুপি।',
      shortDescEn: 'Elegant lotus-motif embroidered white Islamic prayer cap.',
      descBn: 'পদ্ম টুপিটিতে রয়েছে নান্দনিক ফুলের নকশা। পরিপাটি ও সুন্দর লুক এনে দেয়।',
      descEn: 'Artistic floral motif cap offering comfort and refined appearance.',
      categorySlug: 'caps',
      regularPrice: null, // Pending client confirmation!
      salePrice: null,
      wholesalePrice: null,
      minWholesaleQty: 24,
      stockQuantity: 30,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/padma-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-007',
      slug: '2-number-insaf-tupi',
      nameBn: '২ নাম্বার ইনসাফ টুপি',
      nameEn: '2 Number Insaf Tupi',
      shortDescBn: 'সুলভ মূল্যে আরামদায়ক ইনসাফ টুপি।',
      shortDescEn: 'Comfortable and affordable Insaf prayer cap.',
      descBn: 'সাদা সুতি কাপড়ে উল্লম্ব এমব্রয়ডারি পাড়যুক্ত ইনসাফ টুপি। আরামদায়ক ও টেকসই।',
      descEn: 'Insaf model 2 cotton cap with clean vertical floral embroidery stripe.',
      categorySlug: 'caps',
      regularPrice: 27,
      salePrice: null,
      wholesalePrice: 22,
      minWholesaleQty: 36,
      stockQuantity: 110,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/2-number-insaf-tupi.jpg'],
    },
    {
      sku: 'SS-RUMAL-002',
      slug: 'bangla-kashmiri-rumal',
      nameBn: 'বাংলা কাশ্মীরা রুমাল',
      nameEn: 'Bangla Kashmiri Rumal',
      shortDescBn: 'চেক ও স্ট্রাইপ ডিজাইনের উন্নত মানের বাংলা কাশ্মীরা রুমাল।',
      shortDescEn: 'Checked and striped soft textured Bangla Kashmiri scarf.',
      descBn: 'উন্নত ফিনিশিং, আরামদায়ক নরম কাপড় ও আকর্ষণীয় চেক প্যাটার্ন।',
      descEn: 'Soft textured square shawl with classic check patterns and packaging.',
      categorySlug: 'scarves',
      regularPrice: 240,
      salePrice: null,
      wholesalePrice: 200,
      minWholesaleQty: 12,
      stockQuantity: 65,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/bangla-kashmiri-rumal.jpg'],
    },
    {
      sku: 'SS-RUMAL-003',
      slug: 'noor-hosen-rumal',
      nameBn: 'নুর হোসেন রুমাল',
      nameEn: 'Noor Hosen Rumal (Wholesale Special)',
      shortDescBn: 'পাইকারি রেটে উন্নত মানের নুর হোসেন ফ্যাশন রুমাল।',
      shortDescEn: 'Wholesale-rate quality Noor Hosen brand check scarf.',
      descBn: 'প্যাকেটজাত নুর হোসেন রুমাল। পাইকারি মূল্যে মসজিদ ও মাদ্রাসার জন্য দারুণ সুযোগ। বিভিন্ন আকর্ষণীয় কালার কম্বিনেশন।',
      descEn: 'Packaged Noor Hosen brand scarves. Multi-color checks at wholesale discount.',
      categorySlug: 'scarves',
      regularPrice: 260,
      salePrice: null,
      wholesalePrice: 220,
      minWholesaleQty: 12,
      stockQuantity: 75,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/noor-hosen-rumal.jpg'],
    },
    {
      sku: 'SS-RUMAL-004',
      slug: 'javed-jafar-rumal',
      nameBn: 'জাবেদ জাফর রুমাল',
      nameEn: 'Javed Jafar Rumal',
      shortDescBn: 'ঝালরযুক্ত আরামদায়ক সুতি জাবেদ জাফর রুমাল।',
      shortDescEn: 'Fringed edge lightweight cotton Javed Jafar scarf.',
      descBn: 'চারপাশে সুন্দর কালো ঝালর এবং নীল-সবুজ-মেরুন চেক কাপড়ের ঐতিহ্যবাহী রুমাল।',
      descEn: 'Traditional check pattern scarf with decorative tasseled edges.',
      categorySlug: 'scarves',
      regularPrice: 120,
      salePrice: null,
      wholesalePrice: 95,
      minWholesaleQty: 24,
      stockQuantity: 80,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/javed-jafar-rumal.jpg'],
    },
    {
      sku: 'SS-TUPI-008',
      slug: 'japani-tore-tupi',
      nameBn: 'জাপানি টরে টুপি',
      nameEn: 'Japani Tore Tupi',
      shortDescBn: 'মসৃণ ও আরামদায়ক জাপানি টরে কাপড়ের টুপি।',
      shortDescEn: 'Smooth and refined Japanese Tore fabric prayer cap.',
      descBn: 'খুবই আরামদায়ক ও নিখুঁত ফিটিংয়ের জাপানি টরে টুপি। প্রাত্যহিক ব্যবহারের জন্য দীর্ঘস্থায়ী।',
      descEn: 'High quality Japanese Tore weave cap fitting naturally with comfortable feel.',
      categorySlug: 'caps',
      regularPrice: 60,
      salePrice: null,
      wholesalePrice: 48,
      minWholesaleQty: 24,
      stockQuantity: 90,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: true,
      images: ['/products/clean/japani-tore-tupi.jpg'],
    },
    {
      sku: 'SS-TUPI-009',
      slug: 'chikon-sutar-jali-tupi',
      nameBn: 'চিকন সুতার জালি টুপি',
      nameEn: 'Chikon Sutar Jali Tupi',
      shortDescBn: 'নিখুঁত হাতের কাজের মতো চিকন সুতার জালি নকশা টুপি।',
      shortDescEn: 'Fine-thread artisan mesh lace prayer cap.',
      descBn: 'উচ্চমানের চিকন সুতায় বোনা নকশাদার জালি টুপি। ১২ টিরও বেশি বৈচিত্র্যময় জ্যামিতিক নকশায় পাওয়া যায়।',
      descEn: 'Intricately patterned fine-yarn cap available in distinct geometrical floral motifs.',
      categorySlug: 'caps',
      regularPrice: 120,
      salePrice: null,
      wholesalePrice: 95,
      minWholesaleQty: 12,
      stockQuantity: 60,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
      isIslamicCap: true,
      images: ['/products/clean/chikon-sutar-jali-tupi.jpg'],
    },
    {
      sku: 'SS-MISWAK-001',
      slug: 'packet-miswak',
      nameBn: 'জয়তুনের প্যাকেট মেসওয়াক',
      nameEn: 'Olive Miswak (Sealed Pack)',
      shortDescBn: 'তাজা ও খাঁটি প্রিমিয়াম জয়তুন কাঠের মেসওয়াক।',
      shortDescEn: 'Fresh, 100% natural olive tree miswak in vacuum sealed packaging.',
      descBn: 'সুন্নতি আমল পালনে তাজা জয়তুনের কাঠের মেসওয়াক। মাড়ি ও দাঁতের সুস্বাস্থ্যে কার্যকর।',
      descEn: 'Natural olive miswak maintaining moisture and oral hygiene according to Sunnah.',
      categorySlug: 'miswak-accessories',
      regularPrice: 80,
      salePrice: null,
      wholesalePrice: 65,
      minWholesaleQty: 20,
      stockQuantity: 100,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: false,
      isIslamicCap: false,
      images: ['/products/clean/packet-miswak.jpg', '/products/clean/packet-olive-miswak.jpg'],
    },
    {
      sku: 'SS-RUMAL-005',
      slug: 'palestinian-rumal',
      nameBn: 'ফিলিস্তিনি রুমাল (কেফিয়্যাহ)',
      nameEn: 'Palestinian Keffiyeh Scarf',
      shortDescBn: 'ঐতিহ্যবাহী ফিলিস্তিনি ব্ল্যাক অ্যান্ড হোয়াইট কেফিয়্যাহ রুমাল।',
      shortDescEn: 'Traditional Palestinian black & white fishnet weave keffiyeh scarf.',
      descBn: 'ঐতিহ্যবাহী জ্যামিতিক বয়ন ও চারপাশের ঝালরযুক্ত আরামদায়ক সুতি ফিলিস্তিনি রুমাল।',
      descEn: 'Authentic Palestinian pattern scarf crafted with premium breathable cotton.',
      categorySlug: 'scarves',
      regularPrice: 350,
      salePrice: null,
      wholesalePrice: 280,
      minWholesaleQty: 12,
      stockQuantity: 50,
      unitOfSale: 'piece',
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
      isIslamicCap: false,
      images: ['/products/clean/palestinian-rumal.jpg'],
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, images, ...rest } = prod;

    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...rest,
        categoryId,
      },
      create: {
        ...rest,
        categoryId,
      },
    });

    // Seed product images
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          altText: prod.nameBn,
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }

    // Seed standard variants for caps (sizes 20, 21, 22) or scarves
    if (prod.isIslamicCap) {
      const sizes = ['২০ (20")', '২১ (21")', '২২ (22")'];
      for (let sIdx = 0; sIdx < sizes.length; sIdx++) {
        const variantSku = `${prod.sku}-SZ${20 + sIdx}`;
        await prisma.productVariant.upsert({
          where: { sku: variantSku },
          update: {
            stock: 25,
            price: prod.regularPrice,
          },
          create: {
            productId: createdProduct.id,
            sku: variantSku,
            nameBn: `${prod.nameBn} - সাইজ ${sizes[sIdx]}`,
            nameEn: `${prod.nameEn} - Size ${sizes[sIdx]}`,
            size: sizes[sIdx],
            color: 'সাদা (White)',
            stock: 25,
            price: prod.regularPrice,
          },
        });
      }
    }
  }
  console.log(`✅ ${productsData.length} products seeded with images and variants`);

  // 5. Delivery Zones
  const zones = [
    {
      nameBn: 'ঢাকার ভিতরে',
      nameEn: 'Inside Dhaka',
      slug: 'inside-dhaka',
      baseRate: 70,
      estimatedDays: '২-৩ দিন',
      isActive: true,
    },
    {
      nameBn: 'ঢাকার বাইরে',
      nameEn: 'Outside Dhaka',
      slug: 'outside-dhaka',
      baseRate: 130,
      estimatedDays: '৩-৫ দিন',
      isActive: true,
    },
  ];

  for (const zone of zones) {
    await prisma.deliveryZone.upsert({
      where: { slug: zone.slug },
      update: zone,
      create: zone,
    });
  }
  console.log('✅ Delivery zones seeded');

  // 6. Promotional Banners & Hero Banners
  await prisma.heroBanner.upsert({
    where: { id: 'hero-1' },
    update: {},
    create: {
      id: 'hero-1',
      badgeBn: 'সুন্নাহর অনুসরণে, দৈনন্দিন প্রয়োজনে',
      badgeEn: 'Following the Sunnah, For Daily Life',
      titleBn: 'মানসম্মত ইসলামি',
      titleEn: 'Premium Islamic',
      subtitleBn: 'টুপি, পাগড়ি, রুমাল, তসবিহ ও কোরআনের গিলাফ',
      subtitleEn: 'Caps, Turbans, Scarves, Tasbih & Quran Covers',
      descriptionBn: 'মসজিদ, মাদ্রাসা ও ব্যক্তিগত ব্যবহারের জন্য নির্বাচিত ও নির্ভরযোগ্য পণ্য।',
      descriptionEn: 'Selected and trustworthy products for mosques, madrasas, and personal use.',
      ctaTextBn: 'এখনই অর্ডার করুন',
      ctaTextEn: 'Order Now',
      ctaLink: '/shop',
      imageUrl: '/hero/hero-products.webp',
      displayOrder: 1,
      isActive: true,
    },
  });

  const promoBanners = [
    {
      id: 'promo-wholesale-left',
      position: 'WHOLESALE_LEFT',
      titleBn: 'মসজিদ ও মাদ্রাসার জন্য পাইকারি অর্ডার করুন',
      titleEn: 'Wholesale Orders for Mosques & Madrasas',
      subtitleBn: 'বিশেষ ছাড় ও সুবিধা',
      subtitleEn: 'Special Discounts & Institutional Privileges',
      ctaTextBn: 'যোগাযোগ করুন',
      ctaTextEn: 'Contact Us',
      ctaLink: '/wholesale',
      isActive: true,
    },
    {
      id: 'promo-bulk-right',
      imageUrl: '/products/clean/normal-ac-tupi.jpg',
      position: 'WHOLESALE_RIGHT',
      titleBn: 'বাল্ক অর্ডারে',
      titleEn: 'On Bulk Orders',
      subtitleBn: 'বিশেষ মূল্য ও কাস্টম সুবিধা',
      subtitleEn: 'Special Pricing & Custom Capabilities',
      ctaTextBn: 'পাইকারি অর্ডার করুন',
      ctaTextEn: 'Place Wholesale Order',
      ctaLink: '/wholesale',
      isActive: true,
    },
  ];

  for (const b of promoBanners) {
    await prisma.promotionalBanner.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log('✅ Banners seeded');

  // 7. Navigation Items
  const navItems = [
    { labelBn: 'হোম', labelEn: 'Home', url: '/', displayOrder: 1 },
    { labelBn: 'সব পণ্য', labelEn: 'All Products', url: '/shop', displayOrder: 2 },
    { labelBn: 'টুপি', labelEn: 'Caps', url: '/category/caps', displayOrder: 3 },
    { labelBn: 'পাগড়ি', labelEn: 'Turbans', url: '/category/turbans', displayOrder: 4 },
    { labelBn: 'রুমাল / গামছা', labelEn: 'Scarves', url: '/category/scarves', displayOrder: 5 },
    { labelBn: 'ডিজিটাল তসবিহ', labelEn: 'Tasbih', url: '/category/tasbih', displayOrder: 6 },
    { labelBn: 'কোরআনের গিলাফ', labelEn: 'Quran Covers', url: '/category/quran-covers', displayOrder: 7 },
    { labelBn: 'অফার', labelEn: 'Offers', url: '/offers', displayOrder: 8 },
    { labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us', url: '/about', displayOrder: 9 },
    { labelBn: 'যোগাযোগ', labelEn: 'Contact', url: '/contact', displayOrder: 10 },
  ];

  for (const nav of navItems) {
    const existing = await prisma.navigationItem.findFirst({ where: { url: nav.url } });
    if (!existing) {
      await prisma.navigationItem.create({ data: nav });
    }
  }
  console.log('✅ Navigation items seeded');

  // 8. Static Content Pages
  const pages = [
    {
      slug: 'about',
      titleBn: 'আমাদের সম্পর্কে',
      titleEn: 'About Us',
      contentBn: 'সাদ সুহাইব সুন্নাহ শপ একটি বিশ্বস্ত ইসলামি পণ্য প্রতিষ্ঠান। আমরা মসজিদ, মাদ্রাসা এবং সাধারণ মুসলিম ভাইদের জন্য মানসম্মত টুপি, পাগড়ি, রুমাল, তসবিহ ও কোরআনের গিলাফ সরবরাহ করে থাকি। গ্রাহকদের সর্বোচ্চ সন্তুষ্টি ও সুন্নাহর প্রচার আমাদের মূল লক্ষ্য।',
      contentEn: 'Saad Suhaib Sunnah Shop is a trusted Islamic merchandise establishment providing premium prayer caps, turbans, scarves, tasbih, and Quran covers across Bangladesh.',
      isPublished: true,
    },
    {
      slug: 'delivery-policy',
      titleBn: 'ডেলিভারি নীতি',
      titleEn: 'Delivery Policy',
      contentBn: 'আমরা সমগ্র বাংলাদেশে সুন্দরবন কুরিয়ার, এসএ পরিবহন, রেডএক্স এবং স্টিডফাস্ট কুরিয়ারের মাধ্যমে হোম ডেলিভারি দিয়ে থাকি। ঢাকার ভিতরে ডেলিভারি সময় সাধারণত ২-৩ দিন এবং ঢাকার বাইরে ৩-৫ দিন। ডেলিভারি চার্জ চেকআউটের সময় নির্ধারণ করা হয়।',
      contentEn: 'We deliver nationwide across Bangladesh. Inside Dhaka delivery typically takes 2-3 days and outside Dhaka 3-5 days.',
      isPublished: true,
    },
    {
      slug: 'return-policy',
      titleBn: 'রিটার্ন ও এক্সচেঞ্জ নীতি',
      titleEn: 'Return & Exchange Policy',
      contentBn: 'পণ্য পাওয়ার পর কোনো ত্রুটি দেখা দিলে ডেলিভারির সময় কুরিয়ার প্রতিনিধির উপস্থিতিতে চেক করে পণ্য ফেরত দেওয়া যাবে। পণ্য অক্ষত ও অব্যবহৃত অবস্থায় ৩ দিনের মধ্যে যোগাযোগ করলে এক্সচেঞ্জ সুবিধা প্রদান করা হবে। (চূড়ান্ত নীতি ক্লায়েন্ট নিশ্চিতকরণ সাপেক্ষ)',
      contentEn: 'Products with genuine defects can be exchanged within 3 days if unused and intact. (Draft policy pending final client confirmation).',
      isPublished: true,
    },
    {
      slug: 'privacy-policy',
      titleBn: 'গোপনীয়তা নীতি',
      titleEn: 'Privacy Policy',
      contentBn: 'গ্রাহকের নাম, মোবাইল নম্বর এবং ঠিকানা শুধুমাত্র অর্ডার ডেলিভারির কাজে ব্যবহৃত হয়। আমরা কোনো তৃতীয় পক্ষের সাথে গ্রাহকের ব্যক্তিগত তথ্য শেয়ার করি না।',
      contentEn: 'Customer details are exclusively used for order fulfillment and never sold or shared with unauthorized third parties.',
      isPublished: true,
    },
    {
      slug: 'terms',
      titleBn: 'শর্তাবলি',
      titleEn: 'Terms and Conditions',
      contentBn: 'সাদ সুহাইব সুন্নাহ শপ থেকে কেনাকাটার ক্ষেত্রে পণ্য প্রাপ্যতা ও মূল্য পরিবর্তনশীল হতে পারে। কাস্টমার অর্ডার নিশ্চিত করার পর আমাদের প্রতিনিধি ফোনে অর্ডার ভেরিফাই করতে পারেন।',
      contentEn: 'All purchases are subject to product availability and confirmation.',
      isPublished: true,
    },
  ];

  for (const page of pages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('✅ Content pages seeded');

  // 9. Demo Coupons
  const coupons = [
    {
      code: 'SUNNAH10',
      type: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 500,
      maxDiscount: 100,
      isActive: true,
    },
    {
      code: 'MASJID50',
      type: 'FIXED_AMOUNT',
      discountValue: 50,
      minOrderAmount: 600,
      maxDiscount: 50,
      isActive: true,
    },
  ];

  for (const coup of coupons) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: coup,
      create: coup,
    });
  }
  console.log('✅ Coupons seeded');

  // 10. Demo Synthetic Orders & Wholesale Inquiry for Dashboard Analytics
  const sampleCustomer = await prisma.customer.upsert({
    where: { phone: '01711000000' },
    update: {},
    create: {
      name: 'মাওলানা আব্দুল্লাহ',
      phone: '01711000000',
      email: 'abdullah@demo.local',
      isGuest: false,
      isWholesale: true,
    },
  });

  const demoOrder = await prisma.order.upsert({
    where: { orderNumber: 'SS-DEMO-1001' },
    update: {},
    create: {
      orderNumber: 'SS-DEMO-1001',
      customerId: sampleCustomer.id,
      guestName: 'মাওলানা আব্দুল্লাহ',
      guestPhone: '01711000000',
      district: 'ঢাকা',
      upazila: 'মিরপুর',
      fullAddress: 'মিরপুর ১২, মাদ্রাসা রোড, ঢাকা',
      subtotal: 1000,
      discount: 50,
      deliveryCharge: 70,
      totalAmount: 1020,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'BKASH',
      deliveryZone: 'INSIDE_DHAKA',
      items: {
        create: [
          {
            productNameBn: 'অরিজিনাল কালো ভিআইপি হাজি রুমাল',
            productNameEn: 'Original Black VIP Haji Rumal',
            sku: 'SS-RUMAL-001',
            unitPrice: 500,
            quantity: 2,
            totalPrice: 1000,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order placed by customer' },
          { status: 'CONFIRMED', note: 'Order verified via phone' },
          { status: 'SHIPPED', note: 'Handed over to courier' },
          { status: 'DELIVERED', note: 'Customer received package' },
        ],
      },
      payments: {
        create: {
          method: 'BKASH',
          amount: 1020,
          transactionId: 'TRX987654321',
          accountNumber: '01711000000',
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: admin.email,
        },
      },
    },
  });

  // Demo Wholesale Inquiry
  const sampleInquiry = await prisma.wholesaleInquiry.create({
    data: {
      customerName: 'হাফেজ জুবায়ের আহমেদ',
      institutionName: 'দারুল উলুম মাদ্রাসা ও এতিমখানা',
      phone: '01812345678',
      whatsapp: '01812345678',
      district: 'কুমিল্লা',
      address: 'চকবাজার, কুমিল্লা সদর',
      productDetails: 'মাকড়া টুপি - ৫০ পিস, নরমাল এসি টুপি - ১০০ পিস, কোরআনের গিলাফ - ৩০ পিস',
      quantityNeeded: '১৮০ পিস',
      additionalNotes: 'বার্ষিক পরীক্ষার পুরস্কারের জন্য প্রয়োজন। বিশেষ মূল্য ও ডেলিভারি সময় জানাবেন।',
      status: 'NEW',
    },
  });

  console.log(`✅ Demo synthetic order (${demoOrder.orderNumber}) and wholesale inquiry seeded`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
