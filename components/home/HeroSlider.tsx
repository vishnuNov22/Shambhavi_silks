"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import LuxButton from "@/components/ui/LuxButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGL } from "@/lib/hooks";
import { imgUrl } from "@/lib/img";
import { PRODUCTS, STORY, type CategorySlug } from "@/data/products";

const RibbonKnot = dynamic(() => import("@/components/three/RibbonKnot"), { ssr: false });

const count = (cats: CategorySlug[]) => PRODUCTS.filter((p) => cats.includes(p.category)).length;

const SLIDES = [
  {
    key: "silk",
    label: "Silk Sarees",
    title: ["Woven in", "heritage."],
    stat: count(["silk-sarees"]),
    statLabel: "silk sarees with woven zari borders, chosen by hand",
    model: "1610189338344-f3ce0d0f6d06",
    href: "/shop?cat=silk-sarees",
  },
  {
    key: "bridal",
    label: "Bridal Couture",
    title: ["Draped for", "forever."],
    stat: count(["bridal-sarees", "bridal-collections"]),
    statLabel: "bridal looks for the muhurtham and every ritual after",
    model: "1600685890506-593fdf55949b",
    href: "/collections/bridal",
  },
  {
    key: "lehenga",
    label: "Designer Lehengas",
    title: ["Crafted in", "every thread."],
    stat: count(["designer-lehengas", "tops-and-skirts"]),
    statLabel: "lehengas with hand-finished embroidery",
    model: "1633685894176-9f715a092b79",
    href: "/collections/lehengas",
  },
];

const AUTOPLAY = 7000;

/** Hand-drawn brush strokes (SVG mask) — the shape the silk is "painted" into. */
const STROKES_BACK = [
  "M90 360 C 260 250, 480 300, 640 250 S 880 210, 930 260",
  "M70 470 C 250 420, 470 470, 650 420 S 860 380, 950 430",
  "M120 580 C 300 540, 520 600, 700 550 S 870 520, 920 560",
];
const STROKES_FRONT = [
  "M430 80 C 470 260, 440 420, 470 720",
  "M520 70 C 560 260, 530 470, 560 740",
  "M610 100 C 640 300, 600 480, 630 720",
];

function Brush({ slide, index }: { slide: (typeof SLIDES)[number]; index: number }) {
  const id = `brush-${slide.key}-${index}`;
  return (
    <svg className="brush" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id={`${id}-rough`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.06" numOctaves="3" seed={index + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`${id}-back`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="800">
          <g filter={`url(#${id}-rough)`} fill="none" stroke="#fff" strokeLinecap="round">
            {STROKES_BACK.map((d, i) => <path key={d} className="brush__stroke" d={d} pathLength={1} strokeWidth={150 - i * 12} />)}
          </g>
        </mask>
        <mask id={`${id}-front`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="800">
          <g filter={`url(#${id}-rough)`} fill="none" stroke="#fff" strokeLinecap="round">
            {STROKES_FRONT.map((d) => <path key={d} className="brush__stroke brush__stroke--front" d={d} pathLength={1} strokeWidth={130} />)}
          </g>
        </mask>
      </defs>
      <image href={imgUrl(STORY.goldSilk, 1400, 1120, 80)} x="0" y="0" width="1000" height="800" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}-back)`} />
      <image href={imgUrl(slide.model, 900, 1300, 82)} x="330" y="20" width="340" height="760" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}-front)`} />
    </svg>
  );
}

/**
 * HERO — editorial slider (after the client's reference film).
 * Each look is painted in through rough brush-stroke masks over gold silk;
 * a counter rolls up beside it. Changing slides sends two 3D rose-gold satin
 * ribbons across the screen to tie a knot, then pull away to the next look.
 * Autoplays (pauses off-screen / on hover / when the tab is hidden), dashes
 * and swipe navigate, reduced-motion gets a simple cross-fade.
 */
