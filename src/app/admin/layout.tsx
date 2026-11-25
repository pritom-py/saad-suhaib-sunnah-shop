import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { adminLogoutAction } from "@/actions/admin-auth.action";
import { AdminNav } from "@/components/admin/AdminNav";
import { ExternalLink, LogOut, Shield } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Signed out, only the login screen renders here (every other page redirects), so no sidebar.
  if (!session) return <div className="min-h-screen bg-[#f6f5f0] font-bengali">{children}</div>;

  const logout = (
    <form action={adminLogoutAction}>
      <button type="submit" title="লগআউট" aria-label="লগআউট" className="rounded-md p-1.5 text-red-300 transition-colors hover:bg-red-900/40 hover:text-red-100">
        <LogOut className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5f0] font-bengali md:flex-row">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r-2 border-[#d4af37]/50 bg-gradient-to-b from-[#063d2b] to-[#001c13] text-[#fffcf3] md:flex">
        <div>
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <Image src="/logo/logo-circle.png" alt="লোগো" width={44} height={44} className="h-11 w-11 rounded-full" />
            <div>
              <p className="text-sm font-bold leading-tight text-[#f6d77a]">সাদ সুহাইব</p>
              <p className="font-sans text-[10px] tracking-wide text-emerald-200">ADMIN CMS</p>
            </div>
          </div>
          <AdminNav />
        </div>

        <div className="space-y-2 border-t border-white/10 p-3 text-xs">
          <Link href="/" target="_blank" className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-emerald-100 transition-colors hover:text-[#f6d77a]">
            <span>ওয়েবসাইট দেখুন</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center justify-between rounded-lg bg-black/20 p-2.5">
            <div className="overflow-hidden">
              <p className="truncate font-bold">{session.name}</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-300">
                <Shield className="h-3 w-3 text-[#e9bc52]" />
                {session.role}
              </p>
            </div>
            {logout}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-[#063d2b] text-[#fffcf3] md:hidden">
          <div className="flex items-center justify-between px-3 pt-2">
            <p className="flex items-center gap-2 text-sm font-bold text-[#f6d77a]">
              <Image src="/logo/logo-circle.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
              অ্যাডমিন CMS
            </p>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-1 text-xs font-bold">
                সাইট দেখুন <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              {logout}
            </div>
          </div>
          <AdminNav horizontal />
          <div className="gold-line" />
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
