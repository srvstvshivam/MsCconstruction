import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSite } from '../context/SiteContext'
import { useNavigate } from 'react-router-dom'
import Home from './Home'
import Team from './Team'
import {
  updateTheme, updateHero, updateCompanyInfo,
  createStatistic, updateStatistic, deleteStatistic,
  createWhyChoose, updateWhyChoose, deleteWhyChoose,
  createCommitment, updateCommitment, deleteCommitment,
  createNavigation, updateNavigation, deleteNavigation,
  createService, updateService, deleteService,
  createProject, updateProject, deleteProject,
  addGalleryImage, updateGalleryImage, deleteGalleryImage,
  createTeamMember, updateTeamMember, deleteTeamMember,
  getDraft, saveDraft, clearDraft,
} from '../api/client'
import ThemeEditor from '../components/editor/ThemeEditor'
import NavbarEditor from '../components/editor/NavbarEditor'
import HeroEditor from '../components/editor/HeroEditor'
import AboutEditor from '../components/editor/AboutEditor'
import ServicesEditor from '../components/editor/ServicesEditor'
import PortfolioEditor from '../components/editor/PortfolioEditor'
import GalleryEditor from '../components/editor/GalleryEditor'
import FooterEditor from '../components/editor/FooterEditor'
import ContactEditor from '../components/editor/ContactEditor'
import StatisticsEditor from '../components/editor/StatisticsEditor'
import WhyChooseUsEditor from '../components/editor/WhyChooseUsEditor'
import CommitmentsEditor from '../components/editor/CommitmentsEditor'
import TeamEditor from '../components/editor/TeamEditor'

// A locally-created (not-yet-saved) list item is tagged with a temp id like 'new-172839...'
const isTempId = (id) => typeof id === 'string' && id.startsWith('new-')

/**
 * Reconciles one list-type collection (e.g. services, gallery) between what was
 * originally published (`original`) and what's in the draft now (`current`):
 *  - items with a temp id are newly added in the editor -> create
 *  - items whose real id existed originally but is gone from current -> delete
 *  - everything else that changed -> update
 * This is what makes "Add New" / "Delete" in the visual editor actually persist.
 */
async function syncCollection(token, original, current, { create, update, remove }) {
  const originalIds = new Set((original || []).map(i => i.id))
  const currentRealIds = new Set((current || []).filter(i => !isTempId(i.id)).map(i => i.id))

  const removed = [...originalIds].filter(id => !currentRealIds.has(id))
  for (const id of removed) {
    await remove(token, id)
  }

  for (const item of current || []) {
    if (isTempId(item.id)) {
      const { id, ...payload } = item
      await create(token, payload)
    } else {
      await update(token, item.id, item)
    }
  }
}

