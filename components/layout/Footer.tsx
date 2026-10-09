import { InstagramIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { SITE, whatsappLink } from "@/data/site";
import { TempleBorder } from "@/components/ui/Motif";

export default function Footer() {
  return (
    <footer className="footer">
      <TempleBorder className="footer__border" />
      <div className="footer__grid">
        <div className="footer__brand">
          <p className="footer__word">Shambhavi</p>
          <p className="footer__sub">Silks &amp; Handlooms</p>
          <p className="footer__tag">“{SITE.tagline}”</p>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <ul>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}><Link href={`/shop?cat=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">House</p>
          <ul>
            <li><Link href="/our-story">Our Story</Link></li>
            <li><Link href="/collections/bridal">Bridal Appointments</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/cart">Bag</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer__visit">
          <p className="eyebrow">Visit the boutique</p>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={15} /> {SITE.address.line1}, {SITE.address.line2} – {SITE.address.pin}</a>
          <a href={`tel:${SITE.phoneE164}`}><Phone size={15} /> {SITE.phoneDisplay}</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon size={15} /> {SITE.instagramHandle}</a>
          <a href={whatsappLink("Hello Shambhavi Silks! I'd like to book a visit to the boutique.")} target="_blank" rel="noopener noreferrer" className="text-link">Book a visit on WhatsApp</a>
        </div>
      </div>
      <div className="footer__base">
        <p>© {new Date().getFullYear()} {SITE.name}, Marthandam.</p>
        <p>Prototype: products, prices and photography are demo content (photos via Unsplash) pending the boutique’s own catalogue.</p>
      </div>
    </footer>
  );
}
