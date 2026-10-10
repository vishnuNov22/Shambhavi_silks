"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { STORY } from "@/data/products";

const MakingCanvas = dynamic(() => import("@/components/three/Scenes").then((m) => m.MakingCanvas), { ssr: false });

const HEADLINE = "The making of a Shambhavi saree begins long before it reaches you.";

/**
 * THE MAKING — charcoal and smoke. The headline is written by scrolling
 * (word-by-word light), a length of real brocade hangs and sways in 3D at
 * right, and a circular lens opens onto the weave to carry us into the craft.
 */
export default function SceneMaking() {
  const root = useRef<HTMLElement>(null);
  const energy = useRef(0);
  const webgl = useWebGL();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current, start: "top top", end: "+=220%", scrub: 1, pin: true, anticipatePin: 1,
            onUpdate: (self) => { energy.current = Math.sin(Math.min(1, self.progress * 1.4) * Math.PI) * 0.6; },
          },
        });
        tl.fromTo(".making__w", { opacity: 0.12, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", stagger: 0.04, duration: 0.2 }, 0)
          .fromTo(".making__cloth", { xPercent: 20, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0)
          .fromTo(".making__sub", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0.55)
          .fromTo(".making__lens", { clipPath: "circle(0% at 70% 55%)" }, { clipPath: "circle(9% at 70% 55%)", duration: 0.15, ease: "power2.out" }, 0.62)
          .fromTo(".making__lens .img", { scale: 1.6 }, { scale: 1, duration: 0.38 }, 0.62)
          .to(".making__lens", { clipPath: "circle(150% at 70% 55%)", duration: 0.25, ease: "power2.in" }, 0.78);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="making" aria-labelledby="making-title">
      <div className="making__smoke" aria-hidden="true"><i /><i /><i /></div>
      <div className="making__copy">
        <p className="kicker">The Making</p>
        <h2 id="making-title" className="making__title" aria-label={HEADLINE}>
          {HEADLINE.split(" ").map((w, i) => <span key={i} className="making__w" aria-hidden="true">{w} </span>)}
        </h2>
        <p className="making__sub">Thread, loom, zari and hand — every saree we choose carries the work of many.</p>
      </div>
      <div className="making__cloth">
        {webgl ? <MakingCanvas texture={STORY.embroidery} energy={energy} className="making__gl" /> : <Img id={STORY.embroidery} alt="" ratio={1.5} sizes="40vw" />}
      </div>
      <div className="making__lens" aria-hidden="true"><Img id={STORY.embroidery2} alt="" sizes="100vw" /></div>
    </section>
  );
}
