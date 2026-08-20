import React, { useState } from 'react'
import { EditorField, EditorHeader } from './EditorFields'
import { ImageUploadField } from './ImageUploadField'
import { uploadImage } from '../../api/client'

export default function TeamEditor({ draft, updateDraft, token }) {
  const team = draft?.team || []
  const [editingIdx, setEditingIdx] = useState(null)

  const setItem = (idx, key) => (e) => {
    updateDraft(prev => {
      const arr = [...(prev.team || [])]
      arr[idx] = { ...arr[idx], [key]: e.target.value }
      return { ...prev, team: arr }
    })
  }

  const handlePhoto = (idx) => async (file) => {
    try {
      const url = await uploadImage(token, file, 'ms-construction/team')
      updateDraft(prev => {
        const arr = [...(prev.team || [])]
        arr[idx] = { ...arr[idx], photoUrl: url }
        return { ...prev, team: arr }
      })
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload photo')
    }
  }

  const toggleItem = (idx) => {
    updateDraft(prev => {
      const arr = [...(prev.team || [])]
      const currentlyEnabled = arr[idx].enabled !== false
      arr[idx] = { ...arr[idx], enabled: !currentlyEnabled }
      return { ...prev, team: arr }
    })
  }

  const moveItem = (idx, direction) => {
    updateDraft(prev => {
      const arr = [...(prev.team || [])]
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= arr.length) return prev
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      arr.forEach((item, i) => { item.sortOrder = i })
      return { ...prev, team: arr }
    })
  }

  const addItem = () => {
    updateDraft(prev => {
      const arr = [...(prev.team || [])]
      arr.push({ id: 'new-' + Date.now(), name: 'New Team Member', role: '', bio: '', photoUrl: '', sortOrder: arr.length, enabled: true })
      return { ...prev, team: arr }
    })
    setEditingIdx(team.length)
  }

  const removeItem = (idx) => {
    updateDraft(prev => {
      const arr = [...(prev.team || [])]
      arr.splice(idx, 1)
      return { ...prev, team: arr }
    })
    setEditingIdx(null)
  }

  return (
    <div>
      <EditorHeader title="Our Team" subtitle="People shown on your dedicated Our Team page" />
      <div className="flex justify-end mb-3">
        <button onClick={addItem} className="text-xs font-semibold text-amber-400 hover:text-amber-300">+ Add Team Member</button>
      </div>
      <div className="space-y-2">
        {team.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            {editingIdx === idx ? (
              <div>
                <ImageUploadField label="Photo" imageUrl={item.photoUrl} onUpload={handlePhoto(idx)} aspect="aspect-square" />
                <div className="mt-3">
                  <EditorField label="Name" value={item.name} onChange={setItem(idx, 'name')} />
                  <EditorField label="Role" value={item.role} onChange={setItem(idx, 'role')} placeholder="e.g. Site Engineer" />
                  <EditorField label="Short Bio" value={item.bio} onChange={setItem(idx, 'bio')} textarea rows={3} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => setEditingIdx(null)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">Done</button>
                  <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.photoUrl && <img src={item.photoUrl} alt={item.name} className="w-8 h-8 rounded-full object-cover" />}
                  <div>
                    <span className={`text-sm font-medium ${item.enabled !== false ? 'text-white' : 'text-slate-500 line-through'}`}>{item.name || 'Untitled'}</span>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
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
