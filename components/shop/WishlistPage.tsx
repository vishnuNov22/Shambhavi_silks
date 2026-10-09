"use client";

import ProductCard from "./ProductCard";
import LuxButton from "@/components/ui/LuxButton";
import { PRODUCTS } from "@/data/products";
import { whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is (typeof PRODUCTS)[number] => !!p);
  if (!items.length) {
    return (
      <div className="container empty empty--page">
        <p className="empty__title">Nothing saved yet.</p>
        <p>Tap the heart on any piece to keep it here.</p>
        <LuxButton href="/shop">Browse the collection</LuxButton>
      </div>
    );
  }
  const msg = `Hello Shambhavi Silks! I'm interested in these pieces:\n${items.map((p) => `• ${p.name} (${p.id})`).join("\n")}`;
  return (
    <div className="container wish-page">
      <div className="grid">{items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div>
      <div className="wish-page__foot">
        <LuxButton href={whatsappLink(msg)} external>Send my wishlist on WhatsApp</LuxButton>
      </div>
    </div>
  );
}
