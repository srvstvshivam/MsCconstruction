import React from 'react'
import { EditorField, EditorHeader } from './EditorFields'
import { uploadImage } from '../../api/client'
import { ImageUploadField } from './ImageUploadField'

export default function AboutEditor({ draft, updateDraft, token }) {
  const company = draft?.company || {}

  const set = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      company: { ...prev.company, [key]: e.target.value }
    }))
  }

  const handleImage = async (file) => {
    try {
      const url = await uploadImage(token, file, 'ms-construction/about')
      updateDraft(prev => ({
        ...prev,
        company: { ...prev.company, aboutImageUrl: url }
      }))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload image')
    }
  }

  return (
    <div>
      <EditorHeader title="About Us" subtitle="Tell visitors who your company is and show a company photo" />
      
      <EditorField label="About Text" value={company.aboutText} onChange={set('aboutText')} textarea rows={6} placeholder="Tell your company story..." />
      <EditorField label="Motto" value={company.motto} onChange={set('motto')} placeholder="Company tagline or motto" />
      <EditorField label="Owner Name" value={company.ownerName} onChange={set('ownerName')} />

      <div className="border-t border-slate-700 pt-4 mt-4">
        <ImageUploadField label="About Image" imageUrl={company.aboutImageUrl} onUpload={handleImage} />
        <div className="mt-3">
          <EditorField label="Or paste image URL" value={company.aboutImageUrl} onChange={set('aboutImageUrl')} />
          <EditorField label="Image Caption" value={company.aboutImageCaption} onChange={set('aboutImageCaption')} />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Our Team Page</span>
        <EditorField
          label='"Meet Our Team" Button Text'
          value={company.teamButtonText}
          onChange={set('teamButtonText')}
          placeholder="Leave blank to hide the button"
          helpText="If filled in, a button appears in About Us linking to a dedicated Our Team page. Manage team members from the sidebar."
        />
      </div>
    </div>
  )
}
