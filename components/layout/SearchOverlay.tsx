"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import Img from "@/components/ui/Img";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { formatINR } from "@/data/site";
import { useStore } from "@/lib/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { searchProducts } from "@/lib/search";

const SUGGESTIONS = ["Kanchipuram", "Bridal", "Lehenga", "Anarkali", "Emerald", "Red", "Organza"];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    lockScroll();
    const id = window.setTimeout(() => input.current?.focus(), 250);
    return () => { window.clearTimeout(id); unlockScroll(); };
  }, [searchOpen]);

  const results = useMemo(() => (q.trim() ? searchProducts(PRODUCTS, q).slice(0, 8) : []), [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className={`search ${searchOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Search the collection" aria-hidden={!searchOpen} data-lenis-prevent>
      <button className="search__close icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search" tabIndex={searchOpen ? 0 : -1}>
        <X size={24} strokeWidth={1.2} />
      </button>
      <div className="search__inner">
        <form onSubmit={submit} className="search__form" role="search">
          <label htmlFor="site-search" className="eyebrow">Search the collection</label>
          <input
            id="site-search"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Silk, bridal, emerald…"
            autoComplete="off"
            tabIndex={searchOpen ? 0 : -1}
          />
        </form>
        {!q && (
          <div className="search__suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setQ(s)} tabIndex={searchOpen ? 0 : -1} data-cursor="hover">{s}</button>
            ))}
            <div className="search__cats">
              {CATEGORIES.slice(0, 6).map((c) => (
                <Link key={c.slug} href={`/shop?cat=${c.slug}`} onClick={() => setSearchOpen(false)} tabIndex={searchOpen ? 0 : -1}>
                  {c.name} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        )}
        {q && (
          <div className="search__results">
            {results.length === 0 && <p className="search__empty">No pieces match “{q}”. Try a colour, fabric or occasion — or ask us on WhatsApp.</p>}
            {results.map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="search__hit" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="search__thumb"><Img id={p.images[0]} alt="" ratio={1.25} width={160} sizes="80px" /></span>
                <span className="search__hit-name">{p.name}</span>
                <span className="search__hit-price">{formatINR(p.price)}</span>
              </Link>
            ))}
            {results.length > 0 && (
              <button className="search__all" onClick={submit}>View all results <ArrowRight size={14} /></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
