import { NextResponse } from "next/server";
import { searchProducts } from "@/services/storefront.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const isIslamicCap = searchParams.has("isIslamicCap")
      ? searchParams.get("isIslamicCap") === "true"
      : undefined;

    const products = await searchProducts({ q, category, sort, isIslamicCap });
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
