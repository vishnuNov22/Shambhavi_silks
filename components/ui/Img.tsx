"use client";

import { useState } from "react";
import { imgSrcSet, imgUrl } from "@/lib/img";

type Props = {
  id: string;
  alt: string;
  sizes?: string;
  /** height / width — used for cropping on the CDN and to reserve layout space */
  ratio?: number;
  className?: string;
  priority?: boolean;
  width?: number;
  style?: React.CSSProperties;
};

/** Responsive, lazy, AVIF/WebP image with a soft blur-in once decoded. */
export default function Img({ id, alt, sizes = "100vw", ratio, className = "", priority, width = 1400, style }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={imgUrl(id, width, ratio ? Math.round(width * ratio) : undefined)}
      srcSet={imgSrcSet(id, undefined, ratio)}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`img ${loaded ? "is-loaded" : ""} ${className}`}
      style={style}
      draggable={false}
    />
  );
}
