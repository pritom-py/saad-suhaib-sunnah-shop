"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";

/** Call / WhatsApp shortcuts. They appear after scrolling, so they never cover the header or hero. */
export function FloatingSupport({
  phone = "+880 1749160444",
  whatsappUrl = "https://wa.me/8801749160444",
}: {
  phone?: string;
  whatsappUrl?: string;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // hide again near the footer, which already carries the same links
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 260;
      setVisible(window.scrollY > 500 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (!visible || pathname.startsWith("/checkout")) return null;

  return (
    <div className="fixed bottom-[68px] right-3 z-30 flex flex-col gap-2.5 motion-safe:animate-[rise_250ms_ease] md:bottom-5 md:right-5">
      <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} aria-label="ফোনে কল করুন" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#063d2b] text-[#f6d77a] shadow-lg transition-transform hover:scale-110">
        <Phone className="h-5 w-5" />
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110">
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
