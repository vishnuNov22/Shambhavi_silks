"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";

export type CartLine = { key: string; productId: string; option?: string; qty: number };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (p: Product, option?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  pushRecent: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  toast: string | null;
  notify: (msg: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state stays in memory */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCart(read("ssh_cart", []));
    setWishlist(read("ssh_wish", []));
    setRecent(read("ssh_recent", []));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) write("ssh_cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) write("ssh_wish", wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) write("ssh_recent", recent); }, [recent, hydrated]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  const addToCart = useCallback((p: Product, option?: string, qty = 1) => {
    const key = `${p.id}::${option ?? ""}`;
    setCart((c) => {
      const found = c.find((l) => l.key === key);
      if (found) return c.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
      return [...c, { key, productId: p.id, option, qty }];
    });
    notify(`${p.name} added to your bag`);
  }, [notify]);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)));
  }, []);
  const removeLine = useCallback((key: string) => setCart((c) => c.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((w) => {
      const has = w.includes(id);
      notify(has ? "Removed from wishlist" : "Saved to your wishlist");
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, [notify]);
  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);
  const pushRecent = useCallback((id: string) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const { cartCount, cartTotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const l of cart) {
      const p = PRODUCTS.find((x) => x.id === l.productId);
      if (!p) continue;
      count += l.qty;
      total += p.price * l.qty;
    }
    return { cartCount: count, cartTotal: total };
  }, [cart]);

  const value: StoreValue = {
    cart, wishlist, recent, cartCount, cartTotal, addToCart, setQty, removeLine, clearCart,
    toggleWish, isWished, pushRecent, cartOpen, setCartOpen, searchOpen, setSearchOpen,
    quickView, setQuickView, toast, notify,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
