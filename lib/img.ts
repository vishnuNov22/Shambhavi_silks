/**
 * Image URL helpers.
 *
 * Demo photography is served from the Unsplash CDN (free Unsplash License,
 * hotlinking is the method Unsplash itself recommends). The CDN negotiates
 * AVIF/WebP automatically via `auto=format` and resizes on the fly, which
 * gives us responsive images without shipping large files in the repo.
 *
 * To use the boutique's own photography, put files in /public/products and
 * use a path that starts with "/" as the image id — those are passed through.
 */
export function imgUrl(id: string, w = 1200, h?: number, q = 75) {
  if (id.startsWith("/") || id.startsWith("http")) return id;
  // "<id>#detail" = a tighter crop of the same photograph (border & drape detail)
  const [base, mod] = id.split("#");
  const size = h ? `&w=${w}&h=${h}` : `&w=${w}`;
  const focus = mod === "detail" ? "&crop=focalpoint&fp-x=0.5&fp-y=0.72&fp-z=2" : "";
  return `https://images.unsplash.com/photo-${base}?auto=format&fit=crop${size}${focus}&q=${q}`;
}

export function imgSrcSet(id: string, widths = [400, 700, 1000, 1400, 2000], ratio?: number) {
  if (id.startsWith("/") || id.startsWith("http")) return undefined;
  return widths
    .map((w) => `${imgUrl(id, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(", ");
}
