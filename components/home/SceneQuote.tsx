"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { SITE, whatsappLink } from "@/data/site";

const GemsCanvas = dynamic(() => import("@/components/three/Scenes").then((m) => m.GemsCanvas), { ssr: false });

const TAGS = ["heritage", "silk", "zari", "bridal", "handloom", "Marthandam"];

/**
 * THE HOUSE LINE — the boutique's own words (from its signboard), floating
 * faceted gems, and drifting tags; quick ways to reach the boutique.
 */
export default function SceneQuote() {
  const root = useRef<HTMLElement>(null);
  const webgl = useWebGL();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".quote__w", { yPercent: 100, autoAlpha: 0 }, {
          yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: ".quote__text", start: "top 80%", once: true },
        });
        gsap.fromTo(".quote__chip", { y: 30, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, stagger: 0.07, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: ".quote__chips", start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const line = "Being traditional is being classy.";
  return (
    <section ref={root} className="quote" aria-labelledby="quote-title">
      {webgl && <GemsCanvas className="quote__gl" />}
      <div className="quote__inner container">
        <span className="quote__mark" aria-hidden="true">“</span>
        <h2 id="quote-title" className="quote__text" aria-label={line}>
          {line.split(" ").map((w, i) => <span key={i} className="quote__m" aria-hidden="true"><span className="quote__w">{w}</span></span>)}
        </h2>
        <p className="quote__by">— {SITE.name}, Marthandam <span aria-hidden="true">”</span></p>
        <div className="quote__chips">
          {TAGS.map((t, i) => <span key={t} className={`quote__chip ${i === 0 ? "is-hero" : ""}`} style={{ "--d": `${i * 0.7}s` } as React.CSSProperties}>{t}</span>)}
        </div>
        <div className="quote__actions">
          <a className="quote__chip quote__chip--cta" href={whatsappLink("Hello Shambhavi Silks! I'd like to know more about your collection.")} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> Chat on WhatsApp</a>
          <Link className="quote__chip quote__chip--cta" href="/contact">Visit the boutique</Link>
          <a className="quote__chip quote__chip--cta" href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
