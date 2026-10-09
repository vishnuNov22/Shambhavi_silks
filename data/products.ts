/**
 * PRODUCT CATALOGUE — DEMO DATA
 * ------------------------------------------------------------------
 * Every product, name and price below is PLACEHOLDER data for the
 * prototype. Photography is editorial stock (Unsplash) and does not show
 * actual store inventory. Replace `image`, `price`, names and details with
 * verified boutique data before launch — everything on the site reads
 * from this one file (or swap `getProducts()` for a CMS / Shopify call).
 */

export type CategorySlug =
  | "silk-sarees"
  | "designer-sarees"
  | "bridal-sarees"
  | "designer-lehengas"
  | "anarkali-gowns"
  | "bridal-collections"
  | "salwar-suits"
  | "tops-and-skirts"
  | "occasion-wear";

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
  cover: string;
};

export const CATEGORIES: Category[] = [
  { slug: "silk-sarees", name: "Silk Sarees", short: "Silk", blurb: "Pure silk drapes with rich pallus and woven zari borders.", cover: "1610189012906-4c0aa9b9781e" },
  { slug: "designer-sarees", name: "Designer Sarees", short: "Designer", blurb: "Contemporary colour stories, soft organzas and festive weaves.", cover: "1609748341905-080e077af4ca" },
  { slug: "bridal-sarees", name: "Bridal Sarees", short: "Bridal Saree", blurb: "Heirloom-worthy drapes for the muhurtham and beyond.", cover: "1619516388835-2b60acc4049e" },
  { slug: "designer-lehengas", name: "Designer Lehengas", short: "Lehenga", blurb: "Flared silhouettes, hand-finished embroidery and couture volume.", cover: "1633685894176-9f715a092b79" },
  { slug: "anarkali-gowns", name: "Anarkali Gowns", short: "Anarkali", blurb: "Floor-sweeping flares with delicate thread work.", cover: "1601571115502-83ca3095735b" },
  { slug: "bridal-collections", name: "Bridal Collections", short: "Bridal", blurb: "Complete bridal looks styled for every ceremony.", cover: "1600685890506-593fdf55949b" },
  { slug: "salwar-suits", name: "Salwar Suits & Ethnic Wear", short: "Salwar", blurb: "Everyday elegance and festive suit sets — currently available in the boutique.", cover: "1588140686379-1b76a52103dc" },
  { slug: "tops-and-skirts", name: "Matching Tops & Skirts", short: "Top & Skirt", blurb: "Coordinated top-and-skirt sets with a modern ethnic edge.", cover: "1574847872646-abff244bbd87" },
  { slug: "occasion-wear", name: "Family & Occasion Wear", short: "Occasion", blurb: "Coordinated looks for festivals, receptions and family functions.", cover: "1610189019389-975bbbc2f8f3" },
];

/** Grouped collections used for /collections/[slug] landing pages. */
export const COLLECTIONS: { slug: string; name: string; eyebrow: string; intro: string; cover: string; categories: CategorySlug[] }[] = [
  { slug: "sarees", name: "Sarees", eyebrow: "The Six Yards", intro: "Silk, designer and bridal sarees — chosen for their weave, their drape and the way they move.", cover: "1610030469839-f909584b43f1", categories: ["silk-sarees", "designer-sarees", "bridal-sarees"] },
  { slug: "lehengas", name: "Designer Lehengas", eyebrow: "Volume & Craft", intro: "Lehengas with hand-finished embroidery, sculpted skirts and dupattas that frame the face.", cover: "1654764746590-841871176bc0", categories: ["designer-lehengas", "tops-and-skirts"] },
  { slug: "bridal", name: "Bridal Couture", eyebrow: "For the Bride", intro: "Bridal sarees, lehengas and complete looks for every ceremony of the wedding.", cover: "1684868268327-7e5590bcfbd6", categories: ["bridal-sarees", "bridal-collections"] },
  { slug: "anarkali", name: "Anarkali Gowns", eyebrow: "Grace in Motion", intro: "Floor-length Anarkalis with flowing flares and fine thread work.", cover: "1602210901882-071c6b9e239d", categories: ["anarkali-gowns"] },
  { slug: "occasion", name: "Family & Occasion Wear", eyebrow: "Celebrations", intro: "Festive and family-function wear, coordinated across the generations.", cover: "1610189019383-606d9eaa6766", categories: ["occasion-wear", "salwar-suits"] },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  color: string;
  colorHex: string;
  fabric: string;
  occasion: string;
  images: string[];
  description: string;
  options?: { label: string; values: string[] };
  badge?: string;
  isDemo: true;
};

