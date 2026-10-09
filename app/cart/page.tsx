import type { Metadata } from "next";
import PageHero from "@/components/shop/PageHero";
import CartPage from "@/components/shop/CartPage";

export const metadata: Metadata = { title: "Your Bag" };

export default function Cart() {
  return (
    <>
      <PageHero eyebrow="Shopping Bag" title="Your Bag" compact />
      <CartPage />
    </>
  );
}
