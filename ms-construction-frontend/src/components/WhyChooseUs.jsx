import React from 'react'
import { Award, Clock, IndianRupee, BadgeCheck } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'

const ICONS = {
  competence: Award,
  punctuality: Clock,
  cost: IndianRupee,
  quality: BadgeCheck,
}

export default function WhyChooseUs({ data, editable, onSelectSection }) {
  const items = data?.whyChooseUs?.filter(item => item.enabled) || []

  if (items.length === 0 && !editable) return null

  return (
    <Section
      className={`bg-white ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('WHY_CHOOSE_US') } }}
      dataCmsSection="WHY_CHOOSE_US"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Why Choose Us
        </div>
      )}

      <Reveal>
        <SectionHeading
          eyebrow="Why choose us"
          title="Reasons clients come back"
          description="Institutional and industrial clients hire us because the site runs the way the schedule says it will."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon] || BadgeCheck
          return (
            <Reveal key={item.id} delay={i * 80}>
              <article className="surface-panel h-full p-7 transition-transform hover:-translate-y-1">
                <span className="grid size-12 place-items-center bg-[var(--color-accent)] text-[var(--color-primary)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold uppercase text-[var(--color-heading)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)] opacity-80">{item.description}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
