import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Renders an image, but swaps to a subtle icon placeholder on load failure
 * instead of the browser's broken-image icon. Use for admin-uploaded content
 * (gallery, team photos) where there's no single sensible fallback photo.
 */
export function ImageWithFallback({ src, alt, className = '', fallbackAspect = 'aspect-[4/3]' }) {
  const [broken, setBroken] = useState(false)

  if (!src || broken) {
    return (
      <div className={`grid ${fallbackAspect} place-items-center bg-[var(--color-concrete,#f4f4f2)] text-[var(--color-text)]/40 ${className}`}>
        <ImageOff className="size-8" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setBroken(true)} loading="lazy" />
}
