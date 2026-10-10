"use client";

import Link from "next/link";
import { useRef } from "react";
import Img from "@/components/ui/Img";
import { gsap, useGSAP } from "@/lib/gsap";
import { getProduct } from "@/data/products";
import { formatINR } from "@/data/site";

const EDIT = [
  "maroon-gold-vine-silk-saree",
  "sindoor-red-bridal-silk-saree",
  "sage-tissue-designer-saree",
  "peacock-green-kanchipuram-silk",
  "rani-and-saffron-bridal-saree",
  "royal-navy-butta-silk-saree",
  "rose-and-ruby-designer-saree",
  "heritage-crimson-bridal-saree",
];

/** Positions in "editorial space" (vw-ish units); z goes into the screen. */
const LAYOUT = [
  { x: -24, y: 4, z: 0, r: 10 },
  { x: 18, y: -6, z: -520, r: -12 },
  { x: -10, y: 10, z: -1040, r: 8 },
  { x: 28, y: 2, z: -1560, r: -10 },
  { x: -28, y: -8, z: -2080, r: 12 },
  { x: 8, y: 8, z: -2600, r: -6 },
  { x: -18, y: -4, z: -3120, r: 10 },
  { x: 22, y: 6, z: -3640, r: -12 },
];
const DEPTH = 3640 + 900;

/**
 * THE EDIT — a magazine spread in three dimensions.
 * Cards float at different depths under a large masthead; scrolling flies the
 * camera through the spread (CSS 3D, GPU-composited), with gentle sway and
 * per-card fades as each passes the viewer.
 */
export default function SceneEdit() {
  const root = useRef<HTMLElement>(null);
  const items = EDIT.map((s) => getProduct(s)).filter((p): p is NonNullable<ReturnType<typeof getProduct>> => !!p);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".edit__card");
        const world = root.current!.querySelector<HTMLElement>(".edit__world")!;
        const mobile = window.matchMedia("(max-width: 820px)").matches;
        const fade = (z: number) => {
          // visible from deep space → fully present near 0 → gone as it passes the lens
          if (z > 700) return 0;
          if (z > 380) return 1 - (z - 380) / 320;
          if (z < -2600) return Math.max(0, 1 - (-2600 - z) / 900);
          return 1;
        };
        const update = (fly: number) => {
          world.style.transform = `translate3d(0,0,${fly}px) rotateY(${Math.sin(fly / 1400) * 4}deg)`;
          cards.forEach((c, i) => {
            const z = LAYOUT[i].z + fly;
            const o = fade(z);
            c.style.opacity = o.toFixed(3);
            c.style.pointerEvents = o > 0.6 ? "auto" : "none";
          });
        };
        update(0);
        const state = { fly: 0 };
        gsap.to(state, {
          fly: DEPTH - (mobile ? 700 : 500),
          ease: "none",
          onUpdate: () => update(state.fly),
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=320%", scrub: 1, pin: true, anticipatePin: 1 },
        });
        gsap.fromTo(".edit__mast-l", { yPercent: 100 }, { yPercent: 0, stagger: 0.04, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        gsap.fromTo(".edit__ribbon", { xPercent: -110 }, { xPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "+=320%", scrub: 1.5 } });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="edit" aria-labelledby="edit-title">
      <div className="edit__mast">
        <h2 id="edit-title" className="edit__masthead" aria-label="Shambhavi — The Edit">
          {"SHAMBHAVI".split("").map((c, i) => <span key={i} className="edit__mast-m"><span className="edit__mast-l">{c}</span></span>)}
        </h2>
        <div className="edit__meta">
          <p>The Edit</p>
          <p>Silk · Bridal · Designer</p>
        </div>
      </div>

      <div className="edit__ribbon" aria-hidden="true"><Img id="1631663027473-3671aa7c4503" alt="" ratio={0.32} width={1600} sizes="80vw" /></div>

      <div className="edit__stage">
        <div className="edit__world">
          {items.map((p, i) => {
            const L = LAYOUT[i];
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="edit__card"
                data-cursor-label="View"
                style={{ "--x": L.x, "--y": L.y, "--z": `${L.z}px`, "--r": `${L.r}deg` } as React.CSSProperties}
              >
                <span className="edit__num" aria-hidden="true">{i + 1}</span>
                <span className="edit__img"><Img id={p.images[0]} alt={p.name} ratio={1.3} width={700} sizes="(max-width: 820px) 52vw, 22vw" /></span>
                <span className="edit__cap">
                  <span className="edit__name">{p.name}</span>
                  <span className="edit__price">{formatINR(p.price)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <p className="edit__hint" aria-hidden="true">Scroll to walk through the edit</p>
    </section>
  );
}
