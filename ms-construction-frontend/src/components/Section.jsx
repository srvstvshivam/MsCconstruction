import React from 'react'

export function SectionHeading({ eyebrow, title, description, tone = 'light' }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2
        className={`accent-rule mt-3 text-3xl font-bold uppercase sm:text-4xl ${
          tone === 'dark' ? 'text-white' : 'text-[var(--color-heading)]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === 'dark' ? 'text-white/75' : 'text-[var(--color-text)] opacity-90'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export function Section({ id, children, className = '', onClick, dataCmsSection }) {
  return (
    <section
      id={id}
      onClick={onClick}
      data-cms-section={dataCmsSection}
      className={`relative py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5">{children}</div>
    </section>
  )
}

export function EditBadge({ label }) {
  return (
    <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
      {label}
    </div>
  )
}
