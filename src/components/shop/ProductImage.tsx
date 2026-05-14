"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
  imageClassName?: string;
};

export default function ProductImage({
  src,
  alt,
  emoji,
  className = "",
  imageClassName = "",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-50 ${className}`}
      >
        <span className="text-6xl">{emoji}</span>
      </div>
    );
  }

  return (
    <div className={`relative bg-white ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 300px"
        className={`object-cover  ${imageClassName}`}
        onError={() => setHasError(true)}
      />
    </div>
  );
}