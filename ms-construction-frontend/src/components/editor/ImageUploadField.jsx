import React, { useState } from 'react'

export function ImageUploadField({ label, imageUrl, onUpload, aspect = 'aspect-video' }) {
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
      e.target.value = '' // allow re-selecting the same file
    }
  }

  return (
    <div>
      {label && <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">{label}</span>}
      <label
        className={`group relative block w-full ${aspect} rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
          imageUrl ? 'border-slate-600 hover:border-amber-400' : 'border-dashed border-slate-600 hover:border-amber-400 hover:bg-slate-700/50'
        }`}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={label || 'Preview'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors">
              <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? 'Uploading…' : '📷 Click to change'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">
              {uploading ? 'Uploading…' : '📷 Click to upload'}
            </span>
          </div>
        )}
        <input type="file" accept="image/*" className="sr-only" onChange={handleChange} disabled={uploading} />
      </label>
    </div>
  )
}
