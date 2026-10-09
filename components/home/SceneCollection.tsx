"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import Marquee from "@/components/ui/Marquee";
import SplitReveal from "@/components/ui/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { CATEGORIES, PRODUCTS, type CategorySlug } from "@/data/products";

const TABS: { label: string; cats: CategorySlug[] | null }[] = [
  { label: "All", cats: null },
  { label: "Silk Sarees", cats: ["silk-sarees"] },
  { label: "Designer", cats: ["designer-sarees", "occasion-wear"] },
  { label: "Bridal", cats: ["bridal-sarees", "bridal-collections"] },
  { label: "Lehengas", cats: ["designer-lehengas", "tops-and-skirts"] },
  { label: "Anarkali", cats: ["anarkali-gowns"] },
];

/**
 * SCENE 06 — The Collection.
 * Motion steps back here: an ivory, comfortable browsing surface with
 * category tabs that re-flow the grid in place (no page interruption).
 */
export default function SceneCollection() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);

  const list = useMemo(() => {
    const cats = TABS[tab].cats;
    const pool = cats ? PRODUCTS.filter((p) => cats.includes(p.category)) : PRODUCTS.filter((_, i) => i % 3 === 0);
    return pool.slice(0, 8);
  }, [tab]);

  const choose = (i: number) => {
    if (i === tab) return;
    const cards = grid.current?.querySelectorAll(".card");
    if (!cards || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTab(i); return; }
    gsap.to(cards, {
      opacity: 0, y: 30, duration: 0.3, stagger: 0.02, ease: "power2.in",
      onComplete: () => {
        setTab(i);
        requestAnimationFrame(() => {
          const next = grid.current?.querySelectorAll(".card");
          if (next) gsap.fromTo(next, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" });
        });
      },
    });
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".coll__cat", {
        y: 80, opacity: 0, stagger: 0.07, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".coll__cats", start: "top 85%", once: true },
      });
      gsap.from(".coll__grid .card", {
        y: 60, opacity: 0, stagger: 0.06, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".coll__grid", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="coll" id="collection" aria-labelledby="coll-title">
      <Marquee items={["Silk Sarees", "Designer Lehengas", "Bridal Couture", "Anarkali Gowns", "Handlooms", "Occasion Wear"]} />
      <div className="coll__head container">
        <p className="eyebrow">Scene 06 · The Collection</p>
        <SplitReveal as="h2" text="Find your drape" className="coll__title" mode="chars" />
        <p className="coll__lead">{PRODUCTS.length} pieces across sarees, lehengas, Anarkalis and bridal couture. Reserve any piece on WhatsApp or add it to your bag.</p>
      </div>

      <div className="coll__cats container">
        {CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.slug)).slice(0, 6).map((c) => (
          <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="coll__cat" data-cursor-label="Shop">
            <span className="coll__cat-img"><Img id={c.cover} alt="" ratio={1.25} width={500} sizes="(max-width: 820px) 33vw, 15vw" /></span>
            <span className="coll__cat-name">{c.name}</span>
          </Link>
        ))}
      </div>

      <div className="container">
        <div className="tabs" role="tablist" aria-label="Filter the collection">
          {TABS.map((t, i) => (
            <button key={t.label} role="tab" aria-selected={i === tab} className={`tab ${i === tab ? "is-active" : ""}`} onClick={() => choose(i)} data-cursor="hover">
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid coll__grid" ref={grid} role="tabpanel" aria-live="polite">
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
        <div className="coll__foot">
          <LuxButton href="/shop">Shop all {PRODUCTS.length} pieces</LuxButton>
          <Link href="/wishlist" className="text-link">Your wishlist <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}
