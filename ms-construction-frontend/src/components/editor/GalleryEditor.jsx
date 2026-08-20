import React, { useRef, useState } from 'react'
import { EditorHeader } from './EditorFields'
import { uploadImage } from '../../api/client'

export default function GalleryEditor({ draft, updateDraft, token }) {
  const images = draft?.gallery || []
  const [pending, setPending] = useState(null) // { file, previewUrl, title } — staged upload awaiting title + confirm
  const [uploading, setUploading] = useState(false)
  const [replacingIdx, setReplacingIdx] = useState(null)
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPending({ file, previewUrl: URL.createObjectURL(file), title: '' })
    e.target.value = ''
  }

  const confirmAddPhoto = async () => {
    if (!pending) return
    setUploading(true)
    try {
      const url = await uploadImage(token, pending.file, 'ms-construction/gallery')
      updateDraft(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), { url, caption: pending.title, sortOrder: (prev.gallery?.length || 0), enabled: true, id: 'new-' + Date.now() }]
      }))
      setPending(null)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const cancelPending = () => setPending(null)

  const handleReplaceChosen = (idx) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setReplacingIdx(idx)
    try {
      const url = await uploadImage(token, file, 'ms-construction/gallery')
      updateDraft(prev => {
        const items = [...(prev.gallery || [])]
        // Same title, same position — only the image itself changes.
        items[idx] = { ...items[idx], url }
        return { ...prev, gallery: items }
      })
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to replace image')
    } finally {
      setReplacingIdx(null)
    }
  }

  const removeImage = (idx) => {
    updateDraft(prev => {
      const items = [...(prev.gallery || [])]
      items.splice(idx, 1)
      return { ...prev, gallery: items }
    })
  }

  const setCaption = (idx) => (e) => {
    updateDraft(prev => {
      const items = [...(prev.gallery || [])]
      items[idx] = { ...items[idx], caption: e.target.value }
      return { ...prev, gallery: items }
    })
  }

  const moveImage = (idx, direction) => {
    updateDraft(prev => {
      const items = [...(prev.gallery || [])]
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= items.length) return prev
      ;[items[idx], items[newIdx]] = [items[newIdx], items[idx]]
      items.forEach((item, i) => { item.sortOrder = i })
      return { ...prev, gallery: items }
    })
  }

  return (
    <div>
      <EditorHeader title="Project Photos" subtitle="Upload and manage photos shown in your gallery" />

      {pending ? (
        <div className="bg-slate-700/50 rounded-lg border border-amber-400/50 p-3 mb-4">
          <img src={pending.previewUrl} alt="New upload preview" className="w-full h-32 object-cover rounded mb-3" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Photo Title / Name</span>
          <input
            type="text"
            autoFocus
            value={pending.title}
            onChange={(e) => setPending(p => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Structural framing — Sector 21"
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-400 mb-3"
          />
          <p className="text-[11px] text-slate-500 mb-3">
            This title appears over the photo when a visitor hovers over it — the same way it works for your existing photos.
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmAddPhoto}
              disabled={uploading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-navy-950 font-bold rounded py-2 text-sm transition-colors"
            >
              {uploading ? 'Adding…' : 'Add Photo'}
            </button>
            <button onClick={cancelPending} disabled={uploading} className="px-4 text-slate-400 hover:text-white text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-slate-700/50 transition-all mb-4">
          <span className="text-slate-400 text-sm font-medium">📷 Upload New Photo</span>
          <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChosen} />
        </label>
      )}

      <div className="space-y-3">
        {images.map((img, idx) => (
          <div key={img.id || idx} className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600">
            <div className="relative h-28">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              {replacingIdx === idx && (
                <div className="absolute inset-0 bg-black/60 grid place-items-center text-white text-xs font-semibold">
                  Replacing…
                </div>
              )}
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-lg"
                title="Delete photo"
              >✕</button>
              <div className="absolute top-2 left-2 flex gap-1">
                <button onClick={() => moveImage(idx, -1)} className="bg-slate-900/70 hover:bg-slate-900 text-white w-6 h-6 rounded text-xs font-bold flex items-center justify-center shadow-lg">↑</button>
                <button onClick={() => moveImage(idx, 1)} className="bg-slate-900/70 hover:bg-slate-900 text-white w-6 h-6 rounded text-xs font-bold flex items-center justify-center shadow-lg">↓</button>
              </div>
              <label className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded cursor-pointer shadow-lg">
                Replace
                <input type="file" accept="image/*" className="sr-only" onChange={handleReplaceChosen(idx)} />
              </label>
            </div>
            <div className="p-2">
              <input
                type="text"
                value={img.caption || ''}
                onChange={setCaption(idx)}
                placeholder="Photo title..."
                className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
