import React, { useState } from 'react'
import { Menu, X, HardHat } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoFallback from '../assets/logo-emblem.png'

export default function Navbar({ data, editable, onSelectSection, embedded }) {
  const [open, setOpen] = useState(false)

  const navItems = data?.navigation?.filter(n => n.enabled) || []
  const companyInfo = data?.company || {}

  return (
    <header
      className={`${embedded ? 'sticky' : 'fixed'} inset-x-0 top-0 z-50 bg-[var(--color-primary)] backdrop-blur border-b border-white/10 shadow-lg ${editable ? 'hover:ring-4 ring-amber-400 ring-inset cursor-pointer' : ''
        }`}
      onClick={(e) => { if (editable) { e.stopPropagation(); onSelectSection('NAVBAR') } }}
      data-cms-section="NAVBAR"
    >
      {editable && (
        <div className="absolute top-2 left-2 bg-amber-500 text-navy-950 text-xs font-bold px-2 py-1 rounded z-50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Edit Navbar
        </div>
      )}

      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-3 text-white">
          <img
            src={companyInfo.logoUrl || logoFallback}
            alt={companyInfo.companyName || 'MS Construction'}
            className="h-11 w-auto"
            onError={(e) => { if (e.target.src !== logoFallback) { e.target.onerror = null; e.target.src = logoFallback } }}
          />
          {!companyInfo.logoUrl && (
            <span className="leading-tight hidden sm:inline">
              <span className="block font-display text-lg font-bold uppercase tracking-wide">
                {companyInfo.companyName || 'MS Construction'}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">
                Mangal &amp; Sons
              </span>
            </span>
          )}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isPageRoute = item.target.startsWith('/') && !item.target.includes('#')
            if (isPageRoute) {
              return (
                <Link
                  key={item.id}
                  to={item.target}
                  className="text-sm font-medium uppercase tracking-wide text-white/80 transition-colors hover:text-[var(--color-accent)]"
                >
                  {item.label}
                </Link>
              )
            }
            
            // Ensure hash links always go to the root first so they work from other pages like /team
            const href = item.target.startsWith('#') ? `/${item.target}` : item.target
            return (
              <a
                key={item.id}
                href={href}
                className="text-sm font-medium uppercase tracking-wide text-white/80 transition-colors hover:text-[var(--color-accent)]"
              >
                {item.label}
              </a>
            )
          })}
          <a
            href="#contact"
            className="bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent)]"
          >
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          onClick={(e) => { if (editable) e.stopPropagation(); setOpen((v) => !v) }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="text-white md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[var(--color-primary)] md:hidden">
          <div className="flex flex-col px-5 py-3">
            {navItems.map((item) => {
              const isPageRoute = item.target.startsWith('/') && !item.target.includes('#')
              if (isPageRoute) {
                return (
                  <Link
                    key={item.id}
                    to={item.target}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm font-medium uppercase tracking-wide text-white/85"
                  >
                    {item.label}
                  </Link>
                )
              }
              const href = item.target.startsWith('#') ? `/${item.target}` : item.target
              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium uppercase tracking-wide text-white/85"
                >
                  {item.label}
                </a>
              )
            })}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="my-3 bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  )
}