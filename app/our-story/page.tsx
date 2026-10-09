import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shop/PageHero";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import LuxButton from "@/components/ui/LuxButton";
import Marquee from "@/components/ui/Marquee";
import { PaisleyMotif } from "@/components/ui/Motif";
import { STORY } from "@/data/products";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Shambhavi Silks & Handlooms — a saree, lehenga and bridal boutique in Pammam, Marthandam.",
};

/* Copy deliberately avoids unverified claims (years, awards, origins).
   Replace the [bracketed] notes with the family's own story when available. */
const CHAPTERS = [
  { k: "01", t: "Being traditional is being classy", b: "That line on our signboard is our whole philosophy. Tradition is not a costume — it is a way of carrying yourself. We look for pieces that honour it and still feel like now.", img: STORY.zari },
  { k: "02", t: "Chosen for the drape", b: "A saree is judged in motion. We choose silks for their lustre and weight, designer drapes for their colour stories, and lehengas for how the skirt moves when you walk.", img: STORY.silkRed },
  { k: "03", t: "Dressed for every ceremony", b: "From the muhurtham silk to the reception lehenga — and the family that walks in with the bride — we help put the whole wedding wardrobe together, one appointment at a time.", img: STORY.embroidery2 },
];

export default function OurStory() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="Woven into Marthandam" intro="A saree, lehenga and bridal boutique on the first floor opposite Chitra Hotel, Pammam." image={STORY.loom} />
      <section className="story container">
        <Reveal className="story__intro">
          <PaisleyMotif className="story__paisley" />
          <p data-reveal className="story__lead">
            Shambhavi Silks &amp; Handlooms is where Marthandam comes for its silk sarees, designer lehengas, Anarkali gowns
            and bridal couture. We keep the boutique intimate on purpose: so there is time to unfold a pallu by the window,
            to try the lehenga twice, and to bring your mother along.
          </p>
        </Reveal>
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.k} className={`story__ch ${i % 2 ? "is-flip" : ""}`}>
            <div data-reveal className="story__img"><Img id={c.img} alt="" ratio={1.2} sizes="(max-width: 820px) 100vw, 50vw" /></div>
            <div data-reveal className="story__text">
              <span className="story__k">{c.k}</span>
              <h2>{c.t}</h2>
              <p>{c.b}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <Marquee items={["Silk", "Zari", "Drape", "Pallu", "Lehenga", "Bridal", "Handloom"]} className="marquee--dark" />
      <section className="story-cta container">
        <h2>See it in the light.</h2>
        <p>Visit the boutique or begin on WhatsApp — we’ll share photos and hold pieces for you.</p>
        <div className="story-cta__row">
          <LuxButton href="/contact">Plan a visit</LuxButton>
          <Link href="/shop" className="text-link">Shop the collection</Link>
        </div>
      </section>
    </>
  );
}
