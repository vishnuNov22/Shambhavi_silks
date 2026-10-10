"use client";

import dynamic from "next/dynamic";

/** Loads the WebGL petal field after hydration so it never delays first paint. */
const Petals = dynamic(() => import("@/components/three/Petals"), { ssr: false });

export default function PetalsLayer() {
  return <Petals />;
}
