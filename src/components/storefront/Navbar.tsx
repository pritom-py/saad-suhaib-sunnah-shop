"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Home } from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/** entries that join the bar only on very wide screens; the mobile menu and footer always have them */
const WIDE_ONLY = ["/category/quran-covers", "/offers", "/contact"];

export function Navbar({ links }: { links: NavLinkItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <nav aria-label="প্রধান মেনু" className="sticky top-0 z-40 bg-[#082B13] border-b border-[#B68A3E]/30 text-[#FCF7EA]">
      <div className="shell flex h-11 lg:h-12 items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="flex items-center gap-2 rounded py-1 px-2 text-[14px] font-semibold text-[#EACB85] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>মেনু</span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden h-full min-w-0 flex-1 items-center justify-between gap-0.5 lg:flex xl:justify-center xl:gap-3">
          {links.map((link) => {
            const active = isActive(link.href);
            const hasMenu = !!link.children?.length;
            const isHome = link.href === "/";

            return (
              <li
                key={link.href}
                className={`relative h-full items-center ${WIDE_ONLY.includes(link.href) ? "hidden 2xl:flex" : "flex"}`}
                onMouseEnter={() => setOpenMenu(hasMenu ? link.href : null)}
                onMouseLeave={() => setOpenMenu(null)}
                onKeyDown={(e) => e.key === "Escape" && setOpenMenu(null)}
                onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpenMenu(null)}
              >
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1 whitespace-nowrap rounded px-2 py-1.5 text-[14px] font-semibold transition-all xl:px-3 xl:text-[16px] ${
                    isHome
                      ? "bg-[#710D17] text-white hover:bg-[#8B1822]"
                      : active
                      ? "bg-[#263D20] text-[#EACB85]"
                      : "text-[#FCF7EA] hover:text-[#EACB85] hover:bg-white/[0.05]"
                  }`}
                >
                  {isHome && <Home className="h-3.5 w-3.5 text-[#EACB85]" />}
                  <span>{link.label}</span>
                  {hasMenu && (
                    <ChevronDown className="h-3 w-3 opacity-75" />
                  )}
                </Link>

                <AnimatePresence>
                  {hasMenu && openMenu === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 min-w-[200px] rounded-b-lg border border-[#B68A3E]/40 bg-[#082B13] py-2 shadow-xl"
                    >
                      {link.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-1.5 text-xs font-medium text-[#FCF7EA] hover:bg-[#263D20] hover:text-[#EACB85] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden lg:hidden bg-[#041B0C] border-t border-[#B68A3E]/20"
          >
            <ul className="shell py-2 divide-y divide-white/10">
              {links.map((link) => (
                <li key={link.href} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 py-2 text-[14px] font-semibold ${
                        isActive(link.href) ? "text-[#EACB85]" : "text-[#FCF7EA]"
                      }`}
                    >
                      {link.href === "/" && <Home className="h-4 w-4 text-[#EACB85]" />}
                      {link.label}
                    </Link>
                    {!!link.children?.length && (
                      <button
                        onClick={() => setExpanded(expanded === link.href ? null : link.href)}
                        className="p-2 text-[#EACB85]"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expanded === link.href ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                  {expanded === link.href && (
                    <ul className="pl-4 pb-2 space-y-1">
                      {link.children?.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-xs text-[#EACB85]/90 hover:text-white"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
