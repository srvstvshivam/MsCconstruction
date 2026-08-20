import React from 'react'
import { Link } from 'react-router-dom'
import { HardHat, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import logoFallback from '../assets/logo-emblem.png'

const quickLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer({ data, editable, onSelectSection }) {
  const companyInfo = data?.company || {}

  return (
    <footer
      className={`bg-[var(--color-steel,#1d2c4a)] text-white/70 relative ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''}`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('FOOTER') } }}
      data-cms-section="FOOTER"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Footer
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={companyInfo.logoUrl || logoFallback}
              alt={companyInfo.companyName || 'MS Construction'}
              className="h-11 w-auto"
              onError={(e) => { if (e.target.src !== logoFallback) { e.target.onerror = null; e.target.src = logoFallback } }}
            />
            <span className="font-display text-xl font-bold uppercase text-white">
              {companyInfo.companyName || 'MS Construction'}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm">
            {companyInfo.footerDescription ||
              'Mangal & Sons Building Contractor — turnkey residential, commercial, and industrial construction across Delhi/NCR.'}
          </p>
          {companyInfo.ownerName && (
            <div className="mt-4 text-sm">
              <span className="text-[var(--color-accent)] font-semibold">Owner: </span>
              {companyInfo.ownerName}
            </div>
          )}
          {(companyInfo.facebookUrl || companyInfo.instagramUrl || companyInfo.linkedinUrl || companyInfo.twitterUrl) && (
            <div className="mt-5 flex gap-3">
              {companyInfo.facebookUrl && (
                <a href={companyInfo.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                  <Facebook className="size-4" />
                </a>
              )}
              {companyInfo.instagramUrl && (
                <a href={companyInfo.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                  <Instagram className="size-4" />
                </a>
              )}
              {companyInfo.linkedinUrl && (
                <a href={companyInfo.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                  <Linkedin className="size-4" />
                </a>
              )}
              {companyInfo.twitterUrl && (
                <a href={companyInfo.twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter" className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                  <Twitter className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-[var(--color-accent)]">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">Contact</h2>
          <address className="mt-4 space-y-2 text-sm not-italic">
            <p>{companyInfo.address}</p>
            {companyInfo.email && (
              <p>
                <a href={`mailto:${companyInfo.email}`} className="hover:text-[var(--color-accent)]">{companyInfo.email}</a>
              </p>
            )}
            <p>
              {companyInfo.phonePrimary}
              {companyInfo.phoneSecondary ? ` / ${companyInfo.phoneSecondary}` : ''}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {companyInfo.companyName || 'Mangal & Sons Building Contractor'}.{' '}
            {companyInfo.copyrightText || 'All rights reserved.'}
          </p>
          <Link to="/admin/login" className="hover:text-[var(--color-accent)]">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  )
}
