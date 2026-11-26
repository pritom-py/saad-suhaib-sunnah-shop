import type { Metadata } from "next";
import { Hind_Siliguri, Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Navbar, type NavLinkItem } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { FloatingSupport } from "@/components/storefront/FloatingSupport";
import { MobileNavigation } from "@/components/storefront/MobileNavigation";
import { StorefrontOnly } from "@/components/storefront/StorefrontOnly";
import { CartProvider } from "@/context/CartContext";
import { getBusinessSettings, getNavigationData } from "@/services/storefront.service";

const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap" });
const noto = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-noto", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: "সাদ সুহাইব সুন্নাহ শপ | Saad Suhaib Sunnah Shop",
  description:
    "মসজিদ, মাদ্রাসা ও সাধারণ মুসলিম ভাইদের বিশ্বস্ত ইসলামি পণ্যের অনলাইন শপ। টুপি, পাগড়ি, রুমাল, ডিজিটাল তসবিহ ও কোরআনের গিলাফ।",
  icons: { icon: "/logo/logo-circle.png", apple: "/logo/logo-circle.png" },
  openGraph: {
    title: "সাদ সুহাইব সুন্নাহ শপ",
    description: "সুন্নাহসম্মত ও প্রয়োজনীয় ইসলামি পণ্যের বিশ্বস্ত ঠিকানা",
    images: ["/logo/logo.jpg"],
  },
};

/** Short menu labels used in the approved design, keyed by category slug. */
const FOOTER_LABELS: Record<string, string> = { caps: "টুপি", scarves: "রুমাল" };
const NAV_LABELS: Record<string, string> = { "/category/scarves": "রুমাল" };
const FALLBACK_NAV = [
  ["/", "হোম"],
  ["/shop", "সব পণ্য"],
  ["/category/caps", "টুপি"],
  ["/category/turbans", "পাগড়ি"],
  ["/category/scarves", "রুমাল / গামছা"],
  ["/category/tasbih", "ডিজিটাল তসবিহ"],
  ["/category/quran-covers", "কোরআনের গিলাফ"],
  ["/offers", "অফার"],
  ["/about", "আমাদের সম্পর্কে"],
  ["/contact", "যোগাযোগ"],
];
/** Categories whose menu entry opens a dropdown of their products. */
const DROPDOWN_SLUGS = ["caps", "turbans"];

// The header and footer come from the database, so no page may be frozen at build time.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, { navItems, categories }] = await Promise.all([getBusinessSettings(), getNavigationData()]);

  const base = navItems.length ? navItems.map((n) => [n.url, n.labelBn]) : FALLBACK_NAV;
  // the design has a wholesale entry just before "about"
  const entries = base.some(([href]) => href === "/wholesale")
    ? base
    : base.flatMap((entry) => (entry[0] === "/about" ? [["/wholesale", "পাইকারি"], entry] : [entry]));

  const links: NavLinkItem[] = entries.map(([href, original]) => {
    const label = NAV_LABELS[href] || original;
    const category = categories.find((c) => href === `/category/${c.slug}` && DROPDOWN_SLUGS.includes(c.slug));
    return {
      href,
      label,
      children: category?.products.length
        ? [
            ...category.products.map((p) => ({ href: `/product/${p.slug}`, label: p.nameBn })),
            { href, label: `সকল ${label} দেখুন` },
          ]
        : undefined,
    };
  });

  return (
    <html lang="bn" className={`${hind.variable} ${noto.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-bengali antialiased">
        <CartProvider>
          <StorefrontOnly>
            <AnnouncementBar message={settings?.announcementBn} phone={settings?.phoneSupport} />
            <Header settings={settings} />
            <Navbar links={links} />
          </StorefrontOnly>

          <main className="flex-1">{children}</main>

          <StorefrontOnly>
            <CartDrawer />
            <FloatingSupport phone={settings?.phoneSupport} whatsappUrl={settings?.whatsappUrl} />
            <Footer
              settings={settings}
              categories={categories.slice(0, 5).map((c) => ({ slug: c.slug, label: FOOTER_LABELS[c.slug] || c.nameBn }))}
            />
            <MobileNavigation />
          </StorefrontOnly>
        </CartProvider>
      </body>
    </html>
  );
}
