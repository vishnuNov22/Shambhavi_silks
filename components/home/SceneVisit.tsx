"use client";

import { InstagramIcon } from "@/components/ui/Icons";
import { useRef } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import Img from "@/components/ui/Img";
import LuxButton from "@/components/ui/LuxButton";
import { TempleBorder } from "@/components/ui/Motif";
import { gsap, useGSAP } from "@/lib/gsap";
import { SITE, whatsappLink } from "@/data/site";
import { STORY } from "@/data/products";

/**
 * SCENE 07 — Visit Shambhavi.
 * Two silk panels part like a boutique curtain to reveal the invitation;
 * the temple border draws itself as the story closes.
 */
export default function SceneVisit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "top top", scrub: 1 },
      });
      tl.fromTo(".visit__curtain--l", { xPercent: 0 }, { xPercent: -101 }, 0)
        .fromTo(".visit__curtain--r", { xPercent: 0 }, { xPercent: 101 }, 0)
        .fromTo(".visit__bg img", { scale: 1.3 }, { scale: 1 }, 0)
        .from(".visit .motif path", { strokeDashoffset: 1, stagger: 0.1 }, 0.3);
      gsap.from(".visit__content > *", {
        y: 50, opacity: 0, stagger: 0.08, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".visit__content", start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  const msg = "Hello Shambhavi Silks! I'd like to visit the boutique. When can I come by?";
  return (
    <section ref={root} className="visit" aria-labelledby="visit-title">
      <div className="visit__bg" aria-hidden="true">
        <Img id={STORY.silkTeal} alt="" sizes="100vw" />
      </div>
      <div className="visit__curtain visit__curtain--l" aria-hidden="true"><Img id={STORY.silkRed} alt="" sizes="50vw" /></div>
      <div className="visit__curtain visit__curtain--r" aria-hidden="true"><Img id={STORY.silkRed} alt="" sizes="50vw" /></div>

      <div className="visit__content container">
        <p className="eyebrow eyebrow--gold">Scene 07 · Visit Shambhavi</p>
        <h2 id="visit-title">Come, <em>feel the silk.</em></h2>
        <p className="visit__lead">The best way to choose a saree is to hold it in the light. Visit the boutique in Pammam, Marthandam — call ahead and we’ll keep pieces ready for you.</p>
        <div className="visit__cards">
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="visit__card" data-cursor="hover">
            <MapPin size={18} strokeWidth={1.3} />
            <span>{SITE.address.line1}<br />{SITE.address.line2} – {SITE.address.pin}</span>
          </a>
          <a href={`tel:${SITE.phoneE164}`} className="visit__card" data-cursor="hover">
            <Phone size={18} strokeWidth={1.3} />
            <span>{SITE.phoneDisplay}<br /><small>Call to confirm timings</small></span>
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="visit__card" data-cursor="hover">
            <InstagramIcon size={18} strokeWidth={1.3} />
            <span>{SITE.instagramHandle}<br /><small>New arrivals first</small></span>
          </a>
        </div>
        <div className="visit__ctas">
          <LuxButton href={whatsappLink(msg)} external variant="light"><MessageCircle size={16} /> Book a visit on WhatsApp</LuxButton>
          <LuxButton href={SITE.mapsUrl} external variant="ghost">Get directions</LuxButton>
        </div>
        <TempleBorder className="visit__border" />
        <p className="visit__sign">being traditional is being classy</p>
      </div>
    </section>
  );
}
