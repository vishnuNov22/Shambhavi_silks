/**
 * Route transition: a silk-coloured curtain lifts away while content settles in.
 * Pure CSS (see .route-curtain in styles/base.css) so it never blocks rendering,
 * works without JavaScript and never puts a transform on the page wrapper
 * (which would break ScrollTrigger pinning).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="route-curtain" aria-hidden="true">
        <span className="route-curtain__word">Shambhavi</span>
      </div>
      <div className="route-content">{children}</div>
    </>
  );
}
