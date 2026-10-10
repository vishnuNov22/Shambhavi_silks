/**
 * Route wrapper: a short, clean fade (styles/base.css → .route-content).
 * Product card → product page navigations use the View Transitions API
 * instead (see components/shop/ProductCard.tsx), so the photograph itself
 * travels into the detail view.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-content">{children}</div>;
}
