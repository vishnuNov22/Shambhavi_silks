import Link from "next/link";

export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`wordmark ${className}`} aria-label="Shambhavi Silks & Handlooms — home" data-cursor="hover">
      <span className="wordmark__name">Shambhavi</span>
      <span className="wordmark__sub">Silks &amp; Handlooms</span>
    </Link>
  );
}
