import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Services from '../components/Services.jsx'
import WhyChooseUs from '../components/WhyChooseUs.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Gallery from '../components/Gallery.jsx'
import Commitments from '../components/Commitments.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import { useSite } from '../context/SiteContext.jsx'

export default function Home({ draftData, editable, onSelectSection }) {
  const { siteData: liveData, loading, error } = useSite()
  const siteData = draftData || liveData

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text)]">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-center px-6">
        <div className="text-[var(--color-text)]">
          <p className="text-lg font-semibold mb-2">Couldn't reach the backend</p>
          <p className="opacity-70 text-sm">{error}</p>
          <p className="opacity-60 text-xs mt-4">
            Check that the Spring Boot app is running and VITE_API_BASE_URL in .env points to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar data={siteData} editable={editable} onSelectSection={onSelectSection} embedded={!!draftData} />
      <Hero data={siteData} editable={editable} onSelectSection={onSelectSection} embedded={!!draftData} />
      <About data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <Services data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <WhyChooseUs data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <Portfolio data={siteData} editable={editable} onSelectSection={onSelectSection} />
      


      <Gallery data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <Commitments data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <Contact data={siteData} editable={editable} onSelectSection={onSelectSection} />
      <Footer data={siteData} editable={editable} onSelectSection={onSelectSection} />
    </div>
  )
}
