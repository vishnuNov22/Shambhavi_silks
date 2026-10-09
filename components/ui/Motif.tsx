/** Original line-drawn textile motifs (paisley + temple border), animated via stroke-dashoffset in CSS. */
export function PaisleyMotif({ className = "" }: { className?: string }) {
  return (
    <svg className={`motif ${className}`} viewBox="0 0 200 260" fill="none" aria-hidden="true">
      <path pathLength={1} d="M100 250C40 230 18 170 34 118 52 58 112 26 150 46c34 18 30 66-6 76-28 8-46-14-36-34 8-16 30-14 34 0" stroke="currentColor" strokeWidth="1.2" />
      <path pathLength={1} d="M100 232C56 214 40 168 52 128c14-46 60-70 88-56" stroke="currentColor" strokeWidth=".8" />
      <path pathLength={1} d="M70 200c-8-30 4-62 30-80M84 214c-4-24 8-50 30-64M60 170c4-20 18-36 34-44" stroke="currentColor" strokeWidth=".7" />
      <circle cx="118" cy="66" r="3" fill="currentColor" />
      <path pathLength={1} d="M100 250c14-12 28-12 40 0M100 250c-14-12-28-12-40 0" stroke="currentColor" strokeWidth=".8" />
    </svg>
  );
}

export function TempleBorder({ className = "" }: { className?: string }) {
  const spires = Array.from({ length: 24 }, (_, i) => i * 50);
  return (
    <svg className={`motif motif--border ${className}`} viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path pathLength={1} d="M0 58H1200M0 4H1200" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d={spires.map((x) => `M${x} 52L${x + 25} 12L${x + 50} 52`).join("")} stroke="currentColor" strokeWidth="1" />
      {spires.map((x) => (
        <circle key={x} cx={x + 25} cy={8} r={1.6} fill="currentColor" />
      ))}
    </svg>
  );
}
