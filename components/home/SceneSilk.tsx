"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import { PaisleyMotif, TempleBorder } from "@/components/ui/Motif";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { STORY } from "@/data/products";

const SilkCanvas = dynamic(() => import("@/components/three/SilkCanvas"), { ssr: false });

/**
 * SCENE 01 — The Art of Silk.
 * A small window of live WebGL silk opens to fill the screen; a light sweep
 * travels across it, zari motifs surface in the shader as you scroll, and the
 * editorial headline assembles before handing over to the brand introduction.
 */
export default function SceneSilk() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const webgl = useWebGL();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        progress.current = 0.7;
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => { progress.current = self.progress; },
        },
      });
      tl.fromTo(".silk__window", { clipPath: "inset(32% 34% 32% 34% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 })
        .fromTo(".silk__sweep", { xPercent: -120 }, { xPercent: 120, ease: "none", duration: 1.4 }, 0.2)
        .from(".silk__title .w", { yPercent: 120, stagger: 0.08, ease: "expo.out", duration: 0.8 }, 0.55)
        .from(".silk__border .motif path", { strokeDashoffset: 1, stagger: 0.05, duration: 0.8, ease: "none" }, 0.6)
        .to(".silk__title", { yPercent: -30, opacity: 0, duration: 0.6 }, 1.6)
        .fromTo(".silk__intro", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7 }, 1.75)
        .from(".silk__intro .silk__detail", { clipPath: "inset(100% 0 0 0)", duration: 0.7, stagger: 0.12 }, 1.85)
        .to({}, { duration: 0.4 });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="silk" aria-labelledby="silk-title">
      <div className="silk__window">
        {webgl ? (
          <SilkCanvas className="silk__gl" palette="champagne" progress={progress} revealPattern pattern={1} />
        ) : (
          <Img id={STORY.silk} alt="" className="silk__fallback" sizes="100vw" />
        )}
        <div className="silk__sweep" aria-hidden="true" />
      </div>

      <div className="silk__title" id="silk-title">
        <p className="eyebrow">Scene 01 · The Art of Silk</p>
        <h2>
          <span className="m"><span className="w">The</span></span>{" "}
          <span className="m"><span className="w"><em>Art</em></span></span>{" "}
          <span className="m"><span className="w">of Silk</span></span>
        </h2>
        <div className="silk__border"><TempleBorder /></div>
      </div>

      <div className="silk__intro">
        <div className="silk__intro-copy">
          <PaisleyMotif className="silk__paisley" />
          <p className="eyebrow">Shambhavi Silks &amp; Handlooms</p>
          <p className="silk__lead">
            A boutique in Marthandam devoted to the drape — silk sarees, designer lehengas, Anarkali gowns and bridal
            couture, chosen piece by piece for weave, colour and the way they move.
          </p>
          <p className="silk__sign">being traditional is being classy</p>
        </div>
        <div className="silk__details">
          <div className="silk__detail"><Img id={STORY.zari} alt="Stacked silk sarees showing woven zari borders" ratio={1.3} sizes="(max-width: 820px) 45vw, 22vw" width={700} /></div>
          <div className="silk__detail"><Img id={STORY.pearls} alt="Detail of a silk drape with pearls" ratio={1.3} sizes="(max-width: 820px) 45vw, 22vw" width={700} /></div>
        </div>
      </div>
    </section>
  );
}
