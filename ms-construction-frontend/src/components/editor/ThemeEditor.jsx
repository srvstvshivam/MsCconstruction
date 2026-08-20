import React from 'react'
import { EditorField, EditorHeader } from './EditorFields'

// Relative luminance (0 = black, 1 = white) - used to warn when a chosen
// "Primary Color" is too light for the navbar/hero, which always use white text.
function luminance(hex) {
  if (!hex || !/^#?[0-9a-fA-F]{6}$/.test(hex)) return null
  const clean = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export default function ThemeEditor({ draft, updateDraft }) {
  const theme = draft?.theme || {}

  const set = (key) => (e) => {
    updateDraft(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: e.target.value }
    }))
  }

  const colors = [
    { key: 'primaryColor', label: 'Primary Color', helpText: 'Used as the navbar and footer background. Keep it dark — navbar text is always white.' },
    { key: 'secondaryColor', label: 'Secondary Color' },
    { key: 'accentColor', label: 'Accent Color', helpText: 'Used for buttons, highlights, and active states.' },
    { key: 'backgroundColor', label: 'Background Color' },
    { key: 'textColor', label: 'Text Color' },
    { key: 'headingColor', label: 'Heading Color' },
    { key: 'buttonColor', label: 'Button Color' },
  ]

  const primaryLuminance = luminance(theme.primaryColor)
  const primaryTooLight = primaryLuminance !== null && primaryLuminance > 0.45

  return (
    <div>
      <EditorHeader title="Colors & Theme" subtitle="Colors update the preview in real-time" />

      {primaryTooLight && (
        <div className="mb-4 px-3 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
          ⚠ This Primary Color is quite light. The navbar and footer text is always white, so it may be hard to read. Consider a darker shade.
        </div>
      )}

      {colors.map(c => (
        <EditorField key={c.key} label={c.label} value={theme[c.key]} onChange={set(c.key)} type="color" helpText={c.helpText} />
      ))}
      <EditorField label="Border Radius (px)" value={theme.borderRadius} onChange={set('borderRadius')} type="number" />
    </div>
  )
}
