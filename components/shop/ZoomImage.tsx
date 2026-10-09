"use client";

import { useRef } from "react";
import Img from "@/components/ui/Img";

/** Pointer-follow detail zoom for fine pointers; tap-friendly static image on touch. */
export default function ZoomImage({ id, alt, ratio = 1.3, onOpen, priority }: { id: string; alt: string; ratio?: number; onOpen?: () => void; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div
      ref={ref}
      className="zoom"
      style={{ aspectRatio: `1 / ${ratio}` }}
      onPointerMove={move}
      onClick={onOpen}
      data-cursor-label={onOpen ? "Expand" : "Zoom"}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => { if (onOpen && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(); } }}
      aria-label={onOpen ? `Open full-screen view of ${alt}` : undefined}
    >
      <Img key={id} id={id} alt={alt} ratio={ratio} sizes="(max-width: 820px) 100vw, 50vw" width={1600} priority={priority} />
    </div>
  );
}
