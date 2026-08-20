import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'
import { ImageWithFallback } from './ImageWithFallback'

export default function Gallery({ data, editable, onSelectSection }) {
  const images = data?.gallery?.filter(img => img.enabled !== false) || []
  const [active, setActive] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (images.length === 0 && !editable) return null

  const current = active === null ? null : images[active]

  return (
    <Section
      id="gallery"
      className={`bg-[var(--color-primary)] text-white ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('GALLERY') } }}
      dataCmsSection="GALLERY"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Gallery
        </div>
      )}

      <Reveal>
        <SectionHeading
          eyebrow="On site"
          title="Gallery"
          description="Earthmoving, structural framing, surveying, and completed handovers. Images are managed from the admin panel."
          tone="dark"
        />
      </Reveal>

      <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <Reveal key={img.id} delay={(i % 3) * 80}>
            <button
              type="button"
              onClick={(e) => { if (!editable) { setActive(i) } }}
              className="group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label={`Open image: ${img.altText || img.caption || 'Project image'}`}
            >
              <ImageWithFallback
                src={img.url}
                alt={img.altText || img.caption || 'Project image'}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-[var(--color-primary)]/0 transition-colors group-hover:bg-[var(--color-primary)]/40" />
              {img.caption && (
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--color-primary)]/85 px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-white transition-transform group-hover:translate-y-0">
                  {img.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.altText || current.caption}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-primary)]/95 p-6"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close image"
            className="absolute right-6 top-6 text-white hover:text-[var(--color-accent)]"
          >
            <X className="size-8" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-4xl">
            <img src={current.url} alt={current.altText || current.caption} className="max-h-[75vh] w-full object-contain" />
            {current.caption && (
              <figcaption className="mt-4 text-center text-sm uppercase tracking-[0.16em] text-white/80">
                {current.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </Section>
  )
}
