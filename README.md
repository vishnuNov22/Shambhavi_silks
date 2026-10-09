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
| WebGL silk cloth (PBR `MeshPhysicalMaterial` + vertex-displacement shader, woven zari border & butta motifs, PMREM studio lighting, pointer camera parallax) | `components/three/SilkCloth.tsx` |
| Shader image-dissolve (noise "thread" field + molten-zari seam) | `components/three/ImageMorph.tsx` |
| Homepage hero + 7 scroll scenes | `components/home/*` |
| Header / mega-menu / search (`/` or ⌘K) / cart drawer / quick view / cursor | `components/layout/*` |
| Shop, filters, product cards, PDP, cart, wishlist, contact form | `components/shop/*` |
| Styles (design tokens → components) | `styles/*.css` |

### Homepage film
Hero (arch → full-bleed expansion) → 01 The Art of Silk (live WebGL silk window opens, motifs surface) → 02 From Thread to Masterpiece (pinned shader dissolves) → 03 The Saree Experience (from darkness → border detail) → 04 Bridal Couture → 05 Designer Lehengas (horizontal pinned rail) → 06 The Collection (shoppable grid with in-place filtering) → 07 Visit Shambhavi (curtain reveal).

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
