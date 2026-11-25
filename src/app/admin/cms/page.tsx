import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateContentPageAction } from "@/actions/admin-cms.action";
import { HomepageEditors } from "./HomepageEditors";
import { FileText } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  await requireAdmin();
  const contentPages = await prisma.contentPage.findMany({ orderBy: { slug: "asc" } });

  const handleUpdatePage = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const slug = formData.get("slug") as string;
    const titleBn = formData.get("titleBn") as string;
    const contentBn = formData.get("contentBn") as string;

    await updateContentPageAction(slug, {
      titleBn,
      titleEn: titleBn,
      contentBn,
      contentEn: contentBn,
      isPublished: true,
    });
    revalidatePath(`/${slug}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-bengali">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-primary">ওয়েবসাইট CMS ও কনটেন্ট ম্যানেজমেন্ট</h1>
        <p className="text-xs text-gray-500">
          হোমপেজের মূল হিরো ব্যানার, স্লোগান এবং পলিসি পেইজগুলোর টেক্সট কোনো কোডিং ছাড়াই পরিবর্তন করুন।
        </p>
      </div>

      <HomepageEditors />

      {/* Content Pages */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-primary border-b border-gray-100 pb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold" />
          <span>পলিসি ও তথ্য পেজ ব্যবস্থাপনা</span>
        </h3>

        <div className="space-y-6">
          {contentPages.map((page) => (
            <form
              key={page.id}
              action={handleUpdatePage}
              className="p-4 rounded-xl bg-[#FBF7EC]/40 border border-[#E5D9BD] space-y-3"
            >
              <input type="hidden" name="slug" value={page.slug} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary font-sans">
                  /{page.slug}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">প্রকাশিত</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">পেজের শিরোনাম</label>
                <input
                  type="text"
                  name="titleBn"
                  defaultValue={page.titleBn}
                  className="w-full bg-white border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">কনটেন্ট</label>
                <textarea
                  name="contentBn"
                  rows={3}
                  defaultValue={page.contentBn}
                  className="w-full bg-white border border-[#E5D9BD] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-ivory text-xs font-bold shadow-sm transition-colors"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
