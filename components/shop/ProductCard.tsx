"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Heart } from "lucide-react";
import Img from "@/components/ui/Img";
import { getCategory, type Product } from "@/data/products";
import { formatINR } from "@/data/site";
import { useStore } from "@/lib/store";

type VTDocument = Document & { startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> } };

/** Resolve once the destination product page has rendered its hero image. */
function waitFor(selector: string, timeout = 2000) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (document.querySelector(selector) || performance.now() - start > timeout) resolve();
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

/**
 * Couture-catalogue card: large photograph, no box, fine champagne rule.
 * Hover: slow zoom, soft light follows the pointer, the photograph cross-fades
 * to its border detail, and fabric/colour details slide up. Clicking carries
 * the photograph into the product page (View Transitions API, where supported).
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
  const { toggleWish, isWished, setQuickView } = useStore();
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLAnchorElement>(null);
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

  const open = (e: React.MouseEvent) => {
    const doc = document as VTDocument;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !doc.startViewTransition || !media.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    document.querySelectorAll<HTMLElement>("[data-vt-hero]").forEach((el) => el.style.setProperty("view-transition-name", "none"));
    media.current.style.setProperty("view-transition-name", "pdp-hero");
    document.documentElement.classList.add("vt-nav");
    const t = doc.startViewTransition(async () => {
      media.current?.style.removeProperty("view-transition-name");
      router.push(href);
      await waitFor(`[data-vt-slug="${p.slug}"]`);
    });
    t.finished.finally(() => document.documentElement.classList.remove("vt-nav"));
  };

  return (
    <article className={`card card--${size} card--${tone}`} style={{ "--i": index % 8 } as React.CSSProperties}>
      <div className="card__frame" ref={frame} onPointerMove={light} onPointerLeave={reset}>
        <Link ref={media} href={href} onClick={open} className="card__media" data-cursor-label="View" aria-label={`${p.name}, ${formatINR(p.price)}`}>
          <Img id={p.images[0]} alt={p.name} ratio={ratio} sizes={size === "lg" ? "(max-width: 820px) 100vw, 50vw" : "(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw"} width={size === "lg" ? 1400 : 900} priority={priority} className="card__img" />
          {p.images[1] && <Img id={p.images[1]} alt="" ratio={ratio} sizes="(max-width: 600px) 50vw, 25vw" width={900} className="card__img card__img--alt" />}
          <span className="card__light" aria-hidden="true" />
        </Link>
        {p.badge && <span className="card__badge">{p.badge}</span>}
        <button className={`card__wish ${wished ? "is-wished" : ""}`} onClick={() => toggleWish(p.id)} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} aria-pressed={wished}>
          <Heart size={15} strokeWidth={1.3} />
        </button>
        <button className="card__quick" onClick={() => setQuickView(p)} aria-label={`Quick view ${p.name}`}>Quick view</button>
      </div>
      <div className="card__info">
        <div className="card__top">
          <h3 className="card__name"><Link href={href} onClick={open}>{p.name}</Link></h3>
          <p className="card__price">{formatINR(p.price)}</p>
        </div>
        <span className="card__rule" aria-hidden="true" />
        <div className="card__more">
          <p className="card__cat">{getCategory(p.category)?.short} · {p.fabric}</p>
          <p className="card__color"><span className="swatch swatch--sm" style={{ background: p.colorHex }} /> {p.color}</p>
        </div>
      </div>
    </article>
  );
}
