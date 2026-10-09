"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  mode?: "words" | "chars";
  trigger?: "mount" | "scroll";
  delay?: number;
  stagger?: number;
};

/**
 * Masked split-text reveal. Each word/char sits inside an overflow-hidden
 * mask and rises into place. Screen readers get the full sentence via aria-label.
 */
export default function SplitReveal({ text, as: Tag = "h2", className = "", mode = "words", trigger = "scroll", delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const parts = el.querySelectorAll<HTMLElement>(".sr-in");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(parts, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.set(parts, { yPercent: 115, rotate: mode === "chars" ? 6 : 3 });
      gsap.to(parts, {
        yPercent: 0,
        rotate: 0,
        duration: mode === "chars" ? 1.1 : 1.25,
        ease: "expo.out",
        stagger: stagger ?? (mode === "chars" ? 0.025 : 0.07),
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    },
    { scope: ref, dependencies: [text] }
  );

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        <span className="sr-mask" aria-hidden="true" key={wi}>
          {mode === "chars" ? (
            w.split("").map((c, ci) => (
              <span className="sr-in" key={ci}>{c}</span>
            ))
          ) : (
            <span className="sr-in">{w}</span>
          )}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
