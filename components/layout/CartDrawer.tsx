"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import Img from "@/components/ui/Img";
import { PRODUCTS } from "@/data/products";
import { formatINR, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { orderMessage } from "@/lib/order";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeLine, cartTotal, cartCount } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { unlockScroll(); window.removeEventListener("keydown", onKey); };
  }, [cartOpen, setCartOpen]);

  const t = cartOpen ? 0 : -1;
  return (
    <>
      <div className={`drawer-scrim ${cartOpen ? "is-open" : ""}`} onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="cart-drawer__head">
          <h2>Your Bag <sup>{cartCount}</sup></h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag" tabIndex={t}><X size={22} strokeWidth={1.3} /></button>
        </div>
        <div className="cart-drawer__body" data-lenis-prevent>
          {cart.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Your bag is waiting.</p>
              <p>Explore silk sarees, lehengas and bridal couture.</p>
              <Link href="/shop" className="text-link" onClick={() => setCartOpen(false)} tabIndex={t}>Discover the collection</Link>
            </div>
          ) : (
            <ul className="cart-lines">
              {cart.map((l) => {
                const p = PRODUCTS.find((x) => x.id === l.productId);
                if (!p) return null;
                return (
                  <li key={l.key} className="cart-line">
                    <Link href={`/product/${p.slug}`} className="cart-line__img" onClick={() => setCartOpen(false)} tabIndex={t}>
                      <Img id={p.images[0]} alt={p.name} ratio={1.3} width={240} sizes="96px" />
                    </Link>
                    <div className="cart-line__info">
                      <p className="cart-line__name">{p.name}</p>
                      {l.option && <p className="cart-line__opt">{l.option}</p>}
                      <div className="qty">
                        <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity" tabIndex={t}><Minus size={13} /></button>
                        <span aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity" tabIndex={t}><Plus size={13} /></button>
                      </div>
                    </div>
                    <div className="cart-line__end">
                      <p>{formatINR(p.price * l.qty)}</p>
                      <button className="text-link text-link--sm" onClick={() => removeLine(l.key)} tabIndex={t}>Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__foot">
            <div className="cart-total"><span>Subtotal</span><strong>{formatINR(cartTotal)}</strong></div>
            <p className="fine">Demo prices. Delivery and final pricing are confirmed by the boutique.</p>
            <a className="lux-btn lux-btn--solid lux-btn--block" href={whatsappLink(orderMessage(cart))} target="_blank" rel="noopener noreferrer" tabIndex={t}>
              <span className="lux-btn__fill" aria-hidden="true" />
              <span className="lux-btn__label">Order on WhatsApp</span>
            </a>
            <Link className="text-link" href="/cart" onClick={() => setCartOpen(false)} tabIndex={t}>View full bag</Link>
          </div>
        )}
      </aside>
    </>
  );
}
