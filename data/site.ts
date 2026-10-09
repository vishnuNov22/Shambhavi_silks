/**
 * Business configuration — edit here and every page updates.
 */
export const SITE = {
  name: "Shambhavi Silks & Handlooms",
  shortName: "Shambhavi",
  tagline: "being traditional is being classy",
  url: "https://www.shambhavisilks.com",
  instagram: "https://www.instagram.com/shambhavisilks/",
  instagramHandle: "@shambhavisilks",
  phoneDisplay: "+91 95244 22777",
  phoneE164: "+919524422777",
  /** WhatsApp number in international format without "+" */
  whatsapp: "919524422777",
  address: {
    line1: "1st Floor, Opp. Chitra Hotel",
    line2: "Pammam, Marthandam",
    city: "Marthandam",
    state: "Tamil Nadu",
    pin: "629165",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shambhavi+Silks+Pammam+Marthandam+629165",
  currency: "INR",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
