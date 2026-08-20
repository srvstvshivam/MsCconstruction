import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Users, Gauge, Quote, ArrowRight } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'
import aboutImgFallback from '../assets/gallery-structure.jpg'

const strengths = [
  { icon: Users, title: 'Expert Team', body: 'Engineers, architects, and certified professionals with deep site experience.' },
  { icon: Gauge, title: 'Modern Methods', body: 'Advanced construction technologies and disciplined project management tools.' },
  { icon: Building2, title: 'Proven Delivery', body: 'A track record of on-time, within-budget handover across sectors.' },
]

export default function About({ data, editable, onSelectSection }) {
  const companyInfo = data?.company || {}

  if (!companyInfo.aboutText && !editable) return null

  return (
    <Section
      id="about"
      className={editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('ABOUT') } }}
      dataCmsSection="ABOUT"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit About
        </div>
      )}

      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <SectionHeading eyebrow="Who we are" title="Contractors corporates trust" />
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-text)] opacity-90">
            {companyInfo.aboutText}
          </p>

          <div className="mt-8 aspect-[16/9] overflow-hidden">
            <img
              src={companyInfo.aboutImageUrl || aboutImgFallback}
              onError={(e) => { if (e.target.src !== aboutImgFallback) { e.target.onerror = null; e.target.src = aboutImgFallback } }}
              alt={companyInfo.aboutImageCaption || 'About Us'}
              className="w-full h-full object-cover"
            />
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              'Residential, Commercial & Industrial Construction',
              'Turnkey Project Execution',
              'Infrastructure Development',
              'Transparent, client-centric communication',
            ].map((item) => (
              <li
                key={item}
                className="border-l-2 border-[var(--color-accent)] bg-[var(--color-concrete,#f4f4f2)] px-4 py-3 text-sm font-medium text-[var(--color-heading)]"
              >
                {item}
              </li>
            ))}
          </ul>

          {companyInfo.teamButtonText && (
            <Link
              to="/team"
              className="mt-6 inline-flex items-center gap-2 border-2 border-[var(--color-primary)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              {companyInfo.teamButtonText}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </Reveal>

        <div className="space-y-5">
          {strengths.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <article className="surface-panel flex gap-4 p-6">
                <span className="grid size-12 shrink-0 place-items-center bg-[var(--color-primary)] text-[var(--color-accent)]">
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold uppercase text-[var(--color-heading)]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text)] opacity-80">{s.body}</p>
                </div>
              </article>
            </Reveal>
          ))}

          {companyInfo.motto && (
            <Reveal delay={300}>
              <blockquote className="bg-[var(--color-primary)] p-7 text-white">
                <Quote className="size-7 text-[var(--color-accent)]" aria-hidden="true" />
                <p className="mt-3 font-display text-xl leading-snug">{companyInfo.motto}</p>
                <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-white/60">
                  Our motto
                </footer>
              </blockquote>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
