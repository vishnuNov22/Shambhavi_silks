import { InstagramIcon } from "@/components/ui/Icons";
import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import PageHero from "@/components/shop/PageHero";
import ContactForm from "@/components/shop/ContactForm";
import { SITE } from "@/data/site";
import { STORY } from "@/data/products";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description: `Visit Shambhavi Silks & Handlooms at ${SITE.address.line1}, ${SITE.address.line2} – ${SITE.address.pin}. Call ${SITE.phoneDisplay}.`,
};

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact & Visit" title="Come say hello" intro="Book a bridal appointment, ask about a piece, or simply drop by the boutique." image={STORY.silkTeal} />
      <section className="contact container">
        <div className="contact__info">
          <div className="contact__block">
            <p className="eyebrow">Boutique</p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} /> {SITE.address.line1},<br />{SITE.address.line2} – {SITE.address.pin}, {SITE.address.state}</a>
          </div>
          <div className="contact__block">
            <p className="eyebrow">Call / WhatsApp</p>
            <a href={`tel:${SITE.phoneE164}`}><Phone size={16} /> {SITE.phoneDisplay}</a>
            <p className="fine">Please call to confirm opening hours before you visit.</p>
          </div>
          <div className="contact__block">
            <p className="eyebrow">Instagram</p>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon size={16} /> {SITE.instagramHandle}</a>
          </div>
          <a className="contact__map" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Directions">
            <span>Open in Google Maps</span>
            <svg viewBox="0 0 400 200" aria-hidden="true">
              <path d="M0 140 C 80 120, 120 160, 200 130 S 320 90, 400 110" stroke="currentColor" fill="none" strokeWidth="1" />
              <path d="M60 0 L 140 200 M 260 0 L 230 200" stroke="currentColor" fill="none" strokeWidth=".6" opacity=".5" />
              <circle cx="205" cy="128" r="7" fill="currentColor" />
              <circle cx="205" cy="128" r="18" stroke="currentColor" fill="none" strokeWidth=".8" />
            </svg>
          </a>
        </div>
        <div className="contact__form">
          <h2>Plan your visit</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
