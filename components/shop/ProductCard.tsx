"use client";

import Link from "next/link";
import { useRef } from "react";
import { Eye, Heart } from "lucide-react";
import Img from "@/components/ui/Img";
import { getCategory, type Product } from "@/data/products";
import { formatINR } from "@/data/site";
import { useStore } from "@/lib/store";

/**
 * Editorial product card: alternate image reveals through a curtain mask on
 * hover, the frame tilts subtly toward the pointer, and quick actions rise in.
 */
export default function ProductCard({ p, index = 0, priority }: { p: Product; index?: number; priority?: boolean }) {
  const { toggleWish, isWished, setQuickView } = useStore();
  const frame = useRef<HTMLDivElement>(null);
  const wished = isWished(p.id);

  const tilt = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.current.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    frame.current.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
    frame.current.style.setProperty("--mx", `${(x * 100 + 50).toFixed(1)}%`);
    frame.current.style.setProperty("--my", `${(y * 100 + 50).toFixed(1)}%`);
  };
  const reset = () => {
    frame.current?.style.setProperty("--rx", "0deg");
    frame.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <article className="card" style={{ "--i": index % 8 } as React.CSSProperties}>
      <div className="card__frame" ref={frame} onPointerMove={tilt} onPointerLeave={reset}>
        <Link href={`/product/${p.slug}`} className="card__media" data-cursor-label="View" aria-label={`${p.name}, ${formatINR(p.price)}`}>
          <Img id={p.images[0]} alt={p.name} ratio={1.33} sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw" width={900} priority={priority} className="card__img" />
          {p.images[1] && <Img id={p.images[1]} alt="" ratio={1.33} sizes="(max-width: 600px) 50vw, 25vw" width={900} className="card__img card__img--alt" />}
          <span className="card__sheen" aria-hidden="true" />
        </Link>
        {p.badge && <span className="card__badge">{p.badge}</span>}
        <button className={`card__wish ${wished ? "is-wished" : ""}`} onClick={() => toggleWish(p.id)} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} aria-pressed={wished}>
          <Heart size={16} strokeWidth={1.5} />
        </button>
        <button className="card__quick" onClick={() => setQuickView(p)} aria-label={`Quick view ${p.name}`}>
          <Eye size={15} strokeWidth={1.5} /> Quick view
        </button>
      </div>
      <div className="card__info">
        <p className="card__cat">{getCategory(p.category)?.short}</p>
        <h3 className="card__name"><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <div className="card__row">
          <p className="card__price">{formatINR(p.price)}</p>
          <span className="swatch swatch--sm" style={{ background: p.colorHex }} title={p.color} aria-label={`Colour: ${p.color}`} />
        </div>
      </div>
    </article>
  );
}
