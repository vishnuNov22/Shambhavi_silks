"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { PaisleyMotif } from "@/components/ui/Motif";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { STORY } from "@/data/products";

const SilkCanvas = dynamic(() => import("@/components/three/SilkCanvas"), { ssr: false });

/**
 * HERO — cinematic opening.
 * Layers (back → front): WebGL silk cloth (PBR + vertex-displaced shader) ·
 * gold arch line · model photograph in an arch · floating detail card · type.
 * Pointer moves the WebGL camera and each DOM layer at a different depth.
 * On scroll the arch opens into a full-bleed frame (image expansion transition).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const webgl = useWebGL();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Intro choreography (fast — the CTA is usable immediately).
      const intro = gsap.timeline({ delay: 0.55, defaults: { ease: "expo.out" } });
      intro
        .from(".hero__arch", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6 }, 0)
        .from(".hero__arch-inner", { scale: 1.35, duration: 2.2 }, 0)
        .from(".hero__archline", { opacity: 0, scale: 0.92, duration: 1.8 }, 0.2)
        .from(".hero__card", { y: 80, opacity: 0, duration: 1.4 }, 0.6)
        .from(".hero__meta > *", { y: 24, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.5)
        .from(".hero__scroll", { opacity: 0, duration: 1 }, 1.1);
      if (reduced) intro.progress(1);

      // Pointer depth parallax for DOM layers.
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let cleanup = () => {};
      if (fine && !reduced) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");
        const setters = layers.map((el) => ({
          d: parseFloat(el.dataset.depth || "0"),
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => { s.x(nx * s.d * 60); s.y(ny * s.d * 40); });
        };
        window.addEventListener("pointermove", move, { passive: true });
        cleanup = () => window.removeEventListener("pointermove", move);
      }

      // Scroll: arch opens to full bleed, type lifts away, silk camera dollies in.
      if (!reduced) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => { progress.current = self.progress; },
          },
        });
        tl.to(".hero__arch", { top: "0%", left: "0%", width: "100%", height: "100%", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", ease: "power2.inOut" }, 0)
          .to(".hero__arch-inner", { scale: 1.08, ease: "none" }, 0)
          .to(".hero__archline", { opacity: 0, scale: 1.3, ease: "none" }, 0)
          .to(".hero__type", { yPercent: -40, opacity: 0, ease: "power1.in" }, 0)
          .to(".hero__card", { y: -200, opacity: 0, ease: "power1.in" }, 0)
          .to(".hero__scroll", { opacity: 0 }, 0)
          .to(".hero__veil", { opacity: 1, ease: "none" }, 0.55)
          .fromTo(".hero__handoff", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.6);
      }
      return () => cleanup();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero" aria-label="Shambhavi Silks — Woven in tradition, draped in elegance">
      <div className="hero__bg" aria-hidden="true">
        {webgl ? <SilkCanvas className="hero__gl" palette="burgundy" progress={progress} /> : <div className="hero__gl hero__gl--fallback" />}
        <div className="hero__grain" />
      </div>

      <div className="hero__archline" data-depth="0.3" aria-hidden="true">
        <PaisleyMotif className="hero__paisley" />
      </div>

      <div className="hero__arch">
        <div className="hero__arch-inner" data-depth="0.35">
          <Img id={STORY.heroModel} alt="Model in a peacock-green silk saree with a contrast border and temple jewellery" ratio={1.35} priority sizes="(max-width: 820px) 90vw, 45vw" width={1600} />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <p className="hero__handoff">Every drape tells a story.</p>
      </div>

      <div className="hero__card" data-depth="1.1" aria-hidden="true">
        <Img id={STORY.border} alt="" ratio={1.25} sizes="200px" width={400} />
        <span>Zari · Border · Pallu</span>
      </div>

      <div className="hero__type">
        <p className="eyebrow eyebrow--light">Silks &amp; Handlooms · Marthandam</p>
        <h1 className="hero__title">
          <span className="hero__line"><span>Woven in</span></span>
          <span className="hero__line"><span>Tradition.</span></span>
          <span className="hero__line hero__line--italic"><span>Draped in Elegance.</span></span>
        </h1>
        <div className="hero__meta">
          <p>Silk sarees, designer lehengas, Anarkali gowns and bridal couture — chosen for their weave, their colour and the way they move.</p>
          <div className="hero__ctas">
            <LuxButton href="/shop" variant="light">Explore the Collection</LuxButton>
            <LuxButton href="/collections/bridal" variant="ghost">Bridal Couture</LuxButton>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
