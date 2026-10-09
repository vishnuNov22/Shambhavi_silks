"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import SilkCloth, { PALETTES, StudioEnvironment, type SilkPalette } from "./SilkCloth";
import { useInView, useIsMobile } from "@/lib/hooks";

type Props = {
  palette?: keyof typeof PALETTES | SilkPalette;
  progress?: React.MutableRefObject<number>;
  className?: string;
  pattern?: number;
  interactive?: boolean;
  revealPattern?: boolean;
};

/**
 * WebGL silk surface. Renders only while on screen (frameloop toggles),
 * caps device-pixel-ratio and halves geometry density on small screens.
 */
export default function SilkCanvas({ palette = "burgundy", progress, className, pattern = 1, interactive = true, revealPattern = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, "100px");
  const mobile = useIsMobile();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  const pal = typeof palette === "string" ? PALETTES[palette] : palette;

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <StudioEnvironment intensity={0.85} />
        <SilkCloth palette={pal} progress={progress} pointer={pointer} detail={mobile ? "low" : "high"} pattern={pattern} revealPattern={revealPattern} />
      </Canvas>
    </div>
  );
}
