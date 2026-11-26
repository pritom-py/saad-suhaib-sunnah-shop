import {
  getHeroBanners,
  getCategories,
  getFeaturedProducts,
  getIslamicCaps,
  getPromotionalBanners,
  getHomepageSections,
  getBusinessSettings,
} from "@/services/storefront.service";
import { HeroSection } from "@/components/storefront/HeroSection";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { CategorySection } from "@/components/storefront/CategorySection";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { WholesaleBanners } from "@/components/storefront/WholesaleBanners";
import { AboutSection } from "@/components/storefront/AboutSection";
import { TestimonialsSection } from "@/components/storefront/TestimonialsSection";
import { NewsletterSection } from "@/components/storefront/NewsletterSection";
import { Reveal } from "@/components/storefront/Reveal";
import { trustItemsFrom } from "@/lib/homepage-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroBanners, categories, featured, caps, promos, sections, settings] = await Promise.all([
    getHeroBanners(),
    getCategories(),
    getFeaturedProducts(),
    getIslamicCaps(),
    getPromotionalBanners(),
    getHomepageSections(),
    getBusinessSettings(),
  ]);
  const contentOf = (key: string) => sections.find((s) => s.sectionKey === key)?.contentJson;
  // category subtitles appear only once the owner has saved them in the admin
  let subtitles: Record<string, string> = {};
  try {
    subtitles = JSON.parse(contentOf("CATEGORIES") || "{}").subtitles || {};
  } catch {}
  // products marked "featured" come first; caps fill any empty places in the grid of six
  const products = [...featured, ...caps.filter((c) => !featured.some((f) => f.id === c.id))].slice(0, 6);

  return (
    <div className="page-ivory">
      <HeroSection banners={heroBanners} />
      <Reveal>
        <TrustStrip items={trustItemsFrom(contentOf("TRUST_STRIP"))} />
      </Reveal>
      <Reveal>
        <CategorySection categories={categories} subtitles={subtitles} />
      </Reveal>
      <Reveal>
        <FeaturedProducts products={products} />
      </Reveal>
      <Reveal>
        <WholesaleBanners banners={promos} />
      </Reveal>
      <Reveal>
        <AboutSection />
      </Reveal>
      <TestimonialsSection />
      <Reveal>
        <NewsletterSection whatsappUrl={settings?.whatsappUrl} />
      </Reveal>
    </div>
  );
}
