import React from 'react'
import { EditorField, EditorHeader } from './EditorFields'

export default function FooterEditor({ draft, updateDraft }) {
  const company = draft?.company || {}

  const set = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      company: { ...prev.company, [key]: e.target.value }
    }))
  }

  return (
    <div>
      <EditorHeader title="Footer" subtitle="Company info, links, and copyright" />
      
      <EditorField label="Company Name" value={company.companyName} onChange={set('companyName')} />
      <EditorField label="Footer Description" value={company.footerDescription} onChange={set('footerDescription')} textarea rows={3} />
      <EditorField label="Copyright Text" value={company.copyrightText} onChange={set('copyrightText')} placeholder="All rights reserved." />
      
      <div className="border-t border-slate-700 pt-4 mt-4 mb-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Contact Details</span>
        <EditorField label="Address" value={company.address} onChange={set('address')} textarea rows={2} />
        <EditorField label="Primary Phone" value={company.phonePrimary} onChange={set('phonePrimary')} />
        <EditorField label="Email" value={company.email} onChange={set('email')} />
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Social Links</span>
        <EditorField label="Facebook" value={company.facebookUrl} onChange={set('facebookUrl')} placeholder="https://facebook.com/..." />
        <EditorField label="Twitter" value={company.twitterUrl} onChange={set('twitterUrl')} placeholder="https://twitter.com/..." />
        <EditorField label="Instagram" value={company.instagramUrl} onChange={set('instagramUrl')} placeholder="https://instagram.com/..." />
        <EditorField label="LinkedIn" value={company.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/..." />
      </div>
    </div>
  )
}
