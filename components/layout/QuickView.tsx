"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import Img from "@/components/ui/Img";
import ZoomImage from "@/components/shop/ZoomImage";
import { getCategory } from "@/data/products";
import { formatINR, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { enquiryMessage } from "@/lib/order";

export default function QuickView() {
  const { quickView: p, setQuickView, addToCart, toggleWish, isWished } = useStore();
  const [option, setOption] = useState<string | undefined>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!p) return;
    setOption(p.options?.values[0]);
    setActive(0);
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => { unlockScroll(); window.removeEventListener("keydown", onKey); };
  }, [p, setQuickView]);

  return (
    <div className={`qv ${p ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={p ? `Quick view: ${p.name}` : "Quick view"} aria-hidden={!p}>
      <div className="qv__scrim" onClick={() => setQuickView(null)} />
      {p && (
        <div className="qv__panel" data-lenis-prevent>
          <button className="qv__close icon-btn" onClick={() => setQuickView(null)} aria-label="Close quick view"><X size={22} strokeWidth={1.3} /></button>
          <div className="qv__media">
            <ZoomImage id={p.images[active]} alt={p.name} ratio={1.3} />
            <div className="qv__thumbs">
              {p.images.map((im, i) => (
                <button key={im} className={i === active ? "is-active" : ""} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}>
                  <Img id={im} alt="" ratio={1.3} width={160} sizes="64px" />
                </button>
              ))}
            </div>
          </div>
          <div className="qv__info">
            <p className="eyebrow">{getCategory(p.category)?.name}</p>
            <h2 className="qv__title">{p.name}</h2>
            <p className="price">{formatINR(p.price)} <span className="demo-tag">demo price</span></p>
            <p className="qv__desc">{p.description}</p>
            <p className="qv__meta"><span className="swatch" style={{ background: p.colorHex }} /> {p.color} · {p.occasion}</p>
            {p.options && (
              <fieldset className="opts">
                <legend>{p.options.label}</legend>
                {p.options.values.map((v) => (
                  <button key={v} type="button" className={`opt ${option === v ? "is-active" : ""}`} onClick={() => setOption(v)} aria-pressed={option === v}>{v}</button>
                ))}
              </fieldset>
            )}
            <div className="qv__actions">
              <button className="lux-btn lux-btn--solid" onClick={() => { addToCart(p, option); setQuickView(null); }}>
                <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Add to Bag</span>
              </button>
              <button className={`icon-btn icon-btn--ring ${isWished(p.id) ? "is-wished" : ""}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist" aria-pressed={isWished(p.id)}>
                <Heart size={18} strokeWidth={1.4} />
              </button>
            </div>
            <a className="text-link" href={whatsappLink(enquiryMessage(p.name, p.id, option))} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a>
            <Link className="text-link" href={`/product/${p.slug}`} onClick={() => setQuickView(null)}>View full details</Link>
          </div>
        </div>
      )}
    </div>
  );
}