export default function HeroSlider() {
  const root = useRef<HTMLElement>(null);
  const phase = useRef(0);
  const busy = useRef(false);
  const paused = useRef(false);
  const [idx, setIdx] = useState(0);
  const [visit, setVisit] = useState(0); // increments on every slide change (re-keys the slide)
  const [rearm, setRearm] = useState(0); // re-arms the autoplay timer without re-animating
  const webgl = useWebGL();
  const slide = SLIDES[idx];

  // Slide entrance: brush strokes paint in, title rises, counter rolls.
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const strokes = gsap.utils.toArray<SVGPathElement>(".hero-slide.is-current .brush__stroke");
      const num = document.querySelector<HTMLElement>(".hero-slide.is-current .hs__num");
      if (reduced) {
        gsap.set(strokes, { strokeDashoffset: 0 });
        if (num) num.textContent = String(slide.stat);
        return;
      }
      const tl = gsap.timeline({ delay: visit === 0 ? 0.9 : 0.15 });
      tl.fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" })
        .fromTo(".hero-slide.is-current .hs__line > span", { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0.3)
        .fromTo(".hero-slide.is-current .hs__fade", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.6);
      if (num) {
        const o = { v: 0 };
        tl.to(o, { v: slide.stat, duration: 1.6, ease: "power3.out", onUpdate: () => { num.textContent = String(Math.round(o.v)); } }, 0.5);
      }
    },
    { scope: root, dependencies: [visit] }
  );

  // First visit: the ribbons arrive, knot, and pull away to reveal look one.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { phase.current = 1; return; }
    const tw = gsap.fromTo(phase, { current: 0 }, { current: 1, duration: 2.8, ease: "none", delay: 0.2 });
    return () => { tw.kill(); };
  }, []);

  const go = useCallback((next: number) => {
    if (busy.current || next === idx) return;
    const n = (next + SLIDES.length) % SLIDES.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIdx(n); setVisit((v) => v + 1); return; }
    busy.current = true;
    const tl = gsap.timeline({ onComplete: () => { busy.current = false; } });
    tl.to(".hero-slide.is-current .hs__copy, .hero-slide.is-current .brush", { autoAlpha: 0, y: -20, duration: 0.6, ease: "power2.in" }, 0.35)
      .fromTo(phase, { current: 0 }, { current: 1, duration: 2.6, ease: "none" }, 0)
      .call(() => { setIdx(n); setVisit((v) => v + 1); }, [], 1.15);
  }, [idx]);

  // Autoplay
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!paused.current && document.visibilityState === "visible") go(idx + 1);
      else setRearm((r) => r + 1);
    }, AUTOPLAY);
    return () => window.clearTimeout(id);
  }, [idx, visit, rearm, go]);

  // Pause when the hero is off screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Swipe
  const startX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") startX.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
  };

  // Scroll away: the composition drifts up and softens (no pin — keeps the hero light).
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(".hero-v3__inner", {
        yPercent: -14, autoAlpha: 0.15, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="hero-v3"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      <div className="hero-v3__glow" aria-hidden="true" />
      <div className="hero-v3__inner">
        <div key={`${slide.key}-${visit}`} className="hero-slide is-current" role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${SLIDES.length}: ${slide.label}`}>
          <div className="hs__art"><Brush slide={slide} index={idx} /></div>
          <div className="hs__copy">
            <p className="hs__label hs__fade">{slide.label}</p>
            <h1 className="hs__title">
              {slide.title.map((t, i) => <span key={t} className={`hs__line ${i === 1 ? "hs__line--em" : ""}`}><span>{t}</span></span>)}
            </h1>
            <p className="hs__num" aria-label={`${slide.stat} pieces`}>0</p>
            <p className="hs__stat hs__fade">{slide.statLabel}</p>
            <div className="hs__ctas hs__fade">
              <LuxButton href={slide.href} variant="rose">Explore</LuxButton>
              <Link href="/shop" className="text-link text-link--light">All {PRODUCTS.length} pieces</Link>
            </div>
          </div>
        </div>
      </div>

      {webgl && <RibbonKnot phase={phase} className="hero-v3__ribbons" />}

      <div className="hero-v3__dashes" role="tablist" aria-label="Choose a collection">
        {SLIDES.map((s, i) => (
          <button key={s.key} role="tab" aria-selected={i === idx} aria-label={s.label} className={`dash ${i === idx ? "is-active" : ""}`} onClick={() => go(i)}>
            <i key={i === idx ? `p${visit}-${rearm}` : "x"} style={{ animationDuration: `${AUTOPLAY}ms` }} />
          </button>
        ))}
        <span className="hero-v3__count">{String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
