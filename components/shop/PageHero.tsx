"use client";

import { useRef } from "react";
import Img from "@/components/ui/Img";
import SplitReveal from "@/components/ui/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";

/** Editorial page header: full-bleed image with scroll parallax and masked title. */
export default function PageHero({ eyebrow, title, intro, image, compact }: { eyebrow: string; title: string; intro?: string; image?: string; compact?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".phero__img", { yPercent: -8, scale: 1.12 }, {
        yPercent: 12, scale: 1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.from(".phero__intro", { opacity: 0, y: 30, duration: 1.2, delay: 0.8, ease: "expo.out" });
    },
    { scope: root }
  );
  return (
    <section ref={root} className={`phero ${image ? "phero--image" : ""} ${compact ? "phero--compact" : ""}`}>
      {image && (
        <div className="phero__media" aria-hidden="true">
          <div className="phero__img"><Img id={image} alt="" sizes="100vw" priority /></div>
        </div>
      )}
      <div className="phero__content container">
        <p className={`eyebrow ${image ? "eyebrow--light" : ""}`}>{eyebrow}</p>
        <SplitReveal as="h1" text={title} className="phero__title" mode="chars" trigger="mount" delay={0.5} />
        {intro && <p className="phero__intro">{intro}</p>}
      </div>
    </section>
  );
}
