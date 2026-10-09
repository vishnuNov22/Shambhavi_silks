import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageHero from "@/components/shop/PageHero";
import ShopClient from "@/components/shop/ShopClient";
import { CATEGORIES, COLLECTIONS } from "@/data/products";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = COLLECTIONS.find((x) => x.slug === params.slug);
  return c ? { title: c.name, description: c.intro } : {};
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const c = COLLECTIONS.find((x) => x.slug === params.slug);
  if (!c) notFound();
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.name} intro={c.intro} image={c.cover} />
      <nav className="container coll-nav" aria-label="Other collections">
        {COLLECTIONS.map((x) => (
          <Link key={x.slug} href={`/collections/${x.slug}`} className={`chip ${x.slug === c.slug ? "is-active" : ""}`} aria-current={x.slug === c.slug ? "page" : undefined}>
            {x.name}
          </Link>
        ))}
      </nav>
      <p className="container coll-sub">Includes: {c.categories.map((k) => CATEGORIES.find((x) => x.slug === k)?.name).join(" · ")}</p>
      <Suspense fallback={<div className="container shop-loading">Loading…</div>}>
        <ShopClient lockedCategories={c.categories} />
      </Suspense>
    </>
  );
}