type Seed = [image: string, name: string, color: string, hex: string, price: number, extra?: Partial<Product>];

const FABRIC: Record<CategorySlug, string> = {
  "silk-sarees": "Silk with woven zari (demo — confirm with boutique)",
  "designer-sarees": "Designer blend (demo — confirm with boutique)",
  "bridal-sarees": "Silk with zari work (demo — confirm with boutique)",
  "designer-lehengas": "Embroidered lehenga set (demo — confirm with boutique)",
  "anarkali-gowns": "Embroidered georgette (demo — confirm with boutique)",
  "bridal-collections": "Bridal ensemble (demo — confirm with boutique)",
  "salwar-suits": "Suit set (demo — confirm with boutique)",
  "tops-and-skirts": "Coordinated set (demo — confirm with boutique)",
  "occasion-wear": "Festive wear (demo — confirm with boutique)",
};

const OCCASION: Record<CategorySlug, string> = {
  "silk-sarees": "Weddings · Festivals",
  "designer-sarees": "Parties · Receptions",
  "bridal-sarees": "Muhurtham · Bridal",
  "designer-lehengas": "Sangeet · Reception",
  "anarkali-gowns": "Festive · Evening",
  "bridal-collections": "Bridal · Engagement",
  "salwar-suits": "Everyday · Festive",
  "tops-and-skirts": "Festive · Mehendi",
  "occasion-wear": "Family functions",
};

const OPTIONS: Partial<Record<CategorySlug, { label: string; values: string[] }>> = {
  "silk-sarees": { label: "Blouse", values: ["Unstitched blouse piece", "Stitched to measure"] },
  "designer-sarees": { label: "Blouse", values: ["Unstitched blouse piece", "Stitched to measure"] },
  "bridal-sarees": { label: "Blouse", values: ["Unstitched blouse piece", "Bridal blouse to measure"] },
  "occasion-wear": { label: "Blouse", values: ["Unstitched blouse piece", "Stitched to measure"] },
  "designer-lehengas": { label: "Size", values: ["S", "M", "L", "XL", "Custom fit"] },
  "anarkali-gowns": { label: "Size", values: ["S", "M", "L", "XL", "XXL"] },
  "bridal-collections": { label: "Fit", values: ["Standard size", "Custom fit (appointment)"] },
  "tops-and-skirts": { label: "Size", values: ["S", "M", "L", "XL"] },
};

