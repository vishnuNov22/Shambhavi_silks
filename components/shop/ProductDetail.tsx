"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Minus, Plus, Share2, X } from "lucide-react";
import Img from "@/components/ui/Img";
import ZoomImage from "./ZoomImage";
import ProductCard from "./ProductCard";
import SplitReveal from "@/components/ui/SplitReveal";
import LuxButton from "@/components/ui/LuxButton";
import { PRODUCTS, getCategory, getProduct, relatedTo } from "@/data/products";
import { SITE, formatINR, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { enquiryMessage } from "@/lib/order";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const VIEW_LABELS = ["The look", "Border & drape detail", "Craft detail (representative)"];

export default function ProductDetail({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const cat = getCategory(p.category);
  const { addToCart, toggleWish, isWished, pushRecent, recent } = useStore();
  const [active, setActive] = useState(0);
  const [option, setOption] = useState(p.options?.values[0]);
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [open, setOpen] = useState<string | null>("details");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pushRecent(p.id);
    setActive(0);
    setOption(p.options?.values[0]);
    setQty(1);
  }, [p.id, p.options, pushRecent]);

  useEffect(() => {
    if (!lightbox) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % p.images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + p.images.length) % p.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { unlockScroll(); window.removeEventListener("keydown", onKey); };
  }, [lightbox, p.images.length]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".pdp__info > *:not(.pdp__title)", { y: 30, opacity: 0, stagger: 0.06, duration: 1, ease: "expo.out", delay: 0.6 });
      gsap.from(".pdp__main", { clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "expo.inOut", delay: 0.3 });
    },
    { scope: root, dependencies: [p.id] }
  );

  const related = relatedTo(p, 4);
  const recentList = recent.filter((id) => id !== p.id).map((id) => PRODUCTS.find((x) => x.id === id)).filter(Boolean).slice(0, 4);
  const wished = isWished(p.id);
  const url = `${SITE.url}/product/${p.slug}`;

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: p.name, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
    } catch { /* user cancelled */ }
  };

  const go = (d: number) => setActive((a) => (a + d + p.images.length) % p.images.length);

  return (
    <div ref={root} className="pdp">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/shop">Shop</Link><span>/</span>
          <Link href={`/shop?cat=${p.category}`}>{cat?.name}</Link><span>/</span>
          <span aria-current="page">{p.name}</span>
        </nav>

        <div className="pdp__grid">
          <div className="pdp__gallery">
            <div className="pdp__thumbs" role="tablist" aria-label="Product images">
              {p.images.map((im, i) => (
                <button key={im} role="tab" aria-selected={i === active} className={i === active ? "is-active" : ""} onClick={() => setActive(i)} aria-label={VIEW_LABELS[i] ?? `Image ${i + 1}`}>
                  <Img id={im} alt="" ratio={1.3} width={200} sizes="90px" />
                </button>
              ))}
            </div>
            <div className="pdp__main">
              <ZoomImage id={p.images[active]} alt={`${p.name} — ${VIEW_LABELS[active] ?? "view"}`} ratio={1.3} onOpen={() => setLightbox(true)} priority />
              <div className="pdp__nav">
                <button onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={18} /></button>
                <span>{String(active + 1).padStart(2, "0")} / {String(p.images.length).padStart(2, "0")}</span>
                <button onClick={() => go(1)} aria-label="Next image"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          <div className="pdp__info">
            <p className="eyebrow">{cat?.name} · {p.id}</p>
            <SplitReveal as="h1" text={p.name} className="pdp__title" trigger="mount" delay={0.4} />
            <p className="pdp__price">{formatINR(p.price)} <span className="demo-tag">demo price · incl. of taxes TBC</span></p>
            <p className="pdp__desc">{p.description}</p>

            <div className="pdp__row">
              <span className="pdp__label">Colour</span>
              <span className="pdp__color"><span className="swatch" style={{ background: p.colorHex }} /> {p.color}</span>
            </div>

            {p.options && (
              <fieldset className="opts">
                <legend>{p.options.label}</legend>
                {p.options.values.map((v) => (
                  <button key={v} type="button" className={`opt ${option === v ? "is-active" : ""}`} onClick={() => setOption(v)} aria-pressed={option === v}>{v}</button>
                ))}
              </fieldset>
            )}

            <div className="pdp__buy">
              <div className="qty qty--lg" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={14} /></button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><Plus size={14} /></button>
              </div>
              <button className="lux-btn lux-btn--solid pdp__add" onClick={() => addToCart(p, option, qty)}>
                <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Add to Bag — {formatINR(p.price * qty)}</span>
              </button>
              <button className={`icon-btn icon-btn--ring ${wished ? "is-wished" : ""}`} onClick={() => toggleWish(p.id)} aria-label={wished ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={wished}>
                <Heart size={18} strokeWidth={1.4} />
              </button>
            </div>

            <a className="pdp__wa" href={whatsappLink(enquiryMessage(p.name, p.id, option, url))} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={1.4} /> Enquire on WhatsApp <small>{SITE.phoneDisplay}</small>
            </a>

            <p className="pdp__avail"><i /> Availability is confirmed by the boutique when you enquire or order.</p>

            <div className="accordion">
              {[
                { id: "details", title: "Details", body: (
                  <dl className="specs">
                    <div><dt>Product code</dt><dd>{p.id}</dd></div>
                    <div><dt>Category</dt><dd>{cat?.name}</dd></div>
                    <div><dt>Fabric</dt><dd>{p.fabric}</dd></div>
                    <div><dt>Occasion</dt><dd>{p.occasion}</dd></div>
                    <div><dt>Colour</dt><dd>{p.color}</dd></div>
                  </dl>
                ) },
                { id: "care", title: "Fabric & Care", body: <p>Care guidance is specific to each weave and will be shared by the boutique with your purchase. Ask us on WhatsApp for details on this piece.</p> },
                { id: "delivery", title: "Delivery & Alterations", body: <p>Delivery options, timelines and charges are confirmed when you order. Blouse stitching, fall-and-pico and fittings can be arranged at the boutique in Marthandam.</p> },
              ].map((s) => (
                <div key={s.id} className={`acc ${open === s.id ? "is-open" : ""}`}>
                  <button className="acc__head" onClick={() => setOpen(open === s.id ? null : s.id)} aria-expanded={open === s.id} aria-controls={`acc-${s.id}`}>
                    {s.title} <Plus size={16} />
                  </button>
                  <div className="acc__body" id={`acc-${s.id}`} role="region"><div>{s.body}</div></div>
                </div>
              ))}
            </div>

            <button className="text-link pdp__share" onClick={share}><Share2 size={14} /> Share this piece</button>
          </div>
        </div>
      </div>

      <section className="pdp__related container" aria-labelledby="rel-title">
        <div className="section-head">
          <h2 id="rel-title">You may also love</h2>
          <Link className="text-link" href={`/shop?cat=${p.category}`}>All {cat?.name}</Link>
        </div>
        <div className="grid">{related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}</div>
      </section>

      {recentList.length > 0 && (
        <section className="pdp__related container" aria-labelledby="recent-title">
          <div className="section-head"><h2 id="recent-title">Recently viewed</h2></div>
          <div className="grid">{recentList.map((r, i) => r && <ProductCard key={r.id} p={r} index={i} />)}</div>
        </section>
      )}

      <div className="pdp__sticky only-mobile">
        <div>
          <p>{p.name}</p>
          <strong>{formatINR(p.price)}</strong>
        </div>
        <LuxButton onClick={() => addToCart(p, option, qty)}>Add to Bag</LuxButton>
      </div>

      {/* Full-screen viewer */}
      <div className={`lightbox ${lightbox ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden={!lightbox}>
        {lightbox && (
          <>
            <button className="lightbox__close icon-btn" onClick={() => setLightbox(false)} aria-label="Close viewer"><X size={26} strokeWidth={1.2} /></button>
            <button className="lightbox__prev" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={30} strokeWidth={1} /></button>
            <div className="lightbox__img" key={p.images[active]}>
              <Img id={p.images[active]} alt={p.name} sizes="100vw" width={2000} priority />
            </div>
            <button className="lightbox__next" onClick={() => go(1)} aria-label="Next image"><ChevronRight size={30} strokeWidth={1} /></button>
            <p className="lightbox__count">{active + 1} / {p.images.length} · {VIEW_LABELS[active]}</p>
          </>
        )}
      </div>
    </div>
  );
}
