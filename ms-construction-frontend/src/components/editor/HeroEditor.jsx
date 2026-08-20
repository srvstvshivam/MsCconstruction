import React from 'react'
import { EditorField, EditorHeader } from './EditorFields'
import { uploadImage } from '../../api/client'
import { ImageUploadField } from './ImageUploadField'

export default function HeroEditor({ draft, updateDraft, token }) {
  const hero = draft?.hero || {}

  const set = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      hero: { ...prev.hero, [key]: e.target.value }
    }))
  }

  const handleBgImage = async (file) => {
    try {
      const url = await uploadImage(token, file, 'ms-construction/hero')
      updateDraft(prev => ({
        ...prev,
        hero: { ...prev.hero, bgImageUrl: url }
      }))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload image')
    }
  }

  return (
    <div>
      <EditorHeader title="Homepage Top Section" subtitle="The first thing visitors see when they open your website" />
      
      <EditorField label="Tagline" value={hero.tagline} onChange={set('tagline')} placeholder="e.g. Building The Future" />
      <EditorField label="Headline" value={hero.headline} onChange={set('headline')} placeholder="Main heading text" />
      <EditorField label="Subheadline" value={hero.subheadline} onChange={set('subheadline')} textarea rows={3} placeholder="Description text" />
      
      <div className="border-t border-slate-700 pt-4 mt-4 mb-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Call to Action 1</span>
        <EditorField label="Button Text" value={hero.cta1Text} onChange={set('cta1Text')} />
        <EditorField label="Button Link" value={hero.cta1Link} onChange={set('cta1Link')} placeholder="#contact" />
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4 mb-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Call to Action 2</span>
        <EditorField label="Button Text" value={hero.cta2Text} onChange={set('cta2Text')} />
        <EditorField label="Button Link" value={hero.cta2Link} onChange={set('cta2Link')} placeholder="#portfolio" />
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <ImageUploadField label="Background Image" imageUrl={hero.bgImageUrl} onUpload={handleBgImage} />
        <div className="mt-3">
          <EditorField label="Or paste image URL" value={hero.bgImageUrl} onChange={set('bgImageUrl')} placeholder="https://..." />
        </div>
      </div>
    </div>
  )
}
