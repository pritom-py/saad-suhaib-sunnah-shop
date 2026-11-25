import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Save } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/actions/admin-products.action";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { displayOrder: "asc" } }, variants: true } }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);
  if (!product) notFound();

  const save = async (formData: FormData) => {
    "use server";
    await requireAdmin();
    const text = (k: string) => ((formData.get(k) as string) || "").trim();
    const price = text("regularPrice");
    const imageUrl = text("imageUrl");

    const res = await updateProductAction(product.id, {
      nameBn: text("nameBn"),
      nameEn: text("nameEn"),
      categoryId: text("categoryId"),
      regularPrice: price || null,
      salePrice: product.salePrice,
      wholesalePrice: text("wholesalePrice") || null,
      minWholesaleQty: product.minWholesaleQty,
      stockQuantity: text("stockQuantity"),
      shortDescBn: text("shortDescBn"),
      shortDescEn: product.shortDescEn,
      descBn: text("descBn"),
      descEn: product.descEn,
      unitOfSale: product.unitOfSale,
      isPublished: formData.get("isPublished") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      isNewArrival: product.isNewArrival,
      isIslamicCap: formData.get("isIslamicCap") === "on",
    });
    if (!res.success) redirect(`/admin/products/${product.id}/edit?error=1`);

    // Size prices override the base price, so keep sizes that followed it in step.
    await prisma.productVariant.updateMany({
      where: { productId: product.id, OR: [{ price: product.regularPrice }, { price: null }] },
      data: { price: price ? Number(price) : null },
    });

    if (imageUrl && imageUrl !== product.images[0]?.url) {
      if (product.images[0]) {
        await prisma.productImage.update({ where: { id: product.images[0].id }, data: { url: imageUrl } });
      } else {
        await prisma.productImage.create({ data: { productId: product.id, url: imageUrl, isPrimary: true } });
      }
    }
    revalidatePath(`/product/${product.slug}`);
    redirect("/admin/products");
  };

  const field = (name: string, label: string, value: string | number | null, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block space-y-1">
      <span className="text-xs font-bold text-primary">{label}</span>
      <input name={name} defaultValue={value ?? ""} className="field" {...props} />
    </label>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 font-bengali">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" aria-label="পণ্য তালিকায় ফিরুন" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-primary">পণ্য সম্পাদনা</h1>
          <p className="font-sans text-xs text-gray-500">{product.sku}</p>
        </div>
      </div>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">পণ্য সংরক্ষণ করা যায়নি। তথ্যগুলো যাচাই করুন।</p>}

      <form action={save} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("nameBn", "বাংলা নাম *", product.nameBn, { required: true })}
          {field("nameEn", "ইংরেজি নাম *", product.nameEn, { required: true })}
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-primary">ক্যাটাগরি</span>
          <select name="categoryId" defaultValue={product.categoryId} className="field">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameBn}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("regularPrice", "খুচরা মূল্য (৳)", product.regularPrice, { type: "number", min: 0, step: "any" })}
          {field("wholesalePrice", "পাইকারি মূল্য (৳)", product.wholesalePrice, { type: "number", min: 0, step: "any" })}
          {field("stockQuantity", "স্টক পরিমাণ", product.stockQuantity, { type: "number", min: 0, required: true })}
        </div>
        {product.variants.length > 0 && (
          <p className="text-xs text-gray-500">এই পণ্যে {product.variants.length} টি সাইজ আছে। যে সাইজগুলোর দাম মূল দামের সমান, সেগুলোও নতুন দামে আপডেট হবে।</p>
        )}
        {field("imageUrl", "প্রধান ছবির পাথ (যেমন /products/clean/makra-tupi.jpg)", product.images[0]?.url ?? "")}
        {field("shortDescBn", "সংক্ষিপ্ত বিবরণ", product.shortDescBn)}
        <label className="block space-y-1">
          <span className="text-xs font-bold text-primary">বিস্তারিত বিবরণ</span>
          <textarea name="descBn" rows={4} defaultValue={product.descBn ?? ""} className="field" />
        </label>
        <div className="flex flex-wrap gap-5 text-sm font-bold text-primary">
          {[
            ["isPublished", "প্রকাশিত", product.isPublished],
            ["isFeatured", "জনপ্রিয় পণ্যে দেখান", product.isFeatured],
            ["isIslamicCap", "ইসলামি টুপি", product.isIslamicCap],
          ].map(([name, label, checked]) => (
            <label key={name as string} className="flex items-center gap-2">
              <input type="checkbox" name={name as string} defaultChecked={checked as boolean} className="h-4 w-4 accent-primary" />
              {label as string}
            </label>
          ))}
        </div>
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button type="submit" className="btn-emerald px-6 py-2.5 text-sm">
            <Save className="h-4 w-4 text-[#f6d77a]" /> পরিবর্তন সেভ করুন
          </button>
        </div>
      </form>
    </div>
  );
}
