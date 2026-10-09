import { PRODUCTS } from "@/data/products";
import { formatINR, SITE } from "@/data/site";
import type { CartLine } from "./store";

/** Builds a readable WhatsApp order summary from the bag. */
export function orderMessage(cart: CartLine[]) {
  let total = 0;
  const lines = cart
    .map((l, i) => {
      const p = PRODUCTS.find((x) => x.id === l.productId);
      if (!p) return "";
      total += p.price * l.qty;
      return `${i + 1}. ${p.name} (${p.id})${l.option ? ` — ${l.option}` : ""} × ${l.qty} — ${formatINR(p.price * l.qty)}`;
    })
    .filter(Boolean);
  return [
    `Hello ${SITE.shortName} Silks! I'd like to order:`,
    ...lines,
    `Estimated total: ${formatINR(total)}`,
    "Please confirm availability, final price and delivery. Thank you!",
  ].join("\n");
}

export function enquiryMessage(name: string, code: string, option?: string, url?: string) {
  return [
    `Hello ${SITE.shortName} Silks! I'm interested in:`,
    `${name} (${code})${option ? ` — ${option}` : ""}`,
    url ? url : "",
    "Is it available? Please share more details.",
  ]
    .filter(Boolean)
    .join("\n");
}
