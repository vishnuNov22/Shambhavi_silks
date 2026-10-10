"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { getProduct } from "@/data/products";
import { formatINR } from "@/data/site";

const OrbitCanvas = dynamic(() => import("@/components/three/Scenes").then((m) => m.OrbitCanvas), { ssr: false });

const FEATURED = "crimson-gold-wedding-look";

/**
 * GOLDEN ORBIT — the bridal look at the centre of luminous rings.
 * The rings (WebGL, additive light) pass in front of and behind the figure;
 * the house name sits huge behind her. Scrolling intensifies the light.
 */
export default function SceneOrbit() {
  const root = useRef<HTMLElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const webgl = useWebGL();
  const p = getProduct(FEATURED);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current, start: "top top", end: "+=180%", scrub: 1, pin: true, anticipatePin: 1,
            onUpdate: (self) => { progress.current = self.progress; },
          },
        });
        tl.fromTo(".orbit__name", { letterSpacing: "0.4em", autoAlpha: 0.2 }, { letterSpacing: "0.02em", autoAlpha: 1, duration: 0.6 }, 0)
          .fromTo(".orbit__figure", { scale: 0.86, filter: "brightness(0.4)" }, { scale: 1, filter: "brightness(1)", duration: 0.5 }, 0)
          .fromTo(".orbit__copy > *", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.25, ease: "power2.out" }, 0.45)
          .to({}, { duration: 0.2 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  if (!p) return null;
  return (
    <section ref={root} className="orbit" aria-labelledby="orbit-title">
      <div className="orbit__glow" aria-hidden="true" />
      <p className="orbit__name" aria-hidden="true">Shambhavi</p>
      <div className="orbit__figure" ref={figure}>
        <Img id={p.images[0]} alt={`${p.name} — bridal look`} ratio={1.45} width={1100} sizes="(max-width: 820px) 62vw, 26vw" />
      </div>
      {webgl && <OrbitCanvas progress={progress} rectEl={figure} className="orbit__gl" />}
      <div className="orbit__copy">
        <p className="kicker">Bridal Couture</p>
        <h2 id="orbit-title" className="orbit__title">Draped in <em>light.</em></h2>
        <p className="orbit__meta">{p.name} · {formatINR(p.price)}</p>
        <div className="orbit__ctas">
          <LuxButton href="/collections/bridal" variant="rose">Explore Bridal</LuxButton>
          <Link href={`/product/${p.slug}`} className="text-link text-link--light">View this look</Link>
        </div>
      </div>
    </section>
  );
}
