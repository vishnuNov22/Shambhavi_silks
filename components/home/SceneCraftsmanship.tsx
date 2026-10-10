"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { STORY } from "@/data/products";
import type { CraftPiece } from "@/components/three/Scenes";

const CraftCanvas = dynamic(() => import("@/components/three/Scenes").then((m) => m.CraftCanvas), { ssr: false });

const PIECES: CraftPiece[] = [
  { texture: STORY.embroidery2, target: [-1.6, 1.1, 0.4], rot: [0.3, 0.5, -0.4], w: 1.6, h: 1.1 },
  { texture: STORY.embroidery, target: [1.5, 1.0, -0.2], rot: [-0.4, -0.6, 0.5], w: 1.5, h: 1.2 },
  { texture: STORY.border, target: [-1.3, -1.2, 0.2], rot: [0.5, 0.3, 0.6], w: 1.7, h: 0.9 },
  { texture: STORY.brocadeRust, target: [1.7, -1.1, 0.5], rot: [-0.3, 0.7, -0.5], w: 1.3, h: 1.2 },
  { texture: STORY.goldWeave, target: [0.1, 0.05, -0.8], rot: [0.2, -0.3, 0.2], w: 1.4, h: 1.0 },
];

const LABELS = [
  { t: "Hand embroidery", d: "Floral vines worked in gold thread" },
  { t: "Zari brocade", d: "Metallic yarn woven into the ground" },
  { t: "Woven border", d: "Contrast borders that frame the drape" },
  { t: "Thread work", d: "Dense, hand-finished motifs" },
  { t: "The weave", d: "Gold on gold — the body of the cloth" },
];

/**
 * CRAFTSMANSHIP — a bundle of real brocades bursts apart in 3D; as the pieces
 * settle, labelled callouts draw out to each one (positions projected from
 * the WebGL scene every frame, so lines always meet the cloth).
 */
export default function SceneCraftsmanship() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const anchors = useRef<(HTMLElement | null)[]>([]);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const webgl = useWebGL();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current, start: "top top", end: "+=200%", scrub: 1, pin: true, anticipatePin: 1,
            onUpdate: (self) => { progress.current = self.progress; },
          },
        });
        tl.fromTo(".craftx__copy > *", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.2, ease: "power2.out" }, 0)
          .fromTo(".craftx__label", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, stagger: 0.05, duration: 0.15 }, 0.55)
          .to({}, { duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="craftx" aria-labelledby="craftx-title">
      <div className="craftx__copy">
        <p className="kicker">Craftsmanship</p>
        <h2 id="craftx-title" className="craftx__title">Made by hand.<br /><em>Read by touch.</em></h2>
        <p className="craftx__lead">Brocade, zari and hand embroidery — up close, every saree is a record of the hands that made it.</p>
      </div>

      {webgl ? (
        <>
          <CraftCanvas pieces={PIECES} progress={progress} anchors={anchors} lines={lines} labels={labels} className="craftx__gl" />
          <svg className="craftx__lines" aria-hidden="true">
            {PIECES.map((_, i) => <line key={i} ref={(el) => { lines.current[i] = el; }} x1="0" y1="0" x2="0" y2="0" />)}
          </svg>
          <div className="craftx__anchors" aria-hidden="true">
            {PIECES.map((_, i) => (
              <span key={i} ref={(el) => { anchors.current[i] = el; }} className="craftx__dot"><i /></span>
            ))}
          </div>
        </>
      ) : (
        <div className="craftx__fallback">{PIECES.slice(0, 4).map((p) => <Img key={p.texture} id={p.texture} alt="" ratio={0.8} sizes="25vw" />)}</div>
      )}

      <ul className="craftx__labels">
        {LABELS.map((l, i) => (
          <li key={l.t} ref={(el) => { labels.current[i] = el; }} className={`craftx__label craftx__label--${i}`}>
            <span className="craftx__label-t">{l.t}</span>
            <span className="craftx__label-d">{l.d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