const SEEDS: Record<CategorySlug, Seed[]> = {
  "silk-sarees": [
    ["1679006831648-7c9ea12e5807", "Mint Temple-Border Silk Saree", "Mint", "#9fc9b5", 14800, { badge: "New" }],
    ["1610030469983-98e550d6193c", "Midnight Violet Kanchipuram Silk", "Violet", "#3b2463", 18500],
    ["1610030469839-f909584b43f1", "Noir & Rani Pink Silk Saree", "Black", "#141414", 16900],
    ["1641699862936-be9f49b1c38d", "Amethyst Zari Silk Saree", "Purple", "#6b3f8f", 17400],
    ["1678705730064-a7ecbab4b3fb", "Ivory & Crimson Border Silk", "Ivory", "#efe4cf", 13900],
    ["1610189012906-4c0aa9b9781e", "Royal Navy Butta Silk Saree", "Navy", "#1d2756", 19800, { badge: "Signature" }],
    ["1610189025857-f42fe6e8dd91", "Indigo Peacock Motif Silk", "Indigo", "#3a2f7a", 18200],
    ["1610189013429-a703f4b245cf", "Sapphire & Sunflower Silk Saree", "Royal Blue", "#2643a3", 16500],
    ["1742287724816-4a8a1cc7ad5c", "Magenta Contrast Pallu Silk", "Magenta", "#b0186e", 15800],
    ["1610189026297-df356264479c", "Plum Floral Butta Silk Saree", "Plum", "#552a6b", 17900],
    ["1609748513078-9ff6232781c5", "Navy Ganga-Jamuna Silk Saree", "Navy", "#202a5c", 16200],
    ["1610313517157-ee3d5f95d619", "Emerald Checks Silk Saree", "Emerald", "#0f5a4a", 15400],
    ["1610030469825-fe474466db75", "Dove Grey Rose-Border Silk", "Grey", "#9aa3b3", 14600],
    ["1610030469978-6bb537f3b982", "Cobalt Bloom Silk Saree", "Cobalt", "#2148a8", 16800],
    ["1612273882633-9416493e1914", "Turmeric & Violet Silk Saree", "Mustard", "#d0a021", 15200],
    ["1614881064213-180b1c28f743", "Peacock Green Kanchipuram Silk", "Peacock", "#11594f", 21500, { badge: "Signature" }],
    ["1610189338431-5f914faf21c7", "Lavender Mist Butta Silk", "Lavender", "#8b6bb3", 14900],
    ["1610189338344-f3ce0d0f6d06", "Maroon Gold Vine Silk Saree", "Maroon", "#5b1a1f", 18900],
  ],
  "designer-sarees": [
    ["1609748340041-f5d61e061ebc", "Sage Tissue Designer Saree", "Sage", "#a9c3ae", 9800, { badge: "New" }],
    ["1610030469668-8e9f641aaf27", "Onyx & Silver Designer Saree", "Black", "#121212", 11200],
    ["1692992193981-d3d92fabd9cb", "Indigo Garden Print Saree", "Indigo", "#3d4f9a", 8900],
    ["1732709470611-670308da8c5e", "Peach Heritage Print Saree", "Peach", "#e6b09a", 7600],
    ["1610189338175-0782dfdb0c04", "Coral Sheen Organza Saree", "Coral", "#ea8a76", 8400],
    ["1609748340878-c690e3e4706b", "Blush Ivory Designer Saree", "Blush", "#f0d9cf", 9200],
    ["1610189000544-1f0885c4bbeb", "Lemon Silk Organza Saree", "Lemon", "#f2d65b", 8800],
    ["1609748341932-f0206c09412b", "Citrus Colour-Block Saree", "Yellow", "#e6c33c", 7900],
    ["1610276580899-53d1af1a1359", "Ocean Ombre Designer Saree", "Teal", "#1f7a8c", 9600],
    ["1610030469245-ab65c4583802", "Bottle Green Designer Saree", "Green", "#174d3a", 10400],
    ["1742287721821-ddf522b3f37b", "Olive Checks Designer Saree", "Olive", "#77724a", 8200],
    ["1609748341905-080e077af4ca", "Rose & Ruby Designer Saree", "Rose", "#e7a7a7", 9900, { badge: "Bestseller" }],
    ["1609748341651-42920e667214", "Powder Blue Designer Saree", "Powder Blue", "#b8d3df", 8600],
    ["1609748340756-aeb8223d6c64", "Petal Pink Designer Saree", "Pink", "#f2bcc6", 8600],
    ["1610189019383-606d9eaa6766", "Sky Lattice Designer Saree", "Sky", "#a9cfe8", 9400],
  ],
  "occasion-wear": [
    ["1610189019389-975bbbc2f8f3", "Ice Blue Festive Saree", "Ice Blue", "#cfe3ef", 7800],
    ["1610313416458-8e435d6f7ed2", "Sunset Pink Festive Saree", "Pink", "#ef8aa0", 8200],
    ["1610189335437-3cbce21d9d5f", "Aqua Shimmer Occasion Saree", "Aqua", "#4fb3d8", 8900],
    ["1609748342012-7dfce6fee14f", "Blush Motif Occasion Saree", "Blush", "#efc8c6", 7900],
    ["1609748341859-b75967ead013", "Marigold Festive Saree", "Marigold", "#f0b42a", 7400, { badge: "Festive" }],
    ["1610189335693-9e909b33aa32", "Turquoise Zari Occasion Saree", "Turquoise", "#2aa8b5", 8500],
  ],
  "bridal-sarees": [
    ["1619516388835-2b60acc4049e", "Sindoor Red Bridal Silk Saree", "Red", "#b3261e", 26500, { badge: "Bridal" }],
    ["1617627143750-d86bc21e42bb", "Rani & Saffron Bridal Saree", "Rani Pink", "#d1306f", 24900],
    ["1727430228383-aa1fb59db8bf", "Copper Rose Bridal Silk", "Copper", "#c0714f", 23800],
    ["1615555896813-401d84a0d737", "Ivory Gold Muhurtham Saree", "Ivory", "#efe3c4", 22500],
    ["1716504628105-bd76d91e85f2", "Saffron Flame Bridal Saree", "Saffron", "#e0702b", 21900],
    ["1618901185975-d59f7091bcfe", "Heritage Crimson Bridal Saree", "Crimson", "#9e1b22", 27900, { badge: "Signature" }],
    ["1616669181995-9b867456f33b", "Blush Pearl Bridal Saree", "Blush", "#f1c7cc", 24200],
    ["1610030469069-cb6620bea733", "Vermilion & Marigold Bridal Saree", "Vermilion", "#d4401f", 22900],
    ["1616429321229-733d6a7ff456", "Golden Tissue Bridal Saree", "Gold", "#cfae6a", 25800],
    ["1739429945610-95901c2baf18", "Ivory & Emerald Border Bridal Saree", "Ivory", "#efe6d0", 28500],
    ["1610047614301-13c63f00c032", "Ruby Bridal Silk Ensemble", "Ruby", "#8f1222", 32000, { badge: "Bridal" }],
  ],
  "designer-lehengas": [
    ["1638457133838-50b704b2655c", "Teal & Crimson Mirror Lehenga", "Teal", "#1b6f6b", 29500, { badge: "New" }],
    ["1633685894176-9f715a092b79", "Maroon Zardozi Lehenga", "Maroon", "#6a1424", 36500, { badge: "Signature" }],
    ["1654764746590-841871176bc0", "Crimson Heritage Bridal Lehenga", "Crimson", "#a3162a", 42000],
    ["1746372283841-dbb3838f9935", "Blossom Pink Embroidered Lehenga", "Pink", "#e59ab0", 31500],
    ["1767955694884-d4bf352c23c2", "Marigold & Gold Lehenga", "Marigold", "#d78a2a", 32000],
    ["1668371679302-a8ec781e876e", "Scarlet Flow Lehenga", "Scarlet", "#b3192c", 28900],
    ["1619715613791-89d35b51ff81", "Emerald Cascade Lehenga", "Emerald", "#0f6a57", 33800],
    ["1649930055986-ca57250a7fd4", "Lilac Garden Lehenga", "Lilac", "#b9a3cf", 27500],
    ["1677001059707-a9b84bd8f0bf", "Flame Red Festive Lehenga", "Red", "#c62a1f", 30500],
    ["1654764746225-e63f5e90facd", "Royal Red Bridal Lehenga", "Red", "#9d1525", 45000, { badge: "Bridal" }],
  ],
  "tops-and-skirts": [
    ["1574847872646-abff244bbd87", "Mustard Skirt & Ivory Top Set", "Mustard", "#d6a02b", 12500, { badge: "New" }],
  ],
  "anarkali-gowns": [
    ["1601432093209-8af1fd74b054", "Ivory Chikankari Anarkali", "Ivory", "#f1ebdd", 12500],
    ["1602210901882-071c6b9e239d", "Pearl White Flared Anarkali", "White", "#f6f3ec", 13800, { badge: "Bestseller" }],
    ["1601571115502-83ca3095735b", "Moonlight Anarkali Gown", "Ivory", "#eee6d4", 14200],
    ["1601571103926-ed7860bb5e2c", "Cloud White Embroidered Anarkali", "White", "#f4f1ea", 12900],
    ["1602210666042-4d76a62d6fcb", "Ivory & Red Accent Anarkali", "Ivory", "#efe5d2", 13500],
  ],
  "bridal-collections": [
    ["1600685890506-593fdf55949b", "The Rajkumari Bridal Look", "Red", "#a3172a", 52000, { badge: "Bridal" }],
    ["1610173827043-9db50e0d8ef9", "Rubies & Henna Bridal Ensemble", "Red", "#9b1b2a", 48500],
    ["1684868268327-7e5590bcfbd6", "Crimson Gold Wedding Look", "Crimson", "#8e1426", 55000, { badge: "Signature" }],
    ["1756483571456-6fa86cb1ae53", "Rani Pink Bridal Look", "Rani Pink", "#c8296a", 46500],
    ["1763145229778-723c84ad3bce", "Maharani Velvet Bridal Look", "Maroon", "#5e1020", 58000],
    ["1654764746221-7bc58ef4dbad", "Ruby Dupatta Bridal Ensemble", "Ruby", "#8d1424", 49500],
    ["1769500804865-aa952b593186", "Magenta Silver Bridal Saree Look", "Magenta", "#b22a6c", 38500],
    ["1769500801394-ca7dbd6cd433", "Orchid Bridal Drape", "Orchid", "#a8306d", 37900],
  ],
  "salwar-suits": [],
};

