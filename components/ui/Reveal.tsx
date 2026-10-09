"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Staggered rise-in for direct children marked with [data-reveal]. */
export default function Reveal({ children, className = "", as: Tag = "div", y = 40 }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "ul"; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items || !items.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(items, {
        y,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref }
  );
  const Comp = Tag as "div";
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
