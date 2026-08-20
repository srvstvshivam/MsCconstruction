import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { getPublicTeam } from '../api/client'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Reveal } from '../components/Reveal'
import { ImageWithFallback } from '../components/ImageWithFallback'

export default function Team({ draftData, editable, onSelectSection }) {
  const { siteData: liveData } = useSite()
  const siteData = draftData || liveData
  const [team, setTeam] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (draftData) {
      setTeam(draftData.team || [])
      setError(false)
    } else {
      getPublicTeam()
        .then(setTeam)
        .catch(() => setError(true))
    }
  }, [draftData])

  return (
    <div className={`min-h-screen bg-[var(--color-concrete,#f4f4f2)] ${editable ? 'select-none' : ''}`}>
      <Navbar data={siteData} editable={editable} onSelectSection={onSelectSection} embedded={!!draftData} />

      <div className="mx-auto max-w-6xl px-5 pt-32 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>

        <div className="mt-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">Our People</p>
          <h1 className="accent-rule mt-3 text-3xl font-bold uppercase text-[var(--color-heading)] sm:text-4xl">
            Meet Our Team
          </h1>
          <p className="mt-4 text-base text-[var(--color-text)] opacity-90">
            The engineers, supervisors, and specialists who deliver every project on site.
          </p>
        </div>

        {error && (
          <p className="mt-10 text-sm text-[var(--color-text)] opacity-70">
            We couldn't load the team right now. Please try again shortly.
          </p>
        )}

        {team && team.length === 0 && !error && (
          <p className="mt-10 text-sm text-[var(--color-text)] opacity-70">
            Team profiles are coming soon.
          </p>
        )}

        {team && team.length > 0 && (
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 60}>
                <article className="surface-panel h-full flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-6 sm:p-8 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 gap-6 sm:gap-8">
                  <div className="w-40 h-40 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md ring-4 ring-[var(--color-primary)]/5">
                    {member.photoUrl ? (
                      <img 
                        src={member.photoUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onError={(e) => { e.target.onerror = null; e.target.src = '/avatar-placeholder.png' }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-slate-100 text-slate-400 transition-transform duration-500 group-hover:scale-110">
                        <User className="size-16" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col w-full sm:pt-2">
                    <h3 className="text-xl font-bold text-[var(--color-heading)]">{member.name}</h3>
                    {member.role && (
                      <p className="text-xs font-bold tracking-widest text-[var(--color-accent)] mt-2">{member.role}</p>
                    )}
                    {member.bio && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/10 flex-1">
                        <p className="text-sm text-[var(--color-text)] opacity-85 leading-relaxed">{member.bio}</p>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Footer data={siteData} editable={editable} onSelectSection={onSelectSection} />
    </div>
  )
}
