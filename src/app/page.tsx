import {
  getHeroBanners,
  getCategories,
  getFeaturedProducts,
  getPromotionalBanners,
  getHomepageSections,
} from "@/services/storefront.service";
import { HeroSection } from "@/components/storefront/HeroSection";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { CategorySection } from "@/components/storefront/CategorySection";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { WholesaleBanners } from "@/components/storefront/WholesaleBanners";
import { categorySubtitlesFrom, trustItemsFrom } from "@/lib/homepage-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroBanners, categories, featuredProducts, promos, sections] = await Promise.all([
    getHeroBanners(),
    getCategories(),
    getFeaturedProducts(),
    getPromotionalBanners(),
    getHomepageSections(),
  ]);
  const contentOf = (key: string) => sections.find((s) => s.sectionKey === key)?.contentJson;

  return (
    <div className="page-ivory">
      <HeroSection banners={heroBanners} />
      <TrustStrip items={trustItemsFrom(contentOf("TRUST_STRIP"))} />
      <CategorySection categories={categories} subtitles={categorySubtitlesFrom(contentOf("CATEGORIES"))} />
      <FeaturedProducts products={featuredProducts} />
      <WholesaleBanners banners={promos} />
    </div>
  );
}
