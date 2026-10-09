"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Img from "@/components/ui/Img";
import { gsap, useGSAP } from "@/lib/gsap";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/data/site";

/**
 * SCENE 05 — Designer Lehengas.
 * A different rhythm: the page turns sideways. Desktop pins and scrubs a
 * horizontal editorial gallery whose frames skew with scroll velocity and
 * whose images counter-parallax inside their masks. Touch devices get a
 * native, snap-scrolling rail instead.
 */
export default function SceneLehenga() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = PRODUCTS.filter((p) => p.category === "designer-lehengas" || p.category === "tops-and-skirts");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const skewTo = gsap.quickTo(".leh__card", "skewX", { duration: 0.5, ease: "power3" });
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -400);
              skewTo(v);
              gsap.set(".leh__progress i", { scaleX: self.progress });
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".leh__card img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -12 }, {
            xPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
        return () => skewTo(0);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="leh" aria-labelledby="leh-title">
      <div className="leh__track" ref={track}>
        <div className="leh__intro">
          <p className="eyebrow eyebrow--gold">Scene 05</p>
          <h2 id="leh-title">Designer <em>Lehengas</em></h2>
          <p>Sculpted skirts, hand-finished embroidery and dupattas that frame the face. Scroll to walk the rail.</p>
          <Link href="/collections/lehengas" className="text-link text-link--light">View all lehengas</Link>
        </div>
        {items.map((p, i) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="leh__card" data-cursor-label="View" style={{ "--h": `${[78, 64, 72, 60][i % 4]}vh` } as React.CSSProperties}>
            <span className="leh__media">
              <Img id={p.images[0]} alt={p.name} ratio={1.35} sizes="(max-width: 820px) 70vw, 30vw" width={1000} />
            </span>
            <span className="leh__meta">
              <span className="leh__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="leh__name">{p.name}</span>
              <span className="leh__price">{formatINR(p.price)} <ArrowUpRight size={14} /></span>
            </span>
          </Link>
        ))}
        <div className="leh__end">
          <p>Fittings &amp; alterations by appointment.</p>
          <Link href="/contact" className="text-link text-link--light">Book a lehenga fitting</Link>
        </div>
      </div>
      <div className="leh__progress" aria-hidden="true"><i /></div>
    </section>
  );
}
