"use client";

import { InstagramIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X, ArrowUpRight, Phone } from "lucide-react";
import Wordmark from "./Wordmark";
import Img from "@/components/ui/Img";
import { CATEGORIES, COLLECTIONS, PRODUCTS } from "@/data/products";
import { SITE, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [preview, setPreview] = useState(CATEGORIES[0].cover);
  const lastY = useRef(0);
  const closeTimer = useRef<number>();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 300 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(false);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawer) return;
    lockScroll();
    return () => unlockScroll();
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMega(false); setDrawer(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const overHero = pathname === "/" && !scrolled && !mega;
  const openMega = () => { window.clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = window.setTimeout(() => setMega(false), 160); };
  const count = (slug: string) => PRODUCTS.filter((p) => p.category === slug).length;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header
        className={`site-header ${overHero ? "is-over-hero" : "is-solid"} ${hidden && !mega ? "is-hidden" : ""} ${mega ? "is-mega" : ""}`}
        onMouseLeave={closeMega}
      >
        <div className="site-header__bar">
          <nav className="site-header__nav" aria-label="Primary">
            <button className="icon-btn only-mobile" aria-label="Open menu" onClick={() => setDrawer(true)}>
              <Menu size={20} strokeWidth={1.4} />
            </button>
            <button
              className="nav-link only-desktop"
              aria-expanded={mega}
              aria-controls="mega-menu"
              onMouseEnter={openMega}
              onFocus={openMega}
              onClick={() => setMega((m) => !m)}
              data-cursor="hover"
            >
              Shop
            </button>
            <Link className="nav-link only-desktop" href="/collections/bridal" onMouseEnter={closeMega} data-cursor="hover">Bridal</Link>
            <Link className="nav-link only-desktop" href="/collections/sarees" onMouseEnter={closeMega} data-cursor="hover">Sarees</Link>
            <Link className="nav-link only-desktop" href="/our-story" onMouseEnter={closeMega} data-cursor="hover">Our Story</Link>
          </nav>

          <Wordmark />

          <div className="site-header__actions">
            <button className="icon-btn" aria-label="Search (press /)" onClick={() => setSearchOpen(true)} data-cursor="hover">
              <Search size={19} strokeWidth={1.4} />
            </button>
            <Link className="icon-btn only-desktop" href="/wishlist" aria-label={`Wishlist (${wishlist.length})`} data-cursor="hover">
              <Heart size={19} strokeWidth={1.4} />
              {wishlist.length > 0 && <span className="icon-btn__badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" aria-label={`Shopping bag (${cartCount} items)`} onClick={() => setCartOpen(true)} data-cursor="hover">
              <ShoppingBag size={19} strokeWidth={1.4} />
              {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
            </button>
            <Link className="nav-cta only-desktop" href="/contact" data-cursor="hover">Book a Visit</Link>
          </div>
        </div>

        <div id="mega-menu" className="mega" onMouseEnter={openMega} aria-hidden={!mega}>
          <div className="mega__inner">
            <div className="mega__col">
              <p className="eyebrow">Categories</p>
              <ul className="mega__list">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop?cat=${c.slug}`} onMouseEnter={() => setPreview(c.cover)} onFocus={() => setPreview(c.cover)} data-cursor="hover">
                      <span>{c.name}</span>
                      <sup>{count(c.slug) || "In store"}</sup>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mega__col">
              <p className="eyebrow">Collections</p>
              <ul className="mega__list mega__list--serif">
                {COLLECTIONS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} onMouseEnter={() => setPreview(c.cover)} onFocus={() => setPreview(c.cover)} data-cursor="hover">
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li><Link href="/shop" data-cursor="hover">Shop All <ArrowUpRight size={16} /></Link></li>
              </ul>
            </div>
            <div className="mega__preview">
              {/* key forces a soft crossfade when the preview changes */}
              <div key={preview} className="mega__preview-img">
                <Img id={preview} alt="" ratio={1.3} sizes="320px" width={640} />
              </div>
              <p className="mega__note">Every piece can be reserved on WhatsApp and viewed at the boutique in Marthandam.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div className={`drawer-scrim ${drawer ? "is-open" : ""}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`nav-drawer ${drawer ? "is-open" : ""}`} aria-label="Menu" aria-hidden={!drawer} data-lenis-prevent>
        <div className="nav-drawer__top">
          <Wordmark />
          <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu" tabIndex={drawer ? 0 : -1}>
            <X size={22} strokeWidth={1.3} />
          </button>
        </div>
        <nav className="nav-drawer__links">
          {[
            ["Shop All", "/shop"],
            ["Sarees", "/collections/sarees"],
            ["Designer Lehengas", "/collections/lehengas"],
            ["Bridal Couture", "/collections/bridal"],
            ["Anarkali Gowns", "/collections/anarkali"],
            ["Occasion Wear", "/collections/occasion"],
            ["Our Story", "/our-story"],
            ["Wishlist", "/wishlist"],
            ["Contact", "/contact"],
          ].map(([label, href], i) => (
            <Link key={href} href={href} style={{ transitionDelay: drawer ? `${80 + i * 40}ms` : "0ms" }} tabIndex={drawer ? 0 : -1}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-drawer__foot">
          <a href={`tel:${SITE.phoneE164}`} tabIndex={drawer ? 0 : -1}><Phone size={15} /> {SITE.phoneDisplay}</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" tabIndex={drawer ? 0 : -1}><InstagramIcon size={15} /> {SITE.instagramHandle}</a>
          <a href={whatsappLink("Hello Shambhavi Silks! I'd like to know more about your collection.")} target="_blank" rel="noopener noreferrer" className="lux-btn lux-btn--light" tabIndex={drawer ? 0 : -1}>
            <span className="lux-btn__label">Chat on WhatsApp</span>
          </a>
        </div>
      </aside>
    </>
  );
}
