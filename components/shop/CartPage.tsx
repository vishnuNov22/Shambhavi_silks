"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { PRODUCTS, getCategory } from "@/data/products";
import { formatINR, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { orderMessage } from "@/lib/order";

export default function CartPage() {
  const { cart, setQty, removeLine, cartTotal, cartCount, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="container empty empty--page">
        <p className="empty__title">Your bag is empty.</p>
        <p>Every piece you add is reserved by message — nothing is charged online.</p>
        <LuxButton href="/shop">Explore the collection</LuxButton>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-page__lines">
        <div className="cart-page__head">
          <p>{cartCount} {cartCount === 1 ? "item" : "items"}</p>
          <button className="text-link text-link--sm" onClick={clearCart}>Clear bag</button>
        </div>
        <ul>
          {cart.map((l) => {
            const p = PRODUCTS.find((x) => x.id === l.productId);
            if (!p) return null;
            return (
              <li key={l.key} className="cart-row">
                <Link href={`/product/${p.slug}`} className="cart-row__img"><Img id={p.images[0]} alt={p.name} ratio={1.3} width={400} sizes="160px" /></Link>
                <div className="cart-row__info">
                  <p className="eyebrow">{getCategory(p.category)?.name}</p>
                  <Link href={`/product/${p.slug}`} className="cart-row__name">{p.name}</Link>
                  {l.option && <p className="cart-row__opt">{l.option}</p>}
                  <p className="cart-row__unit">{formatINR(p.price)} each</p>
                  <div className="qty">
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                    <span aria-live="polite">{l.qty}</span>
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                  </div>
                </div>
                <p className="cart-row__total">{formatINR(p.price * l.qty)}</p>
                <button className="cart-row__remove icon-btn" onClick={() => removeLine(l.key)} aria-label={`Remove ${p.name}`}><X size={16} /></button>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="cart-summary">
        <h2>Summary</h2>
        <div className="cart-total"><span>Subtotal</span><strong>{formatINR(cartTotal)}</strong></div>
        <div className="cart-total cart-total--muted"><span>Delivery</span><span>Confirmed on order</span></div>
        <a className="lux-btn lux-btn--solid lux-btn--block" href={whatsappLink(orderMessage(cart))} target="_blank" rel="noopener noreferrer">
          <span className="lux-btn__fill" aria-hidden="true" /><span className="lux-btn__label">Place order on WhatsApp</span>
        </a>
        <p className="fine">
          This prototype sends your bag to the boutique on WhatsApp; the team confirms availability, final price and delivery.
          Online payment (e.g. Razorpay/Stripe) and live inventory plug in at <code>lib/order.ts</code> and <code>data/products.ts</code>.
        </p>
      </aside>
    </div>
  );
}
