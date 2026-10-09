"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { CATEGORIES, COLORS, PRODUCTS, type CategorySlug, type Product } from "@/data/products";
import { formatINR, whatsappLink } from "@/data/site";
import { searchProducts } from "@/lib/search";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const PRICE_BANDS = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u10", label: "Under ₹10,000", min: 0, max: 9999 },
  { id: "10-20", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { id: "20-35", label: "₹20,000 – ₹35,000", min: 20001, max: 35000 },
  { id: "35p", label: "Above ₹35,000", min: 35001, max: Infinity },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

const PAGE = 16;

type Props = { lockedCategories?: CategorySlug[]; title?: string };

export default function ShopClient({ lockedCategories }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const grid = useRef<HTMLDivElement>(null);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cats, setCats] = useState<CategorySlug[]>(() => {
    const c = params.get("cat");
    return c ? (c.split(",").filter((x) => CATEGORIES.some((k) => k.slug === x)) as CategorySlug[]) : [];
  });
  const [price, setPrice] = useState(params.get("price") ?? "all");
  const [colors, setColors] = useState<string[]>(params.get("color")?.split(",").filter(Boolean) ?? []);
  const [sort, setSort] = useState(params.get("sort") ?? "featured");
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);

  // Re-sync when the URL changes from outside (e.g. mega-menu link while on /shop).
  useEffect(() => {
    setQ(params.get("q") ?? "");
    const c = params.get("cat");
    setCats(c ? (c.split(",").filter((x) => CATEGORIES.some((k) => k.slug === x)) as CategorySlug[]) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q"), params.get("cat")]);

  // Reflect filters in the URL (shareable, back-button friendly).
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (cats.length) sp.set("cat", cats.join(","));
    if (price !== "all") sp.set("price", price);
    if (colors.length) sp.set("color", colors.join(","));
    if (sort !== "featured") sp.set("sort", sort);
    const next = sp.toString();
    if (next !== params.toString()) router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
    setShown(PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cats, price, colors, sort]);

  useEffect(() => {
    if (!panel) return;
    lockScroll();
    return () => unlockScroll();
  }, [panel]);

  const base = useMemo(() => (lockedCategories ? PRODUCTS.filter((p) => lockedCategories.includes(p.category)) : PRODUCTS), [lockedCategories]);
  const availableCats = useMemo(
    () => CATEGORIES.filter((c) => !lockedCategories || lockedCategories.includes(c.slug)),
    [lockedCategories]
  );

  const results = useMemo(() => {
    let list: Product[] = q.trim() ? searchProducts(base, q) : base;
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    const band = PRICE_BANDS.find((b) => b.id === price) ?? PRICE_BANDS[0];
    list = list.filter((p) => p.price >= band.min && p.price <= band.max);
    if (colors.length) list = list.filter((p) => colors.includes(p.color));
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [base, q, cats, price, colors, sort]);

  // Soft re-flow animation whenever the result set changes.
  const key = results.map((r) => r.id).join("|");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.current?.querySelectorAll(".card");
    if (cards?.length) gsap.fromTo(cards, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.035, ease: "expo.out", overwrite: true });
  }, [key]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const usedColors = COLORS.filter((c) => base.some((p) => p.color === c.name));
  const active = cats.length + colors.length + (price !== "all" ? 1 : 0) + (q ? 1 : 0);
  const clearAll = () => { setQ(""); setCats([]); setPrice("all"); setColors([]); setSort("featured"); };
  const emptyCats = availableCats.filter((c) => !PRODUCTS.some((p) => p.category === c.slug));

  const filters = (
    <div className="filters">
      <div className="filters__group">
        <p className="filters__label">Category</p>
        {availableCats.map((c) => {
          const n = base.filter((p) => p.category === c.slug).length;
          return (
            <label key={c.slug} className={`check ${n === 0 ? "is-empty" : ""}`}>
              <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => setCats((x) => toggle(x, c.slug))} />
              <span>{c.name}</span>
              <sup>{n || "in store"}</sup>
            </label>
          );
        })}
      </div>
      <div className="filters__group">
        <p className="filters__label">Price</p>
        {PRICE_BANDS.map((b) => (
          <label key={b.id} className="check check--radio">
            <input type="radio" name="price" checked={price === b.id} onChange={() => setPrice(b.id)} />
            <span>{b.label}</span>
          </label>
        ))}
      </div>
      <div className="filters__group">
        <p className="filters__label">Colour</p>
        <div className="swatches">
          {usedColors.map((c) => (
            <button
              key={c.name}
              className={`swatch-btn ${colors.includes(c.name) ? "is-active" : ""}`}
              onClick={() => setColors((x) => toggle(x, c.name))}
              aria-pressed={colors.includes(c.name)}
              title={c.name}
            >
              <span className="swatch" style={{ background: c.hex }} />
              <span className="sr-only">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      {active > 0 && <button className="text-link" onClick={clearAll}>Clear all filters</button>}
    </div>
  );

  return (
    <div className="shop container">
      <div className="shop__bar">
        <label className="shop__search">
          <Search size={16} strokeWidth={1.5} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sarees, colours, occasions…" aria-label="Search products" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search"><X size={14} /></button>}
        </label>
        <p className="shop__count" aria-live="polite">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
        <button className="shop__filter-btn only-mobile" onClick={() => setPanel(true)}>
          <SlidersHorizontal size={15} /> Filters {active > 0 && <sup>{active}</sup>}
        </button>
        <label className="shop__sort">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {active > 0 && (
        <div className="chips">
          {q && <button className="chip" onClick={() => setQ("")}>“{q}” <X size={12} /></button>}
          {cats.map((c) => <button key={c} className="chip" onClick={() => setCats((x) => x.filter((y) => y !== c))}>{CATEGORIES.find((k) => k.slug === c)?.name} <X size={12} /></button>)}
          {price !== "all" && <button className="chip" onClick={() => setPrice("all")}>{PRICE_BANDS.find((b) => b.id === price)?.label} <X size={12} /></button>}
          {colors.map((c) => <button key={c} className="chip" onClick={() => setColors((x) => x.filter((y) => y !== c))}>{c} <X size={12} /></button>)}
        </div>
      )}

      <div className="shop__layout">
        <aside className="shop__aside only-desktop" aria-label="Filters">{filters}</aside>

        <div>
          {results.length === 0 ? (
            <div className="empty empty--shop">
              <p className="empty__title">Nothing here — yet.</p>
              {cats.length > 0 && cats.every((c) => emptyCats.some((e) => e.slug === c)) ? (
                <p>These pieces are currently available in the boutique only. Message us and we’ll share photos of what’s in store.</p>
              ) : (
                <p>Try removing a filter, or ask us — new pieces arrive at the boutique often.</p>
              )}
              <div className="empty__actions">
                <button className="text-link" onClick={clearAll}>Clear filters</button>
                <a className="text-link" href={whatsappLink("Hello Shambhavi Silks! Could you share photos of what's currently in store?")} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid--shop" ref={grid}>
                {results.slice(0, shown).map((p, i) => <ProductCard key={p.id} p={p} index={i} priority={i < 4} />)}
              </div>
              {shown < results.length && (
                <div className="shop__more">
                  <p>Showing {Math.min(shown, results.length)} of {results.length}</p>
                  <div className="shop__more-bar"><i style={{ transform: `scaleX(${shown / results.length})` }} /></div>
                  <button className="lux-btn lux-btn--ghost-dark" onClick={() => setShown((s) => s + PAGE)}>
                    <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Load more</span>
                  </button>
                </div>
              )}
            </>
          )}
          <p className="fine shop__note">All products and prices shown are demo content for this prototype. Range: {formatINR(Math.min(...PRODUCTS.map((p) => p.price)))} – {formatINR(Math.max(...PRODUCTS.map((p) => p.price)))}.</p>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <div className={`drawer-scrim ${panel ? "is-open" : ""}`} onClick={() => setPanel(false)} aria-hidden="true" />
      <div className={`sheet ${panel ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Filters" aria-hidden={!panel} data-lenis-prevent>
        <div className="sheet__head">
          <p>Filters</p>
          <button className="icon-btn" onClick={() => setPanel(false)} aria-label="Close filters"><X size={20} /></button>
        </div>
        {filters}
        <button className="lux-btn lux-btn--solid lux-btn--block" onClick={() => setPanel(false)}>
          <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Show {results.length} pieces</span>
        </button>
      </div>
    </div>
  );
}
