# Shambhavi Silks & Handlooms — Luxury 3D E-Commerce (Next.js)

Next.js 14 (App Router) · TypeScript · React Three Fiber / Three.js · GSAP ScrollTrigger · Lenis

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

Deploy: push to GitHub → import into Vercel (zero config).

## What's inside

| Area | Where |
|---|---|
| Business info (phone, WhatsApp, address, Instagram) | `data/site.ts` |
| **74 products**, categories, collections, story imagery | `data/products.ts` |
| Hero slider: brush-stroke SVG reveals, rolling counters, 3D rose-gold satin ribbons that knot between slides | `components/home/HeroSlider.tsx`, `components/three/RibbonKnot.tsx` |
| Rose petals drifting over the whole site (instanced WebGL, click-through) | `components/three/Petals.tsx` |
| Golden orbit rings, hanging brocade, bursting brocade pieces, faceted gems | `components/three/Scenes.tsx`, `FabricMesh.tsx` |
| Homepage scenes | `components/home/*` |
| Minimal header, full-screen menu, optional ambient sound | `components/layout/*` |
| Product cards + card → product shared-element transition | `components/shop/ProductCard.tsx` |
| Shop, filters, PDP, cart, wishlist, contact form | `components/shop/*` |
| Styles (design tokens → components) | `styles/*.css` |

### Homepage (v3 — after the client's reference video)
Palette: wine `#3A0F17`, noir `#0F0B0C`, rose-gold `#C98F78`, champagne gold `#D9B77C`, ivory `#F4ECE2`, petal `#EFC3C0`.

1. **Hero slider** — each look is painted in through rough brush strokes over gold silk; a counter rolls up; two 3D satin ribbons sweep in, tie a knot and pull away between slides. Autoplay, dashes, swipe.
2. **The Edit** — "SHAMBHAVI" masthead; numbered cards float in 3D depth and the camera flies through them on scroll.
3. **Golden Orbit** — luminous rings orbit the bridal look (passing behind and in front), the name huge behind.
4. **The Making** — headline written by scroll, real brocade hanging and swaying in 3D, a circular lens opens onto the weave.
5. **Craftsmanship** — brocade pieces burst apart in 3D with labelled leader lines that track each piece.
6. **The House Line** — the boutique's own tagline, floating gold/onyx gems, drifting tags, contact chips.
7. **The Collection** — editorial grid with category tabs.

Cut-out (transparent-background) product photos would let garments float exactly like the reference; drop PNGs into `public/products/` and point the slide/product image ids at them.

### Pages
`/` · `/shop` (search, category/price/colour filters, sort, URL-synced) · `/collections/[sarees|lehengas|bridal|anarkali|occasion]` · `/product/[slug]` (gallery, hover zoom, full-screen viewer, options, qty, WhatsApp enquiry, related + recently viewed, JSON-LD) · `/cart` · `/wishlist` · `/our-story` · `/contact`

## Important: demo content

* **Products, names and prices are placeholders.** Every price is marked "demo price" in the UI. Replace them in `data/products.ts` with the boutique's real catalogue.
* **Photography** is editorial stock from Unsplash (free licence, served from the Unsplash CDN), used only to show the design. It is not the store's inventory. To use the shop's own photos, drop files in `public/products/` and set the image id to a path, e.g. `"/products/kanchi-red-01.jpg"`.
* **No celebrity images.** Using film actresses' photos would imply an endorsement the shop doesn't have and infringes their personality/image rights. If the shop signs a brand ambassador, add the licensed campaign images the same way.
* Salwar suits are listed as a category with an "available in boutique" empty state until real products are added.

## Commerce integration points

* Checkout currently sends the bag to WhatsApp (`lib/order.ts`). Add Razorpay/Stripe there for online payment.
* Inventory/availability: swap `PRODUCTS` for a CMS/Shopify/DB fetch — components only use the `Product` type.
* Care, delivery and fabric text is generic until verified by the boutique.

## Performance & accessibility

WebGL canvases render only while on screen, cap DPR, halve geometry on phones, dispose GPU resources on unmount, and fall back to images when WebGL/textures fail. `prefers-reduced-motion` disables smooth scroll, pins and scrubbing. Native scroll on touch devices; the lehenga rail becomes a swipe carousel. Keyboard: skip link, focus styles, Esc closes overlays, `/` opens search.
