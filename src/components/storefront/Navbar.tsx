"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toBengaliNumber } from "@/lib/locale";

export interface NavLinkItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] shrink-0 fill-[#f6d77a]" aria-hidden>
    <path d="M12 3 2 11.5h2.7V21h5.1v-6h4.4v6h5.1v-9.5H22L12 3Z" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[21px] w-[21px] fill-[#f6d77a]" aria-hidden>
    <circle cx="12" cy="7.5" r="4.5" />
    <path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5h-17Z" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[23px] w-[23px] fill-none stroke-[#f6d77a]" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h9.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" />
    <circle cx="9.5" cy="20.5" r="1.3" />
    <circle cx="18" cy="20.5" r="1.3" />
  </svg>
);

export function Navbar({ links }: { links: NavLinkItem[] }) {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <nav aria-label="প্রধান মেনু" className="sticky top-0 z-40 bg-gradient-to-b from-[#0a4b35] via-[#063d2b] to-[#002b1d] text-[#fffcf3] shadow-[0_4px_14px_rgba(0,28,19,0.35)]">
      <div className="gold-line !h-px" />
      <div className="shell flex h-11 items-center justify-between gap-2 lg:h-[clamp(39px,3.5vw,50px)] lg:!px-[clamp(10px,1.7vw,30px)]">
        <button onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-controls="mobile-menu" className="flex items-center gap-2 rounded-md py-2 pr-3 text-[15px] font-semibold lg:hidden">
          {mobileOpen ? <X className="h-6 w-6 text-[#f6d77a]" /> : <Menu className="h-6 w-6 text-[#f6d77a]" />}
          মেনু
        </button>

        <ul className="hidden h-full min-w-0 flex-1 items-stretch justify-between lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            const hasMenu = !!link.children?.length;
            return (
              <li
                key={link.href}
                className={`group relative flex items-stretch ${active ? "bg-gradient-to-b from-[#1d7552] to-[#0d4d36]" : "hover:bg-white/[0.07]"}`}
                onMouseEnter={() => setOpenMenu(hasMenu ? link.href : null)}
                onMouseLeave={() => setOpenMenu(null)}
                onKeyDown={(e) => e.key === "Escape" && setOpenMenu(null)}
                onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpenMenu(null)}
              >
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1 whitespace-nowrap pl-[clamp(4px,0.7vw,13px)] font-semibold transition-colors text-[clamp(12.5px,1.16vw,16.5px)] group-hover:text-[#f6d77a] ${hasMenu ? "pr-0.5" : "pr-[clamp(4px,0.7vw,13px)]"} ${active ? "text-white" : ""}`}
                >
                  {link.href === "/" && <HomeIcon />}
                  {link.label}
                </Link>
                {hasMenu && (
                  <button aria-label={`${link.label} সাবমেনু`} aria-expanded={openMenu === link.href} onClick={() => setOpenMenu(openMenu === link.href ? null : link.href)} className="flex items-center pr-1 text-[#f6d77a]">
                    <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === link.href ? "rotate-180" : ""}`} />
                  </button>
                )}
                <span aria-hidden className={`absolute inset-x-1.5 bottom-0 h-[3px] rounded-t-full transition-transform duration-300 [background:var(--gold-gradient)] ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                <AnimatePresence>
                  {hasMenu && openMenu === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full z-50 max-h-[70vh] w-64 overflow-y-auto rounded-b-xl border border-[#d9bd72] bg-[#fffcf3] py-1.5 shadow-[0_18px_36px_rgba(0,43,29,0.25)]"
                    >
                      {link.children!.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm font-semibold text-[#063d2b] transition-colors hover:bg-[#f7efdc] hover:text-[#780e15]">
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

        <div className="flex shrink-0 items-center gap-0.5">
          <Link href="/track-order" title="আমার অর্ডার ট্র্যাক করুন" aria-label="আমার অর্ডার ট্র্যাক করুন" className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10">
            <UserIcon />
          </Link>
          <button onClick={() => setIsCartOpen(true)} aria-label={`শপিং কার্ট, ${totalItems} টি পণ্য`} className="relative flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10">
            <CartIcon />
            <motion.span
              key={totalItems}
              initial={totalItems ? { scale: 1.6 } : false}
              animate={{ scale: 1 }}
              transition={{ duration: 0.28 }}
              className="absolute -right-0.5 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#d3202b] px-1 text-[10px] font-bold leading-none text-white ring-1 ring-white/70"
            >
              {toBengaliNumber(totalItems)}
            </motion.span>
          </button>
        </div>
      </div>
      <div className="gold-line !h-px" />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="shell max-h-[70vh] overflow-y-auto py-2">
              {links.map((link) => (
                <li key={link.href} className="border-b border-white/10 last:border-0">
                  <div className="flex items-center">
                    <Link href={link.href} onClick={() => setMobileOpen(false)} className={`flex flex-1 items-center gap-2 py-2.5 text-[15px] font-semibold ${isActive(link.href) ? "text-[#f6d77a]" : ""}`}>
                      {link.href === "/" && <HomeIcon />}
                      {link.label}
                    </Link>
                    {!!link.children?.length && (
                      <button aria-label={`${link.label} সাবমেনু`} aria-expanded={expanded === link.href} onClick={() => setExpanded(expanded === link.href ? null : link.href)} className="p-2.5 text-[#f6d77a]">
                        <ChevronDown className={`h-5 w-5 transition-transform ${expanded === link.href ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {expanded === link.href && (
                    <ul className="mb-2 rounded-lg bg-[#fffcf3] py-1">
                      {link.children?.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm font-semibold text-[#063d2b]">
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
