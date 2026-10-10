"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Phones: don't recalculate (and jump) every time the address bar shows/hides.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out" });
}

export const EASE = {
  silk: "expo.out",
  drape: "power4.inOut",
  soft: "power2.out",
};

export { gsap, ScrollTrigger, useGSAP };
