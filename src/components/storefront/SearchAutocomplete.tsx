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
      <form
        onSubmit={submit}
        role="search"
        className="flex h-10 overflow-hidden rounded-md bg-white border border-[#E3D6BC] focus-within:border-[#B68A3E] focus-within:ring-1 focus-within:ring-[#B68A3E]"
      >
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
          placeholder="পণ্য খুঁজুন (যেমন: টুপি, পাগড়ি, রুমাল...)"
          className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-[#14291B] placeholder:text-[#746B5B]/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="অনুসন্ধান করুন"
          className="flex w-10 sm:w-11 items-center justify-center text-[#746B5B] hover:text-[#082B13] transition-colors"
        >
          <Search className="h-4 w-4 text-[#746B5B]" strokeWidth={2} />
        </button>
      </form>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-[70] mt-1 overflow-hidden rounded-lg border border-[#E3D6BC] bg-[#FCF7EA] shadow-lg"
        >
          {status === "loading" && (
            <p className="flex items-center gap-2 px-3 py-2.5 text-xs text-[#746B5B]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#B68A3E]" /> খোঁজা হচ্ছে...
            </p>
          )}
          {status === "error" && <p className="px-3 py-2 text-xs text-[#710D17]">অনুসন্ধান করা যায়নি।</p>}
          {status === "done" && results.length === 0 && <p className="px-3 py-2 text-xs text-[#746B5B]">কোনো পণ্য পাওয়া যায়নি।</p>}
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
                className={`flex items-center gap-3 border-b border-[#E3D6BC]/50 px-3 py-2 last:border-0 ${active === i ? "bg-[#F4EAD7]" : ""}`}
              >
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-[#E3D6BC] bg-white">
                  {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="36px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#082B13]">{p.nameBn}</span>
                <span className="shrink-0 text-xs font-bold text-[#710D17]">
                  {p.regularPrice === null ? "যোগাযোগ" : formatPrice(p.regularPrice)}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
