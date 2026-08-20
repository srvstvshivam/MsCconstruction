import React from 'react'
import { EditorField, EditorHeader } from './EditorFields'

export default function ContactEditor({ draft, updateDraft }) {
  const company = draft?.company || {}

  const set = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      company: { ...prev.company, [key]: e.target.value }
    }))
  }

  return (
    <div>
      <EditorHeader title="Contact Details" subtitle="Phone, WhatsApp, email, and address shown to customers" />
      
      <EditorField label="Primary Phone" value={company.phonePrimary} onChange={set('phonePrimary')} />
      <EditorField label="Secondary Phone" value={company.phoneSecondary} onChange={set('phoneSecondary')} />
      <EditorField label="WhatsApp Number" value={company.whatsappNumber} onChange={set('whatsappNumber')} />
      <EditorField label="Email" value={company.email} onChange={set('email')} />
      <EditorField label="Address" value={company.address} onChange={set('address')} textarea rows={3} />
    </div>
  )
}
