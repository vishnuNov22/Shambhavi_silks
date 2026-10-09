"use client";

import Link from "next/link";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { getProduct } from "@/data/products";
import { formatINR } from "@/data/site";

const FEATURED = "royal-navy-butta-silk-saree";

/**
 * SCENE 03 — The Saree Experience.
 * The saree surfaces from darkness under a moving spotlight, grows to fill
 * the frame, then the composition pans down to its border and pallu while the
 * product story enters beside it.
 */
export default function SceneSaree() {
  const root = useRef<HTMLElement>(null);
  const p = getProduct(FEATURED);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(".saree__frame", { scale: 0.62, filter: "brightness(0.05) saturate(0.4)" }, { scale: 1, filter: "brightness(1) saturate(1)", duration: 1 })
        .fromTo(".saree__spot", { "--sx": "30%", "--sy": "20%" }, { "--sx": "62%", "--sy": "70%", duration: 2.2 }, 0)
        .from(".saree__kicker .w", { yPercent: 110, stagger: 0.05, ease: "expo.out", duration: 0.5 }, 0.35)
        .to(".saree__frame img", { yPercent: -18, scale: 1.55, transformOrigin: "50% 85%", duration: 1.2, ease: "power1.inOut" }, 1.1)
        .to(".saree__kicker", { opacity: 0, y: -40, duration: 0.4 }, 1.2)
        .fromTo(".saree__info > *", { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 1.4)
        .fromTo(".saree__callout", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.35, ease: "back.out(2)" }, 1.6)
        .to({}, { duration: 0.4 });
    },
    { scope: root }
  );

  if (!p) return null;
  return (
    <section ref={root} className="saree" aria-labelledby="saree-title">
      <div className="saree__spot" aria-hidden="true" />
      <div className="saree__stage">
        <div className="saree__frame">
          <Img id={p.images[0]} alt={`${p.name} — model wearing the saree`} sizes="(max-width: 820px) 90vw, 46vw" width={1600} ratio={1.4} />
          <span className="saree__callout saree__callout--a">Woven border</span>
          <span className="saree__callout saree__callout--b">Zari butta</span>
        </div>
      </div>

      <div className="saree__kicker" aria-hidden="true">
        <span className="m"><span className="w">The</span></span>{" "}
        <span className="m"><span className="w"><em>Saree</em></span></span>{" "}
        <span className="m"><span className="w">Experience</span></span>
      </div>

      <div className="saree__info">
        <p className="eyebrow eyebrow--light">Scene 03 · Signature Saree</p>
        <h2 id="saree-title" className="saree__name">{p.name}</h2>
        <p className="saree__price">{formatINR(p.price)} <span className="demo-tag demo-tag--light">demo price</span></p>
        <p className="saree__desc">{p.description}</p>
        <dl className="saree__specs">
          <div><dt>Colour</dt><dd>{p.color}</dd></div>
          <div><dt>Occasion</dt><dd>{p.occasion}</dd></div>
          <div><dt>Blouse</dt><dd>Unstitched or to measure</dd></div>
        </dl>
        <div className="saree__ctas">
          <LuxButton href="/collections/sarees" variant="light">Discover Sarees</LuxButton>
          <Link href={`/product/${p.slug}`} className="text-link text-link--light">View this saree</Link>
        </div>
      </div>
    </section>
  );
}
