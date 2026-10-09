import type { Metadata } from "next";
import PageHero from "@/components/shop/PageHero";
import WishlistPage from "@/components/shop/WishlistPage";

export const metadata: Metadata = { title: "Wishlist" };

export default function Wishlist() {
  return (
    <>
      <PageHero eyebrow="Saved Pieces" title="Wishlist" compact />
      <WishlistPage />
    </>
  );
}
