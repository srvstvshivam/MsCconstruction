import React from 'react'
import { Mountain, Route, Layers, PlugZap, PaintRoller, Brush, Wrench } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'

const ICONS = {
  grading: Mountain,
  road: Route,
  foundation: Layers,
  electrical: PlugZap,
  facade: PaintRoller,
  painting: Brush,
}

export default function Services({ data, editable, onSelectSection }) {
  const services = data?.services?.filter(s => s.enabled !== false) || []

  if (services.length === 0 && !editable) return null

  return (
    <Section
      id="services"
      className={`bg-[var(--color-concrete,#f4f4f2)] ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('SERVICES') } }}
      dataCmsSection="SERVICES"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Services
        </div>
      )}

      <Reveal>
        <SectionHeading
          eyebrow="What we build"
          title="Our services"
          description="Specialist crews and supervision for every stage of the build — from raw ground to final coat."
        />
      </Reveal>

      <div className="mt-12 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon] || Wrench
          return (
            <Reveal key={service.id} delay={i * 60}>
              <article className="group h-full bg-white p-8 transition-colors hover:bg-[var(--color-primary)]">
                <Icon className="size-8 text-[var(--color-accent)] transition-transform group-hover:scale-110" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold uppercase text-[var(--color-heading)] transition-colors group-hover:text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text)] opacity-80 transition-colors group-hover:text-white/70">
                  {service.description}
                </p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
