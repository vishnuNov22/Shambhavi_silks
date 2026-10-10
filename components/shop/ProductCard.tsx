"use client";

import Link from "next/link";
import { useRef } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Img from "@/components/ui/Img";
import { getCategory, type Product } from "@/data/products";
import { formatINR } from "@/data/site";
import { useStore } from "@/lib/store";

/**
 * Couture-catalogue card.
 * - The photograph and the name are plain links to the product page
 *   (normal, reliable navigation — no intercepted clicks).
 * - "Add to Bag" sits under the details as a clear action; pieces with a
 *   blouse/size choice are added with the default option (changeable in the bag
 *   or on the product page).
 * - Hover (desktop): slow zoom, pointer-following light, cross-fade to the
 *   border detail and a champagne rule drawing under the name.
 */
export default function ProductCard({
  p,
  index = 0,
  priority,
  size = "md",
  tone = "light",
}: {
  p: Product;
  index?: number;
  priority?: boolean;
  size?: "md" | "lg";
  tone?: "light" | "dark";
}) {
  const { toggleWish, isWished, addToCart, setCartOpen } = useStore();
  const frame = useRef<HTMLDivElement>(null);
  const wished = isWished(p.id);
  const href = `/product/${p.slug}`;
  const ratio = size === "lg" ? 1.25 : 1.33;

  const light = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.current.style.setProperty("--rx", `${(-y * 3).toFixed(2)}deg`);
    frame.current.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
    frame.current.style.setProperty("--mx", `${(x * 100 + 50).toFixed(1)}%`);
    frame.current.style.setProperty("--my", `${(y * 100 + 50).toFixed(1)}%`);
  };
  const reset = () => {
    frame.current?.style.setProperty("--rx", "0deg");
    frame.current?.style.setProperty("--ry", "0deg");
  };

  const add = () => {
    addToCart(p, p.options?.values[0], 1);
    setCartOpen(true);
  };

  return (
    <article className={`card card--${size} card--${tone}`} style={{ "--i": index % 8 } as React.CSSProperties}>
      <div className="card__frame" ref={frame} onPointerMove={light} onPointerLeave={reset}>
        <Link href={href} className="card__media" data-cursor-label="View" aria-label={`${p.name}, ${formatINR(p.price)}`}>
          <Img id={p.images[0]} alt={p.name} ratio={ratio} sizes={size === "lg" ? "(max-width: 820px) 100vw, 50vw" : "(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw"} width={size === "lg" ? 1400 : 900} priority={priority} className="card__img" />
          {p.images[1] && <Img id={p.images[1]} alt="" ratio={ratio} sizes="(max-width: 600px) 50vw, 25vw" width={900} className="card__img card__img--alt" />}
          <span className="card__light" aria-hidden="true" />
        </Link>
        {p.badge && <span className="card__badge">{p.badge}</span>}
        <button className={`card__wish ${wished ? "is-wished" : ""}`} onClick={() => toggleWish(p.id)} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} aria-pressed={wished}>
          <Heart size={15} strokeWidth={1.3} />
        </button>
      </div>
      <div className="card__info">
        <div className="card__top">
          <h3 className="card__name"><Link href={href}>{p.name}</Link></h3>
          <p className="card__price">{formatINR(p.price)}</p>
        </div>
        <span className="card__rule" aria-hidden="true" />
        <div className="card__more">
          <p className="card__cat">{getCategory(p.category)?.short} · {p.fabric}</p>
          <p className="card__color"><span className="swatch swatch--sm" style={{ background: p.colorHex }} /> {p.color}</p>
        </div>
        <div className="card__actions">
          <button type="button" className="card__add" onClick={add} aria-label={`Add ${p.name} to bag`}>
            <ShoppingBag size={14} strokeWidth={1.4} /> <span>Add to Bag</span>
          </button>
          <Link href={href} className="card__view">View details</Link>
        </div>
      </div>
    </article>
  );
}
