import React from 'react'
import { CalendarCheck, ShieldCheck, Hammer, MessagesSquare, TrendingUp } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'

const ICONS = [CalendarCheck, ShieldCheck, Hammer, MessagesSquare, TrendingUp]

export default function Commitments({ data, editable, onSelectSection }) {
  const commitments = data?.commitments?.filter(item => item.enabled) || []

  if (commitments.length === 0 && !editable) return null

  return (
    <Section
      className={`bg-[var(--color-primary)] ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('COMMITMENTS') } }}
      dataCmsSection="COMMITMENTS"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Commitments
        </div>
      )}

      <Reveal>
        <SectionHeading eyebrow="Our commitments" title="What you can hold us to" tone="dark" />
      </Reveal>

      <div className="mt-12 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
        {commitments.map((c, i) => {
          const Icon = ICONS[i % ICONS.length]
          return (
            <Reveal key={c.id} delay={i * 70} className="h-full">
              <article className="h-full bg-[var(--color-primary)] p-8">
                <Icon className="size-8 text-[var(--color-accent)]" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold uppercase text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-white/70">{c.description}</p>
              </article>
            </Reveal>
          )
        })}
        <div className="hidden bg-[var(--color-accent)] p-8 lg:block">
          <p className="font-display text-2xl font-bold uppercase leading-tight text-[var(--color-primary)]">
            Ready to brief us on your next project?
          </p>
          <a
            href="#contact"
            className="mt-5 inline-block border-2 border-[var(--color-primary)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)]"
          >
            Talk to us
          </a>
        </div>
      </div>
    </Section>
  )
}
