"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import Wordmark from "./Wordmark";
import SoundToggle from "./SoundToggle";
import Img from "@/components/ui/Img";
import { COLLECTIONS, STORY } from "@/data/products";
import { SITE, whatsappLink } from "@/data/site";
import { useStore } from "@/lib/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const MENU = [
  { label: "The Collection", href: "/shop", img: "1610189012906-4c0aa9b9781e" },
  ...COLLECTIONS.map((c) => ({ label: c.name, href: `/collections/${c.slug}`, img: c.cover })),
  { label: "Our Craft", href: "/our-story", img: STORY.loom },
  { label: "Visit & Contact", href: "/contact", img: STORY.silkTeal },
];

/**
 * Minimal editorial navigation: Menu · wordmark · sound / search / bag.
 * The menu opens a full-screen emerald index with a live image preview.
 */
export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState(MENU[0].img);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 260 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y < 260) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenu(false); }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => { unlockScroll(); window.removeEventListener("keydown", onKey); };
  }, [menu]);

  // Over the dark cinematic home page the bar stays transparent; elsewhere it becomes ivory on scroll.
  const dark = pathname === "/";
  const t = menu ? 0 : -1;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`site-header ${dark ? "is-dark" : "is-light"} ${scrolled ? "is-scrolled" : ""} ${hidden && !menu ? "is-hidden" : ""} ${menu ? "is-menu" : ""}`}>
        <div className="site-header__bar">
          <div className="site-header__left">
            <button className="menu-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="site-menu" data-cursor="hover">
              <span className="menu-btn__lines" aria-hidden="true"><i /><i /></span>
              <span className="menu-btn__label">{menu ? "Close" : "Menu"}</span>
            </button>
            <Link href="/shop" className="nav-link only-desktop" data-cursor="hover">Collection</Link>
            <Link href="/collections/bridal" className="nav-link only-desktop" data-cursor="hover">Bridal</Link>
          </div>

          <Wordmark />

          <div className="site-header__actions">
            <SoundToggle className="only-desktop" />
            <button className="icon-btn" aria-label="Search (press /)" onClick={() => setSearchOpen(true)} data-cursor="hover">
              <Search size={18} strokeWidth={1.3} />
            </button>
            <button className="icon-btn" aria-label={`Shopping bag (${cartCount} items)`} onClick={() => setCartOpen(true)} data-cursor="hover">
              <ShoppingBag size={18} strokeWidth={1.3} />
              {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" className={`menu ${menu ? "is-open" : ""}`} aria-hidden={!menu} role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent>
        <div className="menu__inner">
          <nav className="menu__links" aria-label="Primary">
            {MENU.map((m, i) => (
              <Link
                key={m.href}
                href={m.href}
                tabIndex={t}
                onMouseEnter={() => setPreview(m.img)}
                onFocus={() => setPreview(m.img)}
                style={{ transitionDelay: menu ? `${120 + i * 55}ms` : "0ms" }}
                className={pathname === m.href ? "is-current" : ""}
              >
                <span className="menu__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="menu__t">{m.label}</span>
              </Link>
            ))}
          </nav>
          <div className="menu__preview only-desktop" aria-hidden="true">
            <div key={preview} className="menu__preview-img">
              <Img id={preview} alt="" ratio={1.3} width={800} sizes="30vw" />
            </div>
          </div>
          <div className="menu__foot">
            <Link href="/wishlist" tabIndex={t}>Wishlist{wishlist.length ? ` (${wishlist.length})` : ""}</Link>
            <a href={`tel:${SITE.phoneE164}`} tabIndex={t}>{SITE.phoneDisplay}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" tabIndex={t}><InstagramIcon size={14} /> {SITE.instagramHandle}</a>
            <a href={whatsappLink("Hello Shambhavi Silks! I'd like to know more about your collection.")} target="_blank" rel="noopener noreferrer" tabIndex={t}>WhatsApp</a>
            <SoundToggle className="only-mobile" />
          </div>
        </div>
      </div>
    </>
  );
}
