import React from 'react'

// Shared editor field component for all editor panels
export function EditorField({ label, value, onChange, type = 'text', textarea, rows = 3, disabled, placeholder, helpText }) {
  const baseClasses = "w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
  
  return (
    <label className="block mb-4">
      <span className="text-xs font-semibold text-slate-300 mb-1.5 block uppercase tracking-wider">{label}</span>
      {type === 'color' ? (
        <div className="flex items-center gap-3">
          <input type="color" value={value || '#000000'} onChange={onChange} className="w-10 h-10 rounded cursor-pointer border-2 border-slate-600" />
          <input type="text" value={value || ''} onChange={onChange} className={baseClasses + ' flex-1'} placeholder="#000000" />
        </div>
      ) : textarea ? (
        <textarea
          rows={rows}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={baseClasses + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      {helpText && <span className="text-[11px] text-slate-500 mt-1.5 block normal-case font-normal tracking-normal">{helpText}</span>}
    </label>
  )
}

export function EditorSection({ title, children, collapsed, onToggle }) {
  return (
    <div className="border-b border-slate-700 pb-4 mb-4">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-200 hover:text-white transition-colors"
      >
        {title}
        <span className="text-xs text-slate-500">{collapsed ? '▶' : '▼'}</span>
      </button>
      {!collapsed && <div className="mt-2">{children}</div>}
    </div>
  )
}

export function EditorHeader({ title, subtitle }) {
  return (
    <div className="mb-6 pb-4 border-b border-slate-700">
      <h2 className="font-bold text-white text-lg">{title}</h2>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}
