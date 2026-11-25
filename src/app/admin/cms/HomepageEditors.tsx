import React from "react";
import { revalidatePath } from "next/cache";
import { ImageIcon, LayoutPanelTop, Plus, Save, Sliders } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySubtitlesFrom, trustItemsFrom } from "@/lib/homepage-content";

/** Images and links may only be local paths or http(s) addresses. */
const safeUrl = (v: string) => (v.startsWith("/") && !v.startsWith("//")) || /^https?:\/\//i.test(v);

const read = (formData: FormData, key: string) => ((formData.get(key) as string) || "").trim();

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/cms");
}

async function saveSlide(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = read(formData, "id");
  const imageUrl = read(formData, "imageUrl");
  const ctaLink = read(formData, "ctaLink") || "/shop";
  const data = {
    badgeBn: read(formData, "badgeBn"),
    titleBn: read(formData, "titleBn"),
    subtitleBn: read(formData, "subtitleBn"),
    descriptionBn: read(formData, "descriptionBn"),
    ctaTextBn: read(formData, "ctaTextBn"),
    ctaLink: safeUrl(ctaLink) ? ctaLink : "/shop",
    imageUrl: imageUrl && safeUrl(imageUrl) ? imageUrl : null,
    displayOrder: Number(read(formData, "displayOrder")) || 0,
    isActive: formData.get("isActive") === "on",
  };
  if (!data.titleBn) return;
  if (id) await prisma.heroBanner.update({ where: { id }, data });
  else await prisma.heroBanner.create({ data });
  refresh();
}

async function savePromo(formData: FormData) {
  "use server";
  await requireAdmin();
  const imageUrl = read(formData, "imageUrl");
  const ctaLink = read(formData, "ctaLink") || "/wholesale";
  await prisma.promotionalBanner.update({
    where: { id: read(formData, "id") },
    data: {
      titleBn: read(formData, "titleBn"),
      subtitleBn: read(formData, "subtitleBn"),
      ctaTextBn: read(formData, "ctaTextBn"),
      ctaLink: safeUrl(ctaLink) ? ctaLink : "/wholesale",
      imageUrl: imageUrl && safeUrl(imageUrl) ? imageUrl : null,
      isActive: formData.get("isActive") === "on",
    },
  });
  refresh();
}

async function saveHomepageCopy(formData: FormData) {
  "use server";
  await requireAdmin();
  const section = async (sectionKey: string, titleBn: string, titleEn: string, content: object) => {
    const contentJson = JSON.stringify(content);
    await prisma.homepageSection.upsert({
      where: { sectionKey },
      update: { contentJson },
      create: { sectionKey, titleBn, titleEn, contentJson },
    });
  };

  const current = trustItemsFrom((await prisma.homepageSection.findUnique({ where: { sectionKey: "TRUST_STRIP" } }))?.contentJson);
  await section("TRUST_STRIP", "সেবা স্ট্রিপ", "Trust strip", {
    items: current.map((item, i) => ({ ...item, title: read(formData, `trust-${i}`) || item.title })),
  });

  const subtitles: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("subtitle-")) subtitles[key.slice(9)] = String(value).trim();
  }
  await section("CATEGORIES", "পণ্য ক্যাটাগরি", "Categories", { subtitles });
  refresh();
}

function Field({ label, name, value, rows }: { label: string; name: string; value: string | number; rows?: number }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold text-primary">{label}</span>
      {rows ? <textarea name={name} rows={rows} defaultValue={value} className="field" /> : <input name={name} defaultValue={value} className="field" />}
    </label>
  );
}

const SaveButton = ({ label }: { label: string }) => (
  <button type="submit" className="btn-emerald px-5 py-2 text-xs">
    <Save className="h-4 w-4 text-[#f6d77a]" /> {label}
  </button>
);

type Slide = {
  id: string; badgeBn: string; titleBn: string; subtitleBn: string; descriptionBn: string;
  ctaTextBn: string; ctaLink: string; imageUrl: string | null; displayOrder: number; isActive: boolean;
};

