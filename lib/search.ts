import { CATEGORIES, type Product } from "@/data/products";

/** Lightweight weighted search across name, colour, category and occasion. */
export function searchProducts(list: Product[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list
    .map((p) => {
      const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? "";
      const hay = {
        name: p.name.toLowerCase(),
        color: p.color.toLowerCase(),
        cat: cat.toLowerCase(),
        rest: `${p.occasion} ${p.description}`.toLowerCase(),
      };
      let score = 0;
      for (const t of terms) {
        let s = 0;
        if (hay.name.includes(t)) s += 5;
        if (hay.color.includes(t)) s += 4;
        if (hay.cat.includes(t)) s += 3;
        if (hay.rest.includes(t)) s += 1;
        if (!s) return { p, score: 0 };
        score += s;
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}
