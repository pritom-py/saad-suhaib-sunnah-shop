"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Layers, Boxes, ShoppingCart, CreditCard, Building2, Sliders, Settings } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/products", label: "পণ্যসমূহ (Products)", icon: Package },
  { href: "/admin/categories", label: "ক্যাটাগরি (Categories)", icon: Layers },
  { href: "/admin/inventory", label: "ইনভেন্টরি ও স্টক", icon: Boxes },
  { href: "/admin/orders", label: "অর্ডারসমূহ (Orders)", icon: ShoppingCart },
  { href: "/admin/payments", label: "পেমেন্ট ভেরিফিকেশন", icon: CreditCard },
  { href: "/admin/wholesale", label: "পাইকারি অনুসন্ধান", icon: Building2 },
  { href: "/admin/cms", label: "ব্যানার ও CMS", icon: Sliders },
  { href: "/admin/settings", label: "সেটিংস ও চার্জ", icon: Settings },
];

export function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="অ্যাডমিন মেনু" className={horizontal ? "flex gap-1 overflow-x-auto px-2 py-2" : "space-y-1 p-3"}>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
              active ? "text-[#001c13] [background:var(--gold-button-gradient)]" : "text-[#dcebe1] hover:bg-white/10 hover:text-[#f6d77a]"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-[#001c13]" : "text-[#e9bc52]"}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
