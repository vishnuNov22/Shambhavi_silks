"use client";

type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: number | string | HTMLElement, o?: object) => void };

export function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

let locks = 0;
export function lockScroll() {
  locks++;
  getLenis()?.stop();
  document.documentElement.classList.add("is-locked");
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    getLenis()?.start();
    document.documentElement.classList.remove("is-locked");
  }
}
