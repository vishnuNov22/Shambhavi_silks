import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import { PRODUCTS, getProduct } from "@/data/products";
import { SITE } from "@/data/site";
import { imgUrl } from "@/lib/img";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: p.name, description: p.description, images: [imgUrl(p.images[0], 1200, 630)] },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.id,
    image: p.images.map((i) => imgUrl(i, 1200)),
    description: p.description,
    brand: { "@type": "Brand", name: SITE.name },
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, url: `${SITE.url}/product/${p.slug}` },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail slug={p.slug} />
    </>
  );
}
