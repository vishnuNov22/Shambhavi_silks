"use client";

import { useRef } from "react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { STORY } from "@/data/products";

/**
 * SCENE 04 — Bridal Couture.
 * Burgundy and gold. The central portrait rises through an arched mask while
 * flanking frames drift at different speeds and the oversized type slides
 * past in opposite directions — grandeur without stealing focus from the clothes.
 */
export default function SceneBridal() {
  const root = useRef<HTMLElement>(null);
  const [a, b, c] = STORY.bridal;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(".bridal__type--a", { xPercent: 18 }, { xPercent: -28, duration: 3 }, 0)
        .fromTo(".bridal__type--b", { xPercent: -30 }, { xPercent: 14, duration: 3 }, 0)
        .fromTo(".bridal__center", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.2, ease: "power2.out" }, 0)
        .fromTo(".bridal__center img", { scale: 1.4 }, { scale: 1, duration: 2.4 }, 0)
        .fromTo(".bridal__side--l", { yPercent: 50, opacity: 0 }, { yPercent: -10, opacity: 1, duration: 2.4 }, 0.2)
        .fromTo(".bridal__side--r", { yPercent: 80, opacity: 0 }, { yPercent: -30, opacity: 1, duration: 2.6 }, 0.3)
        .fromTo(".bridal__copy > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" }, 1.4)
        .fromTo(".bridal__glow", { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0.6);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bridal" aria-labelledby="bridal-title">
      <div className="bridal__glow" aria-hidden="true" />
      <p className="bridal__type bridal__type--a" aria-hidden="true">Bridal</p>
      <p className="bridal__type bridal__type--b" aria-hidden="true"><em>Couture</em></p>

      <div className="bridal__side bridal__side--l">
        <Img id={b} alt="Bride in a red lehenga with gold jewellery" ratio={1.35} sizes="(max-width: 820px) 40vw, 20vw" width={800} />
      </div>
      <div className="bridal__center">
        <Img id={a} alt="Bride in a crimson and gold wedding ensemble" ratio={1.45} sizes="(max-width: 820px) 70vw, 34vw" width={1400} />
      </div>
      <div className="bridal__side bridal__side--r">
        <Img id={c} alt="Bridal portrait with henna and heirloom jewellery" ratio={1.35} sizes="(max-width: 820px) 40vw, 20vw" width={800} />
      </div>

      <div className="bridal__copy">
        <p className="eyebrow eyebrow--gold">Scene 04 · For the Bride</p>
        <h2 id="bridal-title">Bridal Couture</h2>
        <p>Bridal sarees, lehengas and complete looks for the muhurtham, the reception and every ritual in between. Book a private appointment and we’ll pull pieces for you.</p>
        <LuxButton href="/collections/bridal" variant="light">Explore Bridal Couture</LuxButton>
      </div>
    </section>
  );
}
