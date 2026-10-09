"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import Img from "@/components/ui/Img";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { imgUrl } from "@/lib/img";
import { STORY } from "@/data/products";

const ImageMorph = dynamic(() => import("@/components/three/ImageMorph"), { ssr: false });

const STAGES = [
  { n: "01", title: "The Thread", text: "Every drape begins as fine filament — thousands of threads, each one carrying colour.", img: STORY.threads },
  { n: "02", title: "Warp & Weft", text: "On the loom, threads cross and lock. Tension, rhythm and patience give silk its body.", img: STORY.loom },
  { n: "03", title: "Zari", text: "Metallic zari is woven into borders and pallus, catching light the way jewellery does.", img: STORY.zari },
  { n: "04", title: "The Motif", text: "Paisleys, buttas and temple spires — motifs that turn cloth into a language.", img: STORY.embroidery },
  { n: "05", title: "The Masterpiece", text: "Six yards that hold all of it. Draped, it becomes yours.", img: "1610189012906-4c0aa9b9781e" },
];

/**
 * SCENE 02 — From Thread to Masterpiece.
 * Pinned, scroll-scrubbed. A GLSL shader dissolves each image into the next
 * along a noise "thread" field with a molten-zari seam. If WebGL or textures
 * are unavailable, a DOM crossfade stack (always rendered underneath) takes over.
 */
export default function SceneThread() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const webgl = useWebGL();
  const urls = useMemo(() => STAGES.map((s) => imgUrl(s.img, 1800, 1200, 80)), []);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const n = STAGES.length;
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: reduced ? "+=100%" : `+=${n * 90}%`,
          scrub: reduced ? false : 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progress.current = self.progress;
            const s = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            setStage((prev) => (prev === s ? prev : s));
            gsap.set(".thread__bar i", { scaleX: self.progress });
          },
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="thread" aria-labelledby="thread-title">
      {/* DOM fallback / underlay */}
      <div className="thread__stack" aria-hidden="true">
        {STAGES.map((s, i) => (
          <div key={s.n} className={`thread__layer ${i === stage ? "is-active" : ""}`}>
            <Img id={s.img} alt="" sizes="100vw" width={1800} />
          </div>
        ))}
      </div>
      {webgl && <ImageMorph urls={urls} progress={progress} className="thread__gl" />}
      <div className="thread__shade" aria-hidden="true" />

      <div className="thread__ui">
        <p className="eyebrow eyebrow--light">Scene 02</p>
        <h2 id="thread-title" className="thread__title">From Thread <em>to Masterpiece</em></h2>
        <ol className="thread__steps">
          {STAGES.map((s, i) => (
            <li key={s.n} className={i === stage ? "is-active" : i < stage ? "is-past" : ""} aria-current={i === stage ? "step" : undefined}>
              <span className="thread__n">{s.n}</span>
              <div>
                <p className="thread__step-title">{s.title}</p>
                <p className="thread__step-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="thread__bar" aria-hidden="true"><i /></div>
      </div>
      <p className="thread__big" aria-hidden="true">{STAGES[stage].n}</p>
    </section>
  );
}
