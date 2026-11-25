"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/locale";

interface Suggestion {
  id: string;
  slug: string;
  nameBn: string;
  regularPrice: number | null;
  images: { url: string }[];
}

export function SearchAutocomplete() {
  const router = useRouter();
  const pathname = usePathname();
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const q = query.trim();
    setActive(-1);
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const ctrl = new AbortController();
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const json = await res.json();
        setResults((json.data || []).slice(0, 6));
        setStatus("done");
      } catch {
        if (!ctrl.signal.aborted) setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) router.push(`/product/${results[active].slug}`);
    else router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search" className="flex h-10 overflow-hidden rounded-[9px] border border-[#cfa74a] bg-white shadow-[0_3px_10px_rgba(140,90,10,0.14)] focus-within:ring-2 focus-within:ring-[#d4af37]/40 xl:h-11">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="পণ্য খুঁজুন"
          placeholder="আপনার পছন্দের পণ্য খুঁজুন..."
          className="min-w-0 flex-1 bg-transparent px-3.5 text-[13px] text-[#18231d] placeholder:text-[#70746e] focus:outline-none xl:text-[15px]"
        />
        <button type="submit" aria-label="অনুসন্ধান করুন" className="flex w-12 items-center justify-center bg-gradient-to-b from-[#12563d] to-[#002b1d] text-[#f6d77a] transition hover:brightness-125 xl:w-14">
          <Search className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </button>
      </form>

      {showPanel && (
        <div id={listId} role="listbox" className="absolute inset-x-0 top-full z-[70] mt-1.5 overflow-hidden rounded-xl border border-[#d9bd72] bg-[#fffcf3] shadow-[0_18px_40px_rgba(0,43,29,0.22)] motion-safe:animate-[rise_180ms_ease]">
          {status === "loading" && (
            <p className="flex items-center gap-2 px-3 py-3 text-sm text-[#4f5a53]">
              <Loader2 className="h-4 w-4 animate-spin text-[#b47b19]" /> খোঁজা হচ্ছে...
            </p>
          )}
          {status === "error" && <p className="px-3 py-3 text-sm text-[#780e15]">অনুসন্ধান করা যায়নি। আবার চেষ্টা করুন।</p>}
          {status === "done" && results.length === 0 && <p className="px-3 py-3 text-sm text-[#4f5a53]">কোনো পণ্য পাওয়া যায়নি।</p>}
          {status === "done" &&
            results.map((p, i) => (
              <Link
                key={p.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={active === i}
                href={`/product/${p.slug}`}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 border-b border-[#efe3c1] px-3 py-2 last:border-0 ${active === i ? "bg-[#f7efdc]" : ""}`}
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-[#e3d3a8] bg-[#f7efdc]">
                  {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#063d2b]">{p.nameBn}</span>
                <span className="shrink-0 text-sm font-bold text-[#780e15]">
                  {p.regularPrice === null ? "যোগাযোগ" : formatPrice(p.regularPrice)}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
