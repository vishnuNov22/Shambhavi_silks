import LuxButton from "@/components/ui/LuxButton";

export default function NotFound() {
  return (
    <div className="container empty empty--page notfound">
      <p className="eyebrow">404</p>
      <p className="empty__title">This thread leads nowhere.</p>
      <p>The page you’re looking for has moved or no longer exists.</p>
      <LuxButton href="/shop">Return to the collection</LuxButton>
    </div>
  );
}
