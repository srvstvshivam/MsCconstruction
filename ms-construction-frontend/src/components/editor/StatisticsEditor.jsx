import React, { useState } from 'react'
import { EditorField, EditorHeader } from './EditorFields'

export default function StatisticsEditor({ draft, updateDraft }) {
  const stats = draft?.statistics || []
  const [editingIdx, setEditingIdx] = useState(null)

  const setItem = (idx, key) => (e) => {
    updateDraft(prev => {
      const items = [...(prev.statistics || [])]
      const val = ['numericValue', 'sortOrder', 'decimalPrecision'].includes(key) ? Number(e.target.value) : e.target.value
      items[idx] = { ...items[idx], [key]: val }
      return { ...prev, statistics: items }
    })
  }

  const toggleItem = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.statistics || [])]
      const currentlyEnabled = items[idx].enabled !== false
      items[idx] = { ...items[idx], enabled: !currentlyEnabled }
      return { ...prev, statistics: items }
    })
  }

  const moveItem = (idx, direction) => {
    updateDraft(prev => {
      const items = [...(prev.statistics || [])]
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= items.length) return prev
      ;[items[idx], items[newIdx]] = [items[newIdx], items[idx]]
      items.forEach((item, i) => { item.sortOrder = i })
      return { ...prev, statistics: items }
    })
  }

  const addItem = () => {
    updateDraft(prev => {
      const items = [...(prev.statistics || [])]
      items.push({ id: 'new-' + Date.now(), label: 'New Stat', numericValue: 0, prefix: '', suffix: '', decimalPrecision: 0, sortOrder: items.length, enabled: true })
      return { ...prev, statistics: items }
    })
    setEditingIdx(stats.length)
  }

  const removeItem = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.statistics || [])]
      items.splice(idx, 1)
      return { ...prev, statistics: items }
    })
    setEditingIdx(null)
  }

  return (
    <div>
      <EditorHeader title="Company Numbers" subtitle="Business numbers shown on your homepage, like completed projects or years of experience" />
      <div className="flex justify-end mb-3">
        <button onClick={addItem} className="text-xs font-semibold text-amber-400 hover:text-amber-300">+ Add Number</button>
      </div>
      <div className="space-y-2">
        {stats.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            {editingIdx === idx ? (
              <div>
                <EditorField label="Label" value={item.label} onChange={setItem(idx, 'label')} placeholder="e.g. Completed Projects" />
                <EditorField label="Number" value={item.numericValue} onChange={setItem(idx, 'numericValue')} type="number" />
                <EditorField label="Prefix" value={item.prefix} onChange={setItem(idx, 'prefix')} placeholder="e.g. ₹" />
                <EditorField label="Suffix" value={item.suffix} onChange={setItem(idx, 'suffix')} placeholder="e.g. Cr+" />
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => setEditingIdx(null)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">Done</button>
                  <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${item.enabled !== false ? 'text-white' : 'text-slate-500 line-through'}`}>{item.label || 'Untitled'}</span>
                  <p className="text-xs text-slate-400">{item.prefix}{item.numericValue}{item.suffix}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(idx, -1)} className="text-slate-400 hover:text-white p-1 text-xs">↑</button>
                  <button onClick={() => moveItem(idx, 1)} className="text-slate-400 hover:text-white p-1 text-xs">↓</button>
                  <button onClick={() => setEditingIdx(idx)} className="text-blue-400 hover:text-blue-300 p-1 text-xs font-semibold">Edit</button>
                  <button onClick={() => toggleItem(idx)} className={`p-1 text-xs font-semibold ${item.enabled !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {item.enabled !== false ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
