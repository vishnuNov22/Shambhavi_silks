import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/shop/PageHero";
import ShopClient from "@/components/shop/ShopClient";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse silk sarees, designer sarees, bridal sarees, designer lehengas, Anarkali gowns and bridal collections.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero eyebrow="Shop All" title="The Collection" intro={`${PRODUCTS.length} pieces — filter by category, colour and price, or search for exactly what you have in mind.`} compact />
      <Suspense fallback={<div className="container shop-loading">Loading the collection…</div>}>
        <ShopClient />
      </Suspense>
    </>
  );
}