const DESCRIPTIONS: Record<CategorySlug, (name: string, color: string) => string> = {
  "silk-sarees": (n, c) => `${n} — a ${c.toLowerCase()} silk drape with a contrast woven border and a richly worked pallu. Chosen for its lustre and the weight of its fall, it is a saree that carries from the temple to the reception.`,
  "designer-sarees": (n, c) => `${n} in ${c.toLowerCase()} — a lighter, contemporary drape for celebrations, with a soft hand-feel and a finish designed to photograph beautifully.`,
  "occasion-wear": (n, c) => `${n} — a ${c.toLowerCase()} festive saree for family functions, festivals and receptions. Easy to drape, comfortable through long celebrations.`,
  "bridal-sarees": (n, c) => `${n} — a ${c.toLowerCase()} bridal saree with dense zari work and a ceremonial pallu, styled for the muhurtham and the moments that follow.`,
  "designer-lehengas": (n, c) => `${n} — a ${c.toLowerCase()} lehenga set with a sculpted, flared skirt, embroidered blouse and a coordinated dupatta.`,
  "tops-and-skirts": (n, c) => `${n} — a coordinated ${c.toLowerCase()} skirt and top set: festive, light and easy to restyle.`,
  "anarkali-gowns": (n, c) => `${n} — a floor-length ${c.toLowerCase()} Anarkali with a generous flare and delicate thread embroidery.`,
  "bridal-collections": (n, c) => `${n} — a complete ${c.toLowerCase()} bridal look styled by the boutique. Book an appointment to see the full ensemble and discuss customisation.`,
  "salwar-suits": (n) => n,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const DETAIL_SHOTS = [
  "1724856604403-60304b28906c",
  "1724856605022-106d6dd6e842",
  "1616986491129-3e37cb654c82",
  "1518893063132-36e46dbe2428",
  "1616756351484-798f37bdffa0",
];

function build(): Product[] {
  const out: Product[] = [];
  let n = 1;
  (Object.keys(SEEDS) as CategorySlug[]).forEach((cat) => {
    const seeds = SEEDS[cat];
    seeds.forEach((s, i) => {
      const [image, name, color, hex, price, extra] = s;
      // Gallery: the look · a tighter crop of the same photo (border/drape) ·
      // a representative craft close-up. Never another product's photo.
      const detail = DETAIL_SHOTS[(n + i) % DETAIL_SHOTS.length];
      const images = [image, `${image}#detail`, detail];
      out.push({
        id: `SSH-${String(n).padStart(3, "0")}`,
        slug: slugify(name),
        name,
        category: cat,
        price,
        color,
        colorHex: hex,
        fabric: FABRIC[cat],
        occasion: OCCASION[cat],
        images,
        description: DESCRIPTIONS[cat](name, color),
        options: OPTIONS[cat],
        isDemo: true,
        ...extra,
      });
      n++;
    });
  });
  return out;
}

export const PRODUCTS: Product[] = build();

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const productsIn = (cats: CategorySlug[]) => PRODUCTS.filter((p) => cats.includes(p.category));
export const relatedTo = (p: Product, count = 4) => {
  const same = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const others = PRODUCTS.filter((x) => x.category !== p.category && x.id !== p.id);
  return [...same, ...others].slice(0, count);
};
export const PRICE_BOUNDS = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price)),
};
export const COLORS = Array.from(new Map(PRODUCTS.map((p) => [p.color, p.colorHex])).entries()).map(
  ([name, hex]) => ({ name, hex })
);

/** Imagery for the storytelling scenes (textiles, looms, details). */
export const STORY = {
  heroModel: "1614881064213-180b1c28f743",
  heroModelAlt: "1610189012906-4c0aa9b9781e",
  silk: "1620763050148-af058ab2fff0",
  silkRed: "1518893063132-36e46dbe2428",
  silkTeal: "1676696706907-0e04665b80bd",
  threads: "1569909115134-a0426936c879",
  warp: "1643766883805-829d9ad95c42",
  loom: "1714245145426-c8565109aa34",
  loomShuttle: "1699817702889-01bc4c1a45d9",
  zari: "1588140686379-1b76a52103dc",
  border: "1616986491129-3e37cb654c82",
  pearls: "1616756351484-798f37bdffa0",
  embroidery: "1724856604403-60304b28906c",
  embroidery2: "1724856605022-106d6dd6e842",
  sareeHero: "1610030469983-98e550d6193c",
  bridal: ["1684868268327-7e5590bcfbd6", "1600685890506-593fdf55949b", "1610173827043-9db50e0d8ef9"],
  boutique: "1612273882633-9416493e1914",
};