export default function VisualEditor() {
  const { siteData, refreshSiteData } = useSite()
  const navigate = useNavigate()
  const [draftState, setDraftState] = useState(null)
  const [publishedSnapshot, setPublishedSnapshot] = useState(null)
  const [lastSavedDraft, setLastSavedDraft] = useState(null) // what's currently persisted in the draft store
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedSection, setSelectedSection] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [previewPage, setPreviewPage] = useState('/')
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | publishing | published | error
  const [exitConfirm, setExitConfirm] = useState(false)
  const token = localStorage.getItem('ms_admin_token')
  const previewRef = useRef(null)
  const autosaveTimer = useRef(null)

  // Load: prefer an existing draft (work in progress); otherwise start from the published site.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let initial = siteData ? JSON.parse(JSON.stringify(siteData)) : {}
      try {
        const { getAdminSiteData } = await import('../api/client')
        initial = await getAdminSiteData(token)
      } catch (err) {
        console.warn('Could not fetch admin site data, falling back to public data', err)
      }
      
      try {
        console.log('[VisualEditor] Fetching draft with token:', token ? 'Token exists' : 'Token MISSING')
        const existing = await getDraft(token)
        console.log('[VisualEditor] Successfully fetched draft')
        if (existing?.content && !cancelled) {
          initial = existing.content
        }
      } catch (err) {
        console.error('[VisualEditor] Error fetching draft:', err)
        console.warn('No existing draft, starting from published site.', err)
      }
      if (cancelled) return
      setDraftState(initial)
      setLastSavedDraft(JSON.parse(JSON.stringify(initial)))
      setPublishedSnapshot(JSON.parse(JSON.stringify(initial)))
      setHistory([initial])
      setHistoryIndex(0)
    })()
    return () => { cancelled = true }
  }, [])

  // Apply theme live preview
  useEffect(() => {
    if (!draftState?.theme) return
    const root = document.documentElement
    const t = draftState.theme
    if (t.primaryColor) root.style.setProperty('--color-primary', t.primaryColor)
    if (t.secondaryColor) root.style.setProperty('--color-secondary', t.secondaryColor)
    if (t.accentColor) root.style.setProperty('--color-accent', t.accentColor)
    if (t.backgroundColor) root.style.setProperty('--color-background', t.backgroundColor)
    if (t.textColor) root.style.setProperty('--color-text', t.textColor)
    if (t.headingColor) root.style.setProperty('--color-heading', t.headingColor)
    if (t.buttonColor) root.style.setProperty('--color-button', t.buttonColor)
  }, [draftState?.theme])

  // Sidebar/preview-click selection sync: whenever the selected section changes,
  // scroll the preview pane to that section so all three panes always agree.
  useEffect(() => {
    if (!selectedSection || !previewRef.current) return
    const el = previewRef.current.querySelector(`[data-cms-section="${selectedSection}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedSection])

  const hasUnsavedChanges = JSON.stringify(draftState) !== JSON.stringify(lastSavedDraft)
  const hasUnpublishedChanges = JSON.stringify(draftState) !== JSON.stringify(publishedSnapshot)

  const saveDraftNow = useCallback(async (state) => {
    if (!state) return
    setSaveStatus('saving')
    try {
      await saveDraft(token, state)
      setLastSavedDraft(JSON.parse(JSON.stringify(state)))
      setSaveStatus('saved')
    } catch (err) {
      console.error(err)
      setSaveStatus('error')
    }
  }, [token])

  // Debounced autosave: never publishes, just keeps the draft store current so
  // work isn't lost on refresh/re-login. Skips the very first load (nothing changed yet).
  useEffect(() => {
    if (!draftState || !hasUnsavedChanges) return
    setSaveStatus('idle')
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => saveDraftNow(draftState), 1500)
    return () => clearTimeout(autosaveTimer.current)
  }, [draftState])

  const updateDraft = (updater) => {
    setDraftState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(next)))
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      
      return next
    })
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setDraftState(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setDraftState(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  const publishSite = async () => {
    setSaveStatus('publishing')
    try {
      if (draftState.theme) await updateTheme(token, draftState.theme)
      if (draftState.hero) await updateHero(token, draftState.hero)
      if (draftState.company) await updateCompanyInfo(token, draftState.company)

      await syncCollection(token, publishedSnapshot?.statistics, draftState.statistics, { create: createStatistic, update: updateStatistic, remove: deleteStatistic })
      await syncCollection(token, publishedSnapshot?.whyChooseUs, draftState.whyChooseUs, { create: createWhyChoose, update: updateWhyChoose, remove: deleteWhyChoose })
      await syncCollection(token, publishedSnapshot?.commitments, draftState.commitments, { create: createCommitment, update: updateCommitment, remove: deleteCommitment })
      await syncCollection(token, publishedSnapshot?.navigation, draftState.navigation, { create: createNavigation, update: updateNavigation, remove: deleteNavigation })
      await syncCollection(token, publishedSnapshot?.services, draftState.services, { create: createService, update: updateService, remove: deleteService })
      await syncCollection(token, publishedSnapshot?.projects, draftState.projects, { create: createProject, update: updateProject, remove: deleteProject })
      await syncCollection(token, publishedSnapshot?.gallery, draftState.gallery, { create: addGalleryImage, update: updateGalleryImage, remove: deleteGalleryImage })
      await syncCollection(token, publishedSnapshot?.team, draftState.team, { create: createTeamMember, update: updateTeamMember, remove: deleteTeamMember })

      // The draft has now been fully applied to the live site — clear it so a stale
      // draft never lingers and re-appears on the admin's next visit.
      await clearDraft(token).catch(() => {})
      
      // Await refreshSiteData to trigger a background update of SiteContext,
      // but also manually fetch the latest ADMIN data to immediately update our editor state.
      await refreshSiteData()
      
      import('../api/client').then(async ({ getAdminSiteData }) => {
        const freshData = await getAdminSiteData(token)
        const newSnapshot = JSON.parse(JSON.stringify(freshData))
        
        setPublishedSnapshot(newSnapshot)
        setDraftState(newSnapshot)
        setLastSavedDraft(newSnapshot)
        setHistory([newSnapshot])
        setHistoryIndex(0)
        setSaveStatus('published')
      })
    } catch (err) {
      console.error(err)
      setSaveStatus('error')
      alert('Publish failed. Your changes are still saved as a draft — nothing was lost.')
    }
  }

  const exitEditor = () => {
    if (hasUnsavedChanges) {
      setExitConfirm(true)
    } else {
      navigate('/admin/dashboard')
    }
  }

  const saveStatusLabel = {
    idle: 'Unsaved changes',
    saving: 'Saving draft…',
    saved: 'Draft saved',
    publishing: 'Publishing…',
    published: 'Published',
    error: 'Save failed',
  }[saveStatus]

  if (!draftState) return <div className="p-8 text-center text-slate-500">Loading editor...</div>

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200">

      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 z-[100] relative">
        <div className="flex items-center gap-4">
          <button onClick={exitEditor} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            &larr; Exit Editor
          </button>
          <div className="h-4 w-px bg-slate-700 mx-2"></div>
          <button onClick={undo} disabled={historyIndex <= 0} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-semibold transition-colors">
            Undo
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-semibold transition-colors">
            Redo
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 rounded p-1">
          <button onClick={() => setPreviewMode('desktop')} className={`px-3 py-1 text-xs font-semibold rounded ${previewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Desktop</button>
          <button onClick={() => setPreviewMode('tablet')} className={`px-3 py-1 text-xs font-semibold rounded ${previewMode === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Tablet</button>
          <button onClick={() => setPreviewMode('mobile')} className={`px-3 py-1 text-xs font-semibold rounded ${previewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Mobile</button>
        </div>

        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden lg:inline">
            View Live Site ↗
          </a>
          <a href="/admin/dashboard" target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden lg:inline">
            Enquiries &amp; History ↗
          </a>
          <span className={`text-xs font-medium hidden sm:inline ${saveStatus === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
            {saveStatusLabel}
          </span>
          <button
            onClick={() => saveDraftNow(draftState)}
            disabled={saveStatus === 'saving' || !hasUnsavedChanges}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={publishSite}
            disabled={saveStatus === 'publishing' || !hasUnpublishedChanges}
            className="px-6 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold rounded shadow-sm text-sm transition-colors"
          >
            {saveStatus === 'publishing' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 font-bold text-sm text-slate-400 uppercase tracking-wider border-b border-slate-700">Sections</div>
          <div className="p-2 space-y-1">
            {[
              { id: 'THEME', label: 'Colors & Theme' },
              { id: 'NAVBAR', label: 'Logo & Menu' },
              { id: 'HERO', label: 'Homepage Top Section' },
              { id: 'STATISTICS', label: 'Company Numbers' },
              { id: 'ABOUT', label: 'About Us' },
              { id: 'TEAM', label: 'Our Team' },
              { id: 'WHY_CHOOSE_US', label: 'Why Choose Us' },
              { id: 'SERVICES', label: 'Services' },
              { id: 'PORTFOLIO', label: 'Projects' },
              { id: 'COMMITMENTS', label: 'Our Commitments' },
              { id: 'GALLERY', label: 'Project Photos' },
              { id: 'CONTACT', label: 'Contact Details' },
              { id: 'FOOTER', label: 'Footer' },
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium transition-colors ${selectedSection === section.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-slate-950 overflow-y-auto flex justify-center p-4">
          <div
            ref={previewRef}
            onClickCapture={(e) => {
              const link = e.target.closest('a')
              if (link && link.href) {
                e.preventDefault()
                try {
                  const url = new URL(link.href)
                  const path = url.pathname
                  const hash = url.hash

                  if (path === '/team' || hash === '#team') {
                    setPreviewPage('/team')
                    setSelectedSection('TEAM')
                    e.stopPropagation()
                  } else if (hash === '#services') {
                    setPreviewPage('/')
                    setSelectedSection('SERVICES')
                    e.stopPropagation()
                  } else if (hash === '#portfolio' || hash === '#gallery') {
                    setPreviewPage('/')
                    setSelectedSection('GALLERY')
                    e.stopPropagation()
                  } else if (hash === '#about') {
                    setPreviewPage('/')
                    setSelectedSection('ABOUT')
                    e.stopPropagation()
                  } else if (hash === '#contact') {
                    setPreviewPage('/')
                    setSelectedSection('CONTACT')
                    e.stopPropagation()
                  } else if (path === '/') {
                    setPreviewPage('/')
                    setSelectedSection('NAVBAR')
                    e.stopPropagation()
                  }
                } catch (err) {
                  // Ignore invalid URLs
                }
              }
            }}
            className={`bg-white h-full w-full shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out ${
              previewMode === 'mobile' ? 'max-w-[375px]' :
              previewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-full'
            }`}
          >
             {previewPage === '/team' ? (
               <Team draftData={draftState} editable={true} onSelectSection={setSelectedSection} />
             ) : (
               <Home draftData={draftState} editable={true} onSelectSection={setSelectedSection} />
             )}
          </div>
        </main>

        <aside className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col shrink-0 overflow-y-auto">
          {selectedSection ? (
             <div className="p-6">
                {selectedSection === 'THEME' && <ThemeEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'NAVBAR' && <NavbarEditor draft={draftState} updateDraft={updateDraft} token={token} />}
                {selectedSection === 'HERO' && <HeroEditor draft={draftState} updateDraft={updateDraft} token={token} />}
                {selectedSection === 'STATISTICS' && <StatisticsEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'ABOUT' && <AboutEditor draft={draftState} updateDraft={updateDraft} token={token} />}
                {selectedSection === 'TEAM' && <TeamEditor draft={draftState} updateDraft={updateDraft} token={token} />}
                {selectedSection === 'WHY_CHOOSE_US' && <WhyChooseUsEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'SERVICES' && <ServicesEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'PORTFOLIO' && <PortfolioEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'GALLERY' && <GalleryEditor draft={draftState} updateDraft={updateDraft} token={token} />}
                {selectedSection === 'COMMITMENTS' && <CommitmentsEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'CONTACT' && <ContactEditor draft={draftState} updateDraft={updateDraft} />}
                {selectedSection === 'FOOTER' && <FooterEditor draft={draftState} updateDraft={updateDraft} />}
             </div>
          ) : (
             <div className="p-8 text-center text-slate-500 text-sm mt-10">
               Select a section from the website or the left sidebar to edit it.
             </div>
          )}
        </aside>

      </div>

      {exitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-white font-bold text-lg">You have unsaved changes</h3>
            <p className="text-slate-400 text-sm mt-2">
              Save your changes as a draft before leaving, or discard them.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={async () => { await saveDraftNow(draftState); setExitConfirm(false); navigate('/admin/dashboard') }}
                className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded text-sm transition-colors"
              >
                Save Draft &amp; Exit
              </button>
              <button
                onClick={() => { setExitConfirm(false); navigate('/admin/dashboard') }}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold rounded text-sm transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setExitConfirm(false)}
                className="w-full px-4 py-2 text-slate-400 hover:text-white font-medium rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
