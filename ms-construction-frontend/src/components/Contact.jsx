import React, { useState } from 'react'
import { MapPin, Mail, Phone, MessageCircle, CheckCircle2, User } from 'lucide-react'
import { submitQuery } from '../api/client'
import { Section, SectionHeading } from './Section'
import { Reveal } from './Reveal'

const MAX = { name: 100, email: 255, phone: 20, message: 1000 }

export default function Contact({ data, editable, onSelectSection }) {
  const companyInfo = data?.company || {}
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })

  const tel = (companyInfo.phonePrimary || '').replace(/\s/g, '')
  const wa = (companyInfo.whatsappNumber || companyInfo.phonePrimary || '').replace(/\D/g, '')

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    else if (form.name.length > MAX.name) e.name = 'Name is too long.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email.'
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number.'
    if (form.message.trim().length < 10) e.message = 'Please add a few more details.'
    else if (form.message.length > MAX.message) e.message = 'Message is too long.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setSubmitting(true)
    setStatus({ type: '', msg: '' })
    try {
      await submitQuery(form)
      setStatus({ type: 'success', msg: 'Thank you — your query has been received. Our team will contact you shortly.' })
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again later.' })
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'w-full border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)]'

  return (
    <Section
      id="contact"
      className={editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('CONTACT') } }}
      dataCmsSection="CONTACT"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Contact
        </div>
      )}

      <Reveal>
        <SectionHeading
          eyebrow="Get in touch"
          title="Ask a question or request a quote"
          description="Specialist in all types of building construction. Send us your requirement — we respond the same working day."
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="space-y-4">
            <div className="surface-panel p-6">
              <h3 className="text-lg font-bold uppercase text-[var(--color-heading)]">Contact details</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                  <span className="text-[var(--color-text)] opacity-80">{companyInfo.address}</span>
                </li>
                {companyInfo.ownerName && (
                  <li className="flex gap-3">
                    <User className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                    <span className="text-[var(--color-text)] opacity-80">{companyInfo.ownerName}</span>
                  </li>
                )}
                {companyInfo.email && (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                    <a href={`mailto:${companyInfo.email}`} className="text-[var(--color-heading)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline">
                      {companyInfo.email}
                    </a>
                  </li>
                )}
                {companyInfo.phonePrimary && (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                    <span className="text-[var(--color-heading)]">
                      <a href={`tel:${tel}`} className="hover:text-[var(--color-accent)]">{companyInfo.phonePrimary}</a>
                      {companyInfo.phoneSecondary && (
                        <>
                          {' / '}
                          <a href={`tel:${companyInfo.phoneSecondary.replace(/\s/g, '')}`} className="hover:text-[var(--color-accent)]">
                            {companyInfo.phoneSecondary}
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                )}
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a href={`tel:${tel}`} className="flex items-center justify-center gap-2 bg-[var(--color-primary)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:opacity-90">
                  <Phone className="size-4" aria-hidden="true" /> Call now
                </a>
                <a href={`mailto:${companyInfo.email || ''}`} className="flex items-center justify-center gap-2 bg-[var(--color-primary)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:opacity-90">
                  <Mail className="size-4" aria-hidden="true" /> Email us
                </a>
                {wa && (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[var(--color-accent)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)] transition-transform hover:-translate-y-0.5">
                    <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {companyInfo.googleMapsQuery && (
              <div className="surface-panel overflow-hidden">
                <iframe
                  title="MS Construction office location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(companyInfo.googleMapsQuery)}&output=embed`}
                  loading="lazy"
                  className="h-64 w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} noValidate className="surface-panel space-y-5 p-6 sm:p-8">
            <h3 className="text-lg font-bold uppercase text-[var(--color-heading)]">Send your query</h3>

            {status.msg && (
              <p
                role="status"
                className={`flex items-center gap-2 border-l-4 px-4 py-3 text-sm font-medium ${
                  status.type === 'success'
                    ? 'border-[var(--color-accent)] bg-[var(--color-concrete,#f4f4f2)] text-[var(--color-heading)]'
                    : 'border-red-500 bg-red-50 text-red-800'
                }`}
              >
                {status.type === 'success' && <CheckCircle2 className="size-5 text-[var(--color-accent)]" aria-hidden="true" />}
                {status.msg}
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">Name</label>
                <input
                  id="name"
                  maxLength={MAX.name}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">Phone</label>
                <input
                  id="phone"
                  maxLength={MAX.phone}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={field}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">Email (optional)</label>
              <input
                id="email"
                type="email"
                maxLength={MAX.email}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">Your requirement</label>
              <textarea
                id="message"
                rows={5}
                maxLength={MAX.message}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={field}
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--color-accent)] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent)] disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Submit query'}
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
