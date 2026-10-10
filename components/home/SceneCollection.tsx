"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import LuxButton from "@/components/ui/LuxButton";
import SplitReveal from "@/components/ui/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { PRODUCTS, type CategorySlug } from "@/data/products";

const TABS: { label: string; cats: CategorySlug[] | null; href: string }[] = [
  { label: "All", cats: null, href: "/shop" },
  { label: "Silk Sarees", cats: ["silk-sarees"], href: "/shop?cat=silk-sarees" },
  { label: "Designer Sarees", cats: ["designer-sarees", "occasion-wear"], href: "/collections/sarees" },
  { label: "Lehengas", cats: ["designer-lehengas", "tops-and-skirts"], href: "/collections/lehengas" },
  { label: "Bridal", cats: ["bridal-sarees", "bridal-collections"], href: "/collections/bridal" },
  { label: "Anarkali", cats: ["anarkali-gowns"], href: "/collections/anarkali" },
];

/** Hand-picked opening edit for the "All" view. */
const EDIT = [
  "peacock-green-kanchipuram-silk", "maroon-zardozi-lehenga", "rose-and-ruby-designer-saree", "sindoor-red-bridal-silk-saree",
  "pearl-white-flared-anarkali", "royal-navy-butta-silk-saree", "emerald-cascade-lehenga", "the-rajkumari-bridal-look", "sage-tissue-designer-saree",
];

/**
 * SCENE 5 — The Collection Gallery.
 * Motion steps back: warm ivory, an asymmetric editorial grid (one hero piece
 * + eight), and category tabs that re-flow the grid in place.
 */
export default function SceneCollection() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);

  const list = useMemo(() => {
    const cats = TABS[tab].cats;
    if (!cats) return EDIT.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is (typeof PRODUCTS)[number] => !!p);
    return PRODUCTS.filter((p) => cats.includes(p.category)).slice(0, 9);
  }, [tab]);
  const total = TABS[tab].cats ? PRODUCTS.filter((p) => TABS[tab].cats!.includes(p.category)).length : PRODUCTS.length;

  const choose = (i: number) => {
    if (i === tab) return;
    const cards = grid.current?.querySelectorAll(".card");
    if (!cards || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTab(i); return; }
    gsap.to(cards, {
      autoAlpha: 0, y: 24, duration: 0.35, stagger: 0.02, ease: "power2.in",
      onComplete: () => {
        setTab(i);
        requestAnimationFrame(() => {
          const next = grid.current?.querySelectorAll(".card");
          if (next) gsap.fromTo(next, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.05, ease: "expo.out" });
        });
      },
    });
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".gallery .card", { y: 70, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, stagger: 0.07, duration: 1.3, ease: "expo.out",
        scrollTrigger: { trigger: ".gallery", start: "top 85%", once: true },
      });
      gsap.fromTo(".coll__rule", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: ".coll__head", start: "top 80%", once: true } });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="coll" id="collection" aria-labelledby="coll-title">
      <div className="container">
        <div className="coll__head">
          <p className="kicker kicker--dark">The Collection</p>
          <SplitReveal as="h2" text="Pieces to be kept" className="coll__title" mode="chars" />
          <span className="coll__rule" aria-hidden="true" />
          <p className="coll__lead">Silk and designer sarees, lehengas, Anarkalis and bridal couture — {PRODUCTS.length} pieces, each one viewable at the boutique.</p>
        </div>

        <div className="tabs" role="tablist" aria-label="Filter the collection">
          {TABS.map((t, i) => (
            <button key={t.label} role="tab" aria-selected={i === tab} className={`tab ${i === tab ? "is-active" : ""}`} onClick={() => choose(i)} data-cursor="hover">
              {t.label}
            </button>
          ))}
        </div>

        <div className="gallery" ref={grid} role="tabpanel" aria-live="polite">
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} size={i === 0 ? "lg" : "md"} />)}
        </div>

        <div className="coll__foot">
          <LuxButton href={TABS[tab].href} variant="solid">{tab === 0 ? "View the Collection" : `Shop all ${TABS[tab].label}`}</LuxButton>
          <p className="coll__count">{total} pieces</p>
          <Link href="/wishlist" className="text-link">Your wishlist</Link>
        </div>
      </div>
    </section>
  );
}
