"use client";

import Link from "next/link";
import Magnetic from "./Magnetic";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light";
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
};

/** Magnetic pill with a liquid fill that rises from the cursor side. */
export default function LuxButton({ href, onClick, children, variant = "solid", external, className = "", type = "button", ariaLabel, disabled }: Props) {
  const cls = `lux-btn lux-btn--${variant} ${className}`;
  const inner = (
    <>
      <span className="lux-btn__fill" aria-hidden="true" />
      <span className="lux-btn__label">{children}</span>
    </>
  );
  return (
    <Magnetic>
      {href ? (
        external ? (
          <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} data-cursor="hover">
            {inner}
          </a>
        ) : (
          <Link href={href} className={cls} aria-label={ariaLabel} data-cursor="hover">
            {inner}
          </Link>
        )
      ) : (
        <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel} data-cursor="hover" disabled={disabled}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
