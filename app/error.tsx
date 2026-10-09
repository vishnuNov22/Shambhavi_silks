"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container empty empty--page">
      <p className="empty__title">Something slipped.</p>
      <p>Please try again — or reach us on WhatsApp.</p>
      <button className="lux-btn lux-btn--solid" onClick={reset}><span className="lux-btn__label">Try again</span></button>
    </div>
  );
}
