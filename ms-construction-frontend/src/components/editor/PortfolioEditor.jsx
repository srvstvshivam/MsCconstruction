import React, { useState } from 'react'
import { EditorField, EditorHeader } from './EditorFields'

export default function PortfolioEditor({ draft, updateDraft }) {
  const projects = draft?.projects || []
  const [editingIdx, setEditingIdx] = useState(null)

  const setItem = (idx, key) => (e) => {
    updateDraft(prev => {
      const items = [...(prev.projects || [])]
      items[idx] = { ...items[idx], [key]: key === 'valueCr' ? Number(e.target.value) : e.target.value }
      return { ...prev, projects: items }
    })
  }

  const toggleStatus = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.projects || [])]
      items[idx] = { ...items[idx], status: items[idx].status === 'COMPLETED' ? 'RUNNING' : 'COMPLETED' }
      return { ...prev, projects: items }
    })
  }

  const toggleEnabled = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.projects || [])]
      const currentlyEnabled = items[idx].enabled !== false
      items[idx] = { ...items[idx], enabled: !currentlyEnabled }
      return { ...prev, projects: items }
    })
  }

  const addItem = () => {
    updateDraft(prev => {
      const items = [...(prev.projects || [])]
      items.push({ id: 'new-' + Date.now(), clientName: 'New Project', location: '', valueCr: 0, scopeOfWork: '', status: 'RUNNING', sector: 'Residential', enabled: true })
      return { ...prev, projects: items }
    })
    setEditingIdx(projects.length)
  }

  const removeItem = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.projects || [])]
      items.splice(idx, 1)
      return { ...prev, projects: items }
    })
    setEditingIdx(null)
  }

  return (
    <div>
      <EditorHeader title="Projects" subtitle="Add, edit, or remove the projects shown in your portfolio" />
      <div className="flex justify-end mb-3">
        <button onClick={addItem} className="text-xs font-semibold text-amber-400 hover:text-amber-300">+ Add Project</button>
      </div>
      <div className="space-y-2">
        {projects.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            {editingIdx === idx ? (
              <div>
                <EditorField label="Client Name" value={item.clientName} onChange={setItem(idx, 'clientName')} />
                <EditorField label="Location" value={item.location} onChange={setItem(idx, 'location')} />
                <EditorField label="Value (₹ Cr)" value={item.valueCr} onChange={setItem(idx, 'valueCr')} type="number" />
                <EditorField label="Scope of Work" value={item.scopeOfWork} onChange={setItem(idx, 'scopeOfWork')} textarea rows={3} />
                <label className="block mb-4">
                  <span className="text-xs font-semibold text-slate-300 mb-1.5 block uppercase tracking-wider">Sector</span>
                  <select value={item.sector || 'Residential'} onChange={(e) => setItem(idx, 'sector')(e)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white outline-none">
                    <option>Residential</option><option>Commercial</option><option>Industrial</option>
                  </select>
                </label>
                <label className="block mb-4">
                  <span className="text-xs font-semibold text-slate-300 mb-1.5 block uppercase tracking-wider">Status</span>
                  <select value={item.status || 'RUNNING'} onChange={(e) => setItem(idx, 'status')(e)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white outline-none">
                    <option value="RUNNING">Running</option><option value="COMPLETED">Completed</option>
                  </select>
                </label>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => setEditingIdx(null)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">Done</button>
                  <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-medium ${item.enabled !== false ? 'text-white' : 'text-slate-500 line-through'}`}>{item.clientName || 'Untitled'}</span>
                  <p className="text-xs text-slate-400">{item.location} · ₹{item.valueCr} Cr · {item.status}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingIdx(idx)} className="text-blue-400 hover:text-blue-300 p-1 text-xs font-semibold">Edit</button>
                  <button onClick={() => toggleStatus(idx)} className="text-amber-400 hover:text-amber-300 p-1 text-xs font-semibold">Toggle</button>
                  <button onClick={() => toggleEnabled(idx)} className={`p-1 text-xs font-semibold ${item.enabled !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {item.enabled !== false ? 'On' : 'Off'}
                  </button>
                  <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 p-1 text-xs font-semibold">✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
