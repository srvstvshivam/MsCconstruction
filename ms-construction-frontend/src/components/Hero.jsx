import React from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Counter } from './Reveal'
import heroImgFallback from '../assets/hero-site.jpg'

const STAT_COLS = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }

export default function Hero({ data, editable, onSelectSection, embedded }) {
  const hero = data?.hero || {}
  const stats = data?.statistics?.filter(s => s.enabled) || []
  const heroImg = hero.bgImageUrl || heroImgFallback

  return (
    <section
      id="top"
      className={`relative isolate min-h-[92vh] overflow-hidden ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('HERO') } }}
      data-cms-section="HERO"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Hero
        </div>
      )}

      <img
        src={heroImg}
        onError={(e) => { if (e.target.src !== heroImgFallback) { e.target.onerror = null; e.target.src = heroImgFallback } }}
        alt="MS Construction commercial building site"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />

      <div className={`mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-16 ${embedded ? 'pt-10' : 'pt-32'}`}>
        <p className="mb-5 inline-flex w-fit items-center gap-2 border border-[var(--color-accent)]/50 bg-[var(--color-primary)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] backdrop-blur">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {hero.tagline || 'Delhi / NCR · Since decades on site'}
        </p>

        <h1 className="max-w-4xl text-4xl font-bold uppercase leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/85">
          {hero.subheadline}
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          {hero.cta1Text && (
            <a
              href={hero.cta1Link || '#contact'}
              className="group inline-flex items-center gap-2 bg-[var(--color-accent)] px-7 py-4 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent)]"
            >
              {hero.cta1Text}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
          {hero.cta2Text && (
            <a
              href={hero.cta2Link || '#portfolio'}
              className="inline-flex items-center gap-2 border border-white/40 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {hero.cta2Text}
            </a>
          )}
        </div>

        {stats.length > 0 && (
          <dl
            className={`mt-16 grid max-w-3xl grid-cols-1 gap-px border border-white/15 bg-white/15 ${STAT_COLS[Math.min(stats.length, 4)]} ${editable ? 'hover:ring-2 ring-blue-400 ring-inset cursor-pointer' : ''}`}
            onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('STATISTICS') } }}
            data-cms-section="STATISTICS"
          >
            {stats.map((stat) => (
              <div key={stat.id} className="bg-[var(--color-primary)]/70 px-6 py-6 backdrop-blur">
                <dt className="font-display text-3xl font-bold text-[var(--color-accent)]">
                  <Counter
                    to={stat.numericValue}
                    decimals={stat.decimalPrecision || 0}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
