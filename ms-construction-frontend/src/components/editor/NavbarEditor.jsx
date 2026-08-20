import React, { useState } from 'react'
import { EditorField, EditorHeader } from './EditorFields'
import { ImageUploadField } from './ImageUploadField'
import { uploadImage } from '../../api/client'

export default function NavbarEditor({ draft, updateDraft, token }) {
  const navItems = draft?.navigation || []
  const company = draft?.company || {}
  const [editingIdx, setEditingIdx] = useState(null)

  const setCompany = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      company: { ...prev.company, [key]: e.target.value }
    }))
  }

  const handleLogoUpload = async (file) => {
    try {
      const url = await uploadImage(token, file, 'ms-construction/logo')
      updateDraft(prev => ({ ...prev, company: { ...prev.company, logoUrl: url } }))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload logo')
    }
  }

  const setNavItem = (idx, key) => (e) => {
    updateDraft(prev => {
      const nav = [...(prev.navigation || [])]
      nav[idx] = { ...nav[idx], [key]: e.target.value }
      return { ...prev, navigation: nav }
    })
  }

  const toggleNavItem = (idx) => {
    updateDraft(prev => {
      const nav = [...(prev.navigation || [])]
      nav[idx] = { ...nav[idx], enabled: !nav[idx].enabled }
      return { ...prev, navigation: nav }
    })
  }

  const moveNavItem = (idx, direction) => {
    updateDraft(prev => {
      const nav = [...(prev.navigation || [])]
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= nav.length) return prev
      ;[nav[idx], nav[newIdx]] = [nav[newIdx], nav[idx]]
      nav.forEach((item, i) => { item.sortOrder = i })
      return { ...prev, navigation: nav }
    })
  }

  const addNavItem = () => {
    updateDraft(prev => {
      const nav = [...(prev.navigation || [])]
      nav.push({ id: 'new-' + Date.now(), label: 'New Link', target: '#', enabled: true, sortOrder: nav.length })
      return { ...prev, navigation: nav }
    })
    setEditingIdx(navItems.length)
  }

  const removeNavItem = (idx) => {
    updateDraft(prev => {
      const nav = [...(prev.navigation || [])]
      nav.splice(idx, 1)
      return { ...prev, navigation: nav }
    })
    setEditingIdx(null)
  }

  return (
    <div>
      <EditorHeader title="Logo & Menu" subtitle="Control your logo and the links visitors see at the top of your website" />

      <EditorField label="Company Name (shown next to logo)" value={company.companyName} onChange={setCompany('companyName')} />

      <div className="mt-4">
        <ImageUploadField label="Logo" imageUrl={company.logoUrl} onUpload={handleLogoUpload} aspect="aspect-[3/1]" />
        <p className="text-[11px] text-slate-500 mt-1.5">If no logo is uploaded, your company name is shown instead.</p>
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Menu Links</span>
          <button onClick={addNavItem} className="text-xs font-semibold text-amber-400 hover:text-amber-300">+ Add Link</button>
        </div>
        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <div key={item.id || idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
              {editingIdx === idx ? (
                <div>
                  <EditorField label="Text shown to visitors" value={item.label} onChange={setNavItem(idx, 'label')} placeholder="e.g. About Us" />
                  <EditorField label="Links to" value={item.target} onChange={setNavItem(idx, 'target')} placeholder="e.g. #about" helpText="The page section this link jumps to." />
                  <div className="flex items-center justify-between mt-2">
                    <button onClick={() => setEditingIdx(null)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">Done</button>
                    <button onClick={() => removeNavItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete Link</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${item.enabled ? 'text-white' : 'text-slate-500 line-through'}`}>{item.label}</span>
                    <span className="text-xs text-slate-500">{item.target}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveNavItem(idx, -1)} className="text-slate-400 hover:text-white p-1 text-xs">↑</button>
                    <button onClick={() => moveNavItem(idx, 1)} className="text-slate-400 hover:text-white p-1 text-xs">↓</button>
                    <button onClick={() => setEditingIdx(idx)} className="text-blue-400 hover:text-blue-300 p-1 text-xs font-semibold">Edit</button>
                    <button onClick={() => toggleNavItem(idx)} className={`p-1 text-xs font-semibold ${item.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {item.enabled ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
