import React from 'react'
import { Home, Store, Factory } from 'lucide-react'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'

const sectorTypes = [
  { icon: Home, title: 'Residential', body: 'All sorts of residential projects, from low-rise developments to high-rise towers.' },
  { icon: Store, title: 'Commercial', body: 'Office buildings, retail spaces, malls, and mixed-use commercial developments.' },
  { icon: Factory, title: 'Industrial', body: 'Hospitals, metro infrastructure, industrial buildings, and institutional campuses.' },
]

export default function Portfolio({ data, editable, onSelectSection }) {
  const projects = data?.projects?.filter(p => p.enabled !== false) || []

  if (projects.length === 0 && !editable) return null

  const running = projects.filter(p => p.status === 'RUNNING')
  const completed = projects.filter(p => p.status === 'COMPLETED')

  return (
    <Section
      id="portfolio"
      className={`bg-[var(--color-concrete,#f4f4f2)] ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('PORTFOLIO') } }}
      dataCmsSection="PORTFOLIO"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Portfolio
        </div>
      )}

      <Reveal>
        <SectionHeading
          eyebrow="Project portfolio"
          title="Sectors we deliver in"
          description="A single contractor for the full spectrum — housing, commercial fit-outs, and heavy industrial works."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {sectorTypes.map((t, i) => (
          <Reveal key={t.title} delay={i * 90}>
            <article className="group relative h-full overflow-hidden bg-[var(--color-primary)] p-8 text-white">
              <span className="absolute -right-6 -top-6 size-28 bg-[var(--color-accent)]/10 transition-transform group-hover:scale-150" />
              <t.icon className="size-9 text-[var(--color-accent)]" aria-hidden="true" />
              <h3 className="mt-6 text-2xl font-bold uppercase">{t.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{t.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {running.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <SectionHeading eyebrow="In progress" title="Running projects" />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {running.map((p) => (
              <article key={p.id} className="surface-panel p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">
                  <span className="size-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  {p.sector}
                </div>
                <h3 className="mt-3 text-lg font-bold uppercase text-[var(--color-heading)]">{p.clientName}</h3>
                <p className="text-sm text-[var(--color-text)] opacity-80">{p.location}</p>
                <p className="mt-2 inline-block bg-[var(--color-accent)] px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
                  ₹{p.valueCr} Cr
                </p>
                <p className="mt-3 text-sm text-[var(--color-text)] opacity-80">{p.scopeOfWork}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <>
          <Reveal>
            <div className="mt-16">
              <SectionHeading
                eyebrow="Track record"
                title="Completed civil works"
                description="Selected flagship contracts delivered for industrial groups, institutions, and railways."
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 hidden overflow-hidden border border-[var(--color-border)] bg-white md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Completed civil works by MS Construction</caption>
                <thead className="bg-[var(--color-primary)] text-white">
                  <tr>
                    {['Client', 'Location', 'Project Value', 'Scope of Work'].map((h) => (
                      <th key={h} scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completed.map((p) => (
                    <tr key={p.id} className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-concrete,#f4f4f2)]">
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--color-heading)]">{p.clientName}</th>
                      <td className="px-5 py-4 text-[var(--color-text)] opacity-80">{p.location}</td>
                      <td className="px-5 py-4 font-bold text-[var(--color-heading)]">₹{p.valueCr} Cr</td>
                      <td className="px-5 py-4 text-[var(--color-text)] opacity-80">{p.scopeOfWork}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:hidden">
            {completed.map((p) => (
              <article key={p.id} className="surface-panel p-5">
                <h3 className="text-lg font-bold uppercase text-[var(--color-heading)]">{p.clientName}</h3>
                <p className="text-sm text-[var(--color-text)] opacity-80">{p.location}</p>
                <p className="mt-2 inline-block bg-[var(--color-accent)] px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
                  ₹{p.valueCr} Cr
                </p>
                <p className="mt-3 text-sm text-[var(--color-text)] opacity-80">{p.scopeOfWork}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