function SlideForm({ slide, nextOrder }: { slide?: Slide; nextOrder: number }) {
  return (
    <form action={saveSlide} className="space-y-3 border-t border-gray-100 p-4">
      <input type="hidden" name="id" value={slide?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="গোল্ডেন ব্যাজ টেক্সট" name="badgeBn" value={slide?.badgeBn ?? ""} />
        <Field label="মূল হেডলাইন (গোল্ডেন) *" name="titleBn" value={slide?.titleBn ?? ""} />
      </div>
      <Field label="সাব-হেডলাইন" name="subtitleBn" value={slide?.subtitleBn ?? ""} />
      <Field label="বিবরণ" name="descriptionBn" rows={2} value={slide?.descriptionBn ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="বাটন লেবেল" name="ctaTextBn" value={slide?.ctaTextBn ?? "এখনই অর্ডার করুন"} />
        <Field label="বাটন লিংক" name="ctaLink" value={slide?.ctaLink ?? "/shop"} />
        <Field label="ছবির পাথ / URL" name="imageUrl" value={slide?.imageUrl ?? ""} />
        <Field label="ক্রম" name="displayOrder" value={slide?.displayOrder ?? nextOrder} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-bold text-primary">
          <input type="checkbox" name="isActive" defaultChecked={slide?.isActive ?? true} className="h-4 w-4 accent-primary" /> সক্রিয়
        </label>
        <SaveButton label={slide ? "স্লাইড সেভ করুন" : "নতুন স্লাইড যোগ করুন"} />
      </div>
    </form>
  );
}

export async function HomepageEditors() {
  const [slides, promos, categories, sections] = await Promise.all([
    prisma.heroBanner.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.promotionalBanner.findMany({ orderBy: { position: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" }, take: 5 }),
    prisma.homepageSection.findMany(),
  ]);
  const contentOf = (key: string) => sections.find((s) => s.sectionKey === key)?.contentJson;
  const trust = trustItemsFrom(contentOf("TRUST_STRIP"));
  const subtitles = categorySubtitlesFrom(contentOf("CATEGORIES"));
  const nextOrder = (slides.at(-1)?.displayOrder ?? 0) + 1;
  const card = "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";
  const heading = "flex items-center gap-2 p-4 text-base font-bold text-primary";

  return (
    <>
      <section className={card}>
        <h2 className={heading}><Sliders className="h-4 w-4 text-gold" /> হিরো স্লাইড</h2>
        <p className="px-4 pb-3 text-xs text-gray-500">স্লাইড বন্ধ করতে &quot;সক্রিয়&quot; টিক তুলে দিন। &quot;/hero/&quot; দিয়ে শুরু হওয়া ছবি খিলানের ভেতরে কাট-আউট হিসেবে দেখায়।</p>
        {slides.map((s, i) => (
          <details key={s.id} open={i === 0} className="border-t border-gray-100">
            <summary className="cursor-pointer px-4 py-2.5 text-sm font-bold text-primary">
              {s.displayOrder}. {s.titleBn} {!s.isActive && <span className="text-gray-400">(বন্ধ)</span>}
            </summary>
            <SlideForm slide={s} nextOrder={nextOrder} />
          </details>
        ))}
        <details className="border-t border-gray-100">
          <summary className="flex cursor-pointer items-center gap-1.5 px-4 py-3 text-sm font-bold text-primary"><Plus className="h-4 w-4" /> নতুন স্লাইড</summary>
          <SlideForm nextOrder={nextOrder} />
        </details>
      </section>

      <section className={card}>
        <h2 className={heading}><ImageIcon className="h-4 w-4 text-gold" /> পাইকারি ব্যানার</h2>
        {promos.map((b) => (
          <form key={b.id} action={savePromo} className="space-y-3 border-t border-gray-100 p-4">
            <input type="hidden" name="id" value={b.id} />
            <p className="font-sans text-xs font-bold text-gray-500">{b.position}</p>
            <Field label="শিরোনাম" name="titleBn" value={b.titleBn} />
            <Field label="সাব-টাইটেল" name="subtitleBn" value={b.subtitleBn ?? ""} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="বাটন লেবেল" name="ctaTextBn" value={b.ctaTextBn ?? ""} />
              <Field label="লিংক" name="ctaLink" value={b.ctaLink ?? ""} />
              <Field label="ছবির পাথ / URL" name="imageUrl" value={b.imageUrl ?? ""} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-primary">
                <input type="checkbox" name="isActive" defaultChecked={b.isActive} className="h-4 w-4 accent-primary" /> সক্রিয়
              </label>
              <SaveButton label="ব্যানার সেভ করুন" />
            </div>
          </form>
        ))}
      </section>

      <section className={card}>
        <h2 className={heading}><LayoutPanelTop className="h-4 w-4 text-gold" /> সেবা স্ট্রিপ ও ক্যাটাগরি সাব-টাইটেল</h2>
        <form action={saveHomepageCopy} className="space-y-3 border-t border-gray-100 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {trust.map((t, i) => (
              <Field key={i} label={`সেবা ${i + 1}`} name={`trust-${i}`} value={t.title} />
            ))}
            {categories.map((c) => (
              <Field key={c.slug} label={`${c.nameBn} — সাব-টাইটেল`} name={`subtitle-${c.slug}`} value={subtitles[c.slug] ?? ""} />
            ))}
          </div>
          <p className="text-xs text-amber-800">রিটার্ন/এক্সচেঞ্জ সুবিধা নিশ্চিত হওয়ার আগে ৪র্থ সেবাটিকে প্রতিশ্রুতি হিসেবে লিখবেন না।</p>
          <div className="flex justify-end"><SaveButton label="সেভ করুন" /></div>
        </form>
      </section>
    </>
  );
}
