import React from "react";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";

/**
 * "Stay in touch" strip. The shop has no email list, so updates are requested over WhatsApp,
 * where the message really reaches the owner.
 */
export function NewsletterSection({ whatsappUrl }: { whatsappUrl?: string | null }) {
  const base = whatsappUrl || "https://wa.me/8801749160444";
  const href = `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent("আসসালামু আলাইকুম। নতুন সংগ্রহ ও অফারের খবর পেতে চাই।")}`;

  return (
    <section className="py-4 sm:py-5">
      <div className="shell">
        <div className="reveal-item flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#B68A3E]/50 bg-[linear-gradient(110deg,#041B0C,#0D3A1B_55%,#041B0C)] px-5 py-5 text-center shadow-lg md:flex-row md:text-left lg:px-10">
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
            <Mail aria-hidden className="h-9 w-9 shrink-0 text-[#EACB85]" strokeWidth={1.4} />
            <h2 className="text-[clamp(16px,1.7vw,24px)] font-bold leading-snug text-[#FCF7EA]">
              নতুন সংগ্রহ ও অফারের খবর পেতে <span className="md:block">আমাদের সাথে থাকুন</span>
            </h2>
          </div>
          <a href={href} target="_blank" rel="noopener noreferrer" className="gold-button shine shine-auto !rounded-full px-7 py-3 text-sm sm:text-base">
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp-এ যোগাযোগ করুন
          </a>
        </div>
      </div>
    </section>
  );
}
