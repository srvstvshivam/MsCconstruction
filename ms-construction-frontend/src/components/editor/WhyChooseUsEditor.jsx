import React, { useState } from 'react'
import { EditorField, EditorHeader } from './EditorFields'

export default function WhyChooseUsEditor({ draft, updateDraft }) {
  const items = draft?.whyChooseUs || []
  const [editingIdx, setEditingIdx] = useState(null)

  const setItem = (idx, key) => (e) => {
    updateDraft(prev => {
      const arr = [...(prev.whyChooseUs || [])]
      arr[idx] = { ...arr[idx], [key]: key === 'sortOrder' ? Number(e.target.value) : e.target.value }
      return { ...prev, whyChooseUs: arr }
    })
  }

  const toggleItem = (idx) => {
    updateDraft(prev => {
      const arr = [...(prev.whyChooseUs || [])]
      const currentlyEnabled = arr[idx].enabled !== false
      arr[idx] = { ...arr[idx], enabled: !currentlyEnabled }
      return { ...prev, whyChooseUs: arr }
    })
  }

  const moveItem = (idx, direction) => {
    updateDraft(prev => {
      const arr = [...(prev.whyChooseUs || [])]
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= arr.length) return prev
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      arr.forEach((item, i) => { item.sortOrder = i })
      return { ...prev, whyChooseUs: arr }
    })
  }

  const addItem = () => {
    updateDraft(prev => {
      const arr = [...(prev.whyChooseUs || [])]
      arr.push({ id: 'new-' + Date.now(), title: 'New Reason', description: '', sortOrder: arr.length, enabled: true })
      return { ...prev, whyChooseUs: arr }
    })
    setEditingIdx(items.length)
  }

  const removeItem = (idx) => {
    updateDraft(prev => {
      const arr = [...(prev.whyChooseUs || [])]
      arr.splice(idx, 1)
      return { ...prev, whyChooseUs: arr }
    })
    setEditingIdx(null)
  }

  return (
    <div>
      <EditorHeader title="Why Choose Us" subtitle="Add, edit, or remove the reasons customers choose you" />
      <div className="flex justify-end mb-3">
        <button onClick={addItem} className="text-xs font-semibold text-amber-400 hover:text-amber-300">+ Add Reason</button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            {editingIdx === idx ? (
              <div>
                <EditorField label="Title" value={item.title} onChange={setItem(idx, 'title')} />
                <EditorField label="Description" value={item.description} onChange={setItem(idx, 'description')} textarea rows={3} />
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => setEditingIdx(null)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">Done</button>
                  <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${item.enabled !== false ? 'text-white' : 'text-slate-500 line-through'}`}>{item.title || 'Untitled'}</span>
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
