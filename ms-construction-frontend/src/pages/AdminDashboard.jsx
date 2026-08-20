import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSite } from '../context/SiteContext.jsx'
import {
  updateCompanyInfo,
  updateHero, updateTheme,
  createStatistic, updateStatistic, deleteStatistic,
  createWhyChoose, updateWhyChoose, deleteWhyChoose,
  createCommitment, updateCommitment, deleteCommitment,
  createNavigation, updateNavigation, deleteNavigation,
  createService, updateService, deleteService,
  createProject, updateProject, deleteProject,
  addGalleryImage, updateGalleryImage, deleteGalleryImage,
  getQueries, markQueryRead, deleteQuery,
  uploadImage, getRevisions, getMedia, deleteMedia
} from '../api/client'

const TABS = [
  { id: 'Media', label: 'All Uploaded Images' },
  { id: 'Queries', label: 'Customer Enquiries' },
  { id: 'Revisions', label: 'Change History' },
]

export default function AdminDashboard() {
  const { token, username, logout } = useAuth()
  const [tab, setTab] = useState(TABS[0].id)
  const { siteData, refreshSiteData } = useSite()

  const handleTabChange = (t) => setTab(t)

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <header className="bg-navy-950 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-bold text-xl flex items-center gap-2">
             <span className="text-amber-400">MS</span> Admin
             <a href="/" target="_blank" className="text-xs font-normal ml-4 px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors">View Site ↗</a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/admin/editor" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-1.5 rounded-md transition-colors">
              ✎ Edit My Website
            </a>
            <span className="text-slate-300 hidden md:inline">Welcome, {username}</span>
            <button onClick={logout} className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-semibold px-4 py-1.5 rounded-md transition-colors">
              Log Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 pb-2">
          <p className="text-xs text-slate-400 mb-2">
            This page is for things that aren't part of the website itself — enquiries, photo storage, and history.
            To edit anything visitors see, use <span className="text-slate-200 font-medium">Edit My Website</span>.
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-5 pb-2 overflow-x-auto flex gap-2 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-slate-100 text-navy-950' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {tab === 'Media' && <MediaLibraryTab token={token} />}
        {tab === 'Queries' && <QueriesTab token={token} />}
        {tab === 'Revisions' && <RevisionsTab token={token} />}
      </div>
    </div>
  )
}

// ---------------- Generic Form Helpers ----------------
function Field({ label, value, onChange, textarea, rows = 2, type = 'text', helpText }) {
  return (
    <label className="block mb-4">
      <span className="text-xs font-semibold text-slate-700 mb-1 block uppercase tracking-wider">{label}</span>
      {textarea ? (
        <textarea rows={rows} value={value || ''} onChange={onChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none" />
      ) : type === 'checkbox' ? (
        <input type="checkbox" checked={!!value} onChange={onChange} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
      ) : (
        <input type={type} value={value || ''} onChange={onChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none" />
      )}
      {helpText && <span className="text-[10px] text-slate-500 mt-1 block">{helpText}</span>}
    </label>
  )
}

// ---------------- Singleton Tabs ----------------
function SingletonTab({ title, data, updateFn, token, refresh, fields }) {
  const [form, setForm] = useState(data || {})
  const [status, setStatus] = useState('idle')

  useEffect(() => { setForm(data || {}) }, [data])

  const set = (k, type) => (e) => setForm({ ...form, [k]: type === 'checkbox' ? e.target.checked : e.target.value })

  const save = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await updateFn(token, form)
      setStatus('saved')
      refresh()
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-navy-950 text-xl">{title}</h2>
        <button className="bg-navy-950 hover:bg-navy-800 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors shadow-sm flex items-center gap-2">
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {status === 'saved' && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-sm">Changes saved successfully.</div>}
      {status === 'error' && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">Failed to save changes.</div>}
      
      <div className="grid md:grid-cols-2 gap-x-6">
        {fields.map(f => (
          <div key={f.key} className={f.fullWidth ? 'md:col-span-2' : ''}>
             <Field label={f.label} value={form[f.key]} onChange={set(f.key, f.type)} textarea={f.textarea} rows={f.rows} type={f.type} helpText={f.helpText} />
          </div>
        ))}
      </div>
    </form>
  )
}

function ThemeTab({ token, siteData, refresh }) {
  const [form, setForm] = useState(siteData?.theme || {})
  const [status, setStatus] = useState('idle')

  useEffect(() => { setForm(siteData?.theme || {}) }, [siteData])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await updateTheme(token, form)
      setStatus('saved')
      refresh()
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const fields = [
    { key: 'primaryColor', label: 'Primary Color' },
    { key: 'secondaryColor', label: 'Secondary Color' },
    { key: 'accentColor', label: 'Accent Color' },
    { key: 'backgroundColor', label: 'Background Color' },
    { key: 'textColor', label: 'Text Color' },
    { key: 'headingColor', label: 'Heading Color' },
    { key: 'buttonColor', label: 'Button Color' },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="font-bold text-navy-950 text-xl">Theme Settings</h2>
          <button className="bg-navy-950 hover:bg-navy-800 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors shadow-sm flex items-center gap-2">
            {status === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        {status === 'saved' && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-sm">Changes saved successfully.</div>}
        {status === 'error' && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">Failed to save changes.</div>}
        
        <div className="grid grid-cols-2 gap-x-6">
          {fields.map(f => (
            <Field key={f.key} label={f.label} value={form[f.key]} onChange={set(f.key)} type="color" />
          ))}
          <div className="col-span-2">
             <Field label="Border Radius (px)" value={form.borderRadius} onChange={set('borderRadius')} type="number" />
          </div>
        </div>
      </form>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <h2 className="font-bold text-navy-950 text-xl mb-6 pb-4 border-b border-slate-100">Live Preview</h2>
         <div 
           className="p-8 border rounded-xl"
           style={{ backgroundColor: form.backgroundColor, color: form.textColor, borderRadius: `${form.borderRadius}px` }}
         >
           <h3 style={{ color: form.headingColor }} className="text-2xl font-bold mb-4">Sample Heading</h3>
           <p className="mb-6 opacity-90">This is what your website's content will look like with the selected theme. It updates in real-time before you save.</p>
           <div className="flex gap-4">
              <button style={{ backgroundColor: form.primaryColor, color: '#fff', borderRadius: `${form.borderRadius}px` }} className="px-6 py-2 font-semibold">Primary Action</button>
              <button style={{ backgroundColor: form.secondaryColor, color: '#fff', borderRadius: `${form.borderRadius}px` }} className="px-6 py-2 font-semibold">Secondary Action</button>
           </div>
           <div className="mt-6 pt-6 border-t border-current opacity-50 flex gap-4">
              <span style={{ color: form.accentColor }} className="font-bold">Accent Highlight</span>
              <span style={{ color: form.buttonColor }} className="font-bold">Button Color Fallback</span>
           </div>
         </div>
      </div>
    </div>
  )
}

function HeroTab(props) {
  const fields = [
    { key: 'tagline', label: 'Tagline', fullWidth: true },
    { key: 'headline', label: 'Headline', fullWidth: true },
    { key: 'subheadline', label: 'Subheadline', textarea: true, rows: 3, fullWidth: true },
    { key: 'cta1Text', label: 'CTA 1 Text' },
    { key: 'cta1Link', label: 'CTA 1 Link' },
    { key: 'cta2Text', label: 'CTA 2 Text' },
    { key: 'cta2Link', label: 'CTA 2 Link' },
    { key: 'bgImageUrl', label: 'Background Image URL', fullWidth: true },
  ]
  return <SingletonTab title="Hero Section" data={props.siteData?.hero} updateFn={updateHero} {...props} fields={fields} />
}

function CompanyInfoTab(props) {
  const fields = [
    { key: 'companyName', label: 'Company Name' },
    { key: 'ownerName', label: 'Owner Name' },
    { key: 'motto', label: 'Motto', fullWidth: true },
    { key: 'aboutText', label: 'About Text', textarea: true, rows: 5, fullWidth: true },
    { key: 'aboutImageUrl', label: 'About Image URL', fullWidth: true },
    { key: 'aboutImageCaption', label: 'About Image Caption', fullWidth: true },
    { key: 'address', label: 'Address', fullWidth: true },
    { key: 'email', label: 'Email' },
    { key: 'phonePrimary', label: 'Primary Phone' },
    { key: 'phoneSecondary', label: 'Secondary Phone' },
    { key: 'whatsappNumber', label: 'WhatsApp Number' },
    { key: 'logoUrl', label: 'Logo URL', fullWidth: true },
    { key: 'footerDescription', label: 'Footer Description', textarea: true, rows: 3, fullWidth: true },
    { key: 'copyrightText', label: 'Copyright Text', fullWidth: true },
    { key: 'facebookUrl', label: 'Facebook URL' },
    { key: 'twitterUrl', label: 'Twitter URL' },
    { key: 'instagramUrl', label: 'Instagram URL' },
    { key: 'linkedinUrl', label: 'LinkedIn URL' },
  ]
  return <SingletonTab title="Company Information" data={props.siteData?.company} updateFn={updateCompanyInfo} {...props} fields={fields} />
}

// ---------------- Media Library ----------------
function MediaLibraryTab({ token }) {
  const [items, setItems] = useState([])
  const load = () => getMedia(token).then(setItems)
  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!window.confirm('Delete this image permanently from Cloudinary?')) return;
    await deleteMedia(token, id)
    load()
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 text-sm font-medium mb-6">
        ℹ️ This is a global view of all assets uploaded via the CMS. Note that deleting an asset here might break the image if it is still assigned to a Project or Gallery item.
      </div>
      {items.length === 0 && <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">No media found.</div>}
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((asset) => (
          <div key={asset.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-video bg-slate-100 flex items-center justify-center p-2">
              <img src={asset.url} alt={asset.fileName} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs flex flex-col justify-between flex-1">
              <div>
                <p className="font-semibold text-slate-700 truncate mb-1" title={asset.fileName}>{asset.fileName}</p>
                <p className="text-slate-500 truncate">{asset.url}</p>
                <p className="text-slate-400 mt-1">Folder: {asset.folder}</p>
                <p className="text-slate-400">Date: {new Date(asset.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(asset.id)} className="mt-3 w-full px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded transition-colors text-center">
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------- Generic List Tab ----------------
function GenericListTab({ title, items, createFn, updateFn, deleteFn, token, refresh, fields }) {
  const [draft, setDraft] = useState({})
  const [editingId, setEditingId] = useState(null)
  
  const save = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateFn(token, editingId, draft)
    } else {
      await createFn(token, draft)
    }
    setDraft({})
    setEditingId(null)
    refresh()
  }

  const startEdit = (item) => {
    setDraft({ ...item })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setDraft({})
    setEditingId(null)
  }

  const remove = async (id) => { await deleteFn(token, id); refresh() }
  const toggleEnabled = async (item) => {
    await updateFn(token, item.id, { ...item, enabled: !item.enabled })
    refresh()
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 className="font-bold text-navy-950 text-lg mb-4">{editingId ? `Edit ${title}` : `Add ${title}`}</h2>
          {fields.map(f => (
            <Field key={f.key} label={f.label} value={draft[f.key]} onChange={(e) => setDraft({...draft, [f.key]: f.type==='number'?Number(e.target.value):e.target.value})} type={f.type} textarea={f.textarea} />
          ))}
          <div className="flex gap-2 mt-4">
             {editingId && <button type="button" onClick={cancelEdit} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md px-4 py-3 text-sm transition-colors">Cancel</button>}
             <button type="submit" className={`${editingId ? 'w-2/3' : 'w-full'} bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-md px-4 py-3 text-sm transition-colors`}>{editingId ? 'Save Changes' : 'Add New'}</button>
          </div>
        </form>
      </div>
      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 && <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">No {title.toLowerCase()} added yet.</div>}
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col md:flex-row gap-4 justify-between transition-colors ${!item.enabled ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-amber-300'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-navy-950 text-lg">{item[fields[0].key]}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.enabled ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="text-slate-600 text-sm space-y-1">
                {fields.slice(1).map(f => (
                  <div key={f.key}><span className="font-semibold">{f.label}:</span> {item[f.key]}</div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap md:flex-col gap-2 justify-end">
              <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded transition-colors">
                Edit
              </button>
              <button onClick={() => toggleEnabled(item)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors">
                {item.enabled ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => remove(item.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------- Projects ----------------
function ProjectsTab({ token, items, refresh }) {
  const defaultDraft = { clientName: '', location: '', valueCr: '', scopeOfWork: '', status: 'RUNNING', sector: 'Residential' }
  const [draft, setDraft] = useState(defaultDraft)
  const [editingId, setEditingId] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateProject(token, editingId, { ...draft, valueCr: Number(draft.valueCr) })
    } else {
      await createProject(token, { ...draft, valueCr: Number(draft.valueCr) })
    }
    setDraft(defaultDraft)
    setEditingId(null)
    refresh()
  }

  const startEdit = (p) => {
    setDraft({ ...p })
    setEditingId(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setDraft(defaultDraft)
    setEditingId(null)
  }

  const remove = async (id) => { await deleteProject(token, id); refresh() }
  const toggleStatus = async (p) => {
    await updateProject(token, p.id, { ...p, status: p.status === 'COMPLETED' ? 'RUNNING' : 'COMPLETED' })
    refresh()
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 className="font-bold text-navy-950 text-lg mb-4">{editingId ? 'Edit Project' : 'Add Project'}</h2>
          <Field label="Client Name" value={draft.clientName} onChange={(e) => setDraft({ ...draft, clientName: e.target.value })} />
          <Field label="Location" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
          <Field label="Value (₹ Cr)" type="number" value={draft.valueCr} onChange={(e) => setDraft({ ...draft, valueCr: e.target.value })} />
          
          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate-700 mb-1 block uppercase">Sector</span>
            <select value={draft.sector} onChange={(e) => setDraft({ ...draft, sector: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2.5 text-sm outline-none">
              <option>Residential</option><option>Commercial</option><option>Industrial</option>
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate-700 mb-1 block uppercase">Status</span>
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-2.5 text-sm outline-none">
              <option value="RUNNING">Running</option><option value="COMPLETED">Completed</option>
            </select>
          </label>

          <Field label="Scope of work" textarea rows={3} value={draft.scopeOfWork} onChange={(e) => setDraft({ ...draft, scopeOfWork: e.target.value })} />
          
          <div className="flex gap-2 mt-4">
             {editingId && <button type="button" onClick={cancelEdit} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md px-4 py-3 text-sm transition-colors">Cancel</button>}
             <button type="submit" className={`${editingId ? 'w-2/3' : 'w-full'} bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-md px-4 py-3 text-sm transition-colors`}>{editingId ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 && <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">No projects added yet.</div>}
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row gap-4 justify-between hover:border-amber-300 transition-colors">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-bold text-navy-950 text-lg">{p.clientName}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{p.sector}</span>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">{p.location} • ₹{p.valueCr} Cr</p>
              <p className="text-slate-500 text-sm">{p.scopeOfWork}</p>
            </div>
            <div className="flex flex-wrap md:flex-col gap-2 justify-end">
              <button onClick={() => startEdit(p)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded transition-colors">Edit</button>
              <button onClick={() => toggleStatus(p)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors">Toggle Status</button>
              <button onClick={() => remove(p.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------- Gallery ----------------
function GalleryTab({ token, items, refresh }) {
  const [caption, setCaption] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [editingId, setEditingId] = useState(null)

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setUploadStatus('idle')
  }

  const save = async (e) => {
    e.preventDefault()
    setUploadStatus('uploading')
    try {
      let url = preview
      if (selectedFile) {
        url = await uploadImage(token, selectedFile, 'ms-construction/gallery')
      } else if (!editingId) {
        setUploadStatus('idle')
        return
      }
      
      const payload = { url, caption, sortOrder }
      if (editingId) {
        // Find existing image to preserve URL if not replaced
        const existing = items.find(i => i.id === editingId)
        if (!selectedFile) payload.url = existing.url
        await updateGalleryImage(token, editingId, payload)
      } else {
        await addGalleryImage(token, payload)
      }

      setSelectedFile(null)
      setPreview(null)
      setCaption('')
      setSortOrder(0)
      setEditingId(null)
      setUploadStatus('idle')
      refresh()
    } catch (err) {
      console.error(err)
      setUploadStatus('error')
    }
  }

  const startEdit = (img) => {
    setEditingId(img.id)
    setCaption(img.caption || '')
    setSortOrder(img.sortOrder || 0)
    setPreview(img.url)
    setSelectedFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setCaption('')
    setSortOrder(0)
    setPreview(null)
    setSelectedFile(null)
  }

  const remove = async (id) => { await deleteGalleryImage(token, id); refresh() }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 className="font-bold text-navy-950 text-lg mb-4">{editingId ? 'Edit Image' : 'Upload Image'}</h2>
          
          <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all relative overflow-hidden mb-4 group">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">📷</div>
                <p className="text-slate-600 font-medium text-sm">Click to select image</p>
                <p className="text-slate-400 text-xs mt-1">Direct upload to Cloudinary</p>
              </div>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
          </label>

          <Field label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          <Field label="Sort order" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />

          <div className="flex gap-2 mt-4">
            {editingId && <button type="button" onClick={cancelEdit} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md px-4 py-3 text-sm transition-colors">Cancel</button>}
            <button
              type="submit"
              disabled={(!selectedFile && !editingId) || uploadStatus === 'uploading'}
              className={`${editingId ? 'w-2/3' : 'w-full'} bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold rounded-md px-4 py-3 text-sm transition-colors`}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Save Image'}
            </button>
          </div>
          {uploadStatus === 'error' && <p className="text-red-600 text-xs mt-2 text-center">Upload failed. Check console.</p>}
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((img) => (
            <div key={img.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group">
              <div className="relative aspect-[4/3]">
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={() => startEdit(img)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded shadow-lg transform scale-95 group-hover:scale-100 transition-all">Edit</button>
                   <button onClick={() => remove(img.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded shadow-lg transform scale-95 group-hover:scale-100 transition-all">Delete</button>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 truncate">{img.caption || 'No caption'}</p>
                <p className="text-xs text-slate-400">Order: {img.sortOrder}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { replyQuery } from '../api/client'

// ---------------- Queries ----------------
function QueriesTab({ token }) {
  const [items, setItems] = useState([])
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyForm, setReplyForm] = useState({ subject: 'RE: Your Inquiry - MS Construction', message: '' })
  const [replyStatus, setReplyStatus] = useState('idle')

  const load = () => getQueries(token).then(setItems)
  useEffect(() => { load() }, [])

  const read = async (id) => { await markQueryRead(token, id); load() }
  const remove = async (id) => { await deleteQuery(token, id); load() }
  
  const startReply = (q) => {
    setReplyingTo(q)
    setReplyForm({ subject: 'RE: Your Inquiry - MS Construction', message: `\n\n\n--- Original Message ---\n${q.message}` })
  }

  const sendReply = async (e) => {
    e.preventDefault()
    setReplyStatus('sending')
    try {
      await replyQuery(token, replyingTo.id, replyForm)
      setReplyStatus('idle')
      setReplyingTo(null)
      load()
    } catch {
      setReplyStatus('error')
    }
  }

  if (replyingTo) {
    return (
      <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-navy-950 text-xl mb-4">Reply to {replyingTo.name}</h2>
        <form onSubmit={sendReply}>
          <Field label="To Email" value={replyingTo.email} disabled />
          <Field label="Subject" value={replyForm.subject} onChange={(e) => setReplyForm({...replyForm, subject: e.target.value})} />
          <Field label="Message" textarea rows={8} value={replyForm.message} onChange={(e) => setReplyForm({...replyForm, message: e.target.value})} />
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => setReplyingTo(null)} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-md transition-colors">Cancel</button>
            <button type="submit" disabled={replyStatus === 'sending'} className="px-6 py-2 bg-amber-500 hover:bg-amber-400 font-bold rounded-md transition-colors">
              {replyStatus === 'sending' ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
          {replyStatus === 'error' && <p className="text-red-600 text-sm mt-4">Failed to send reply.</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-4">
      {items.length === 0 && <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">No queries received yet.</div>}
      {items.map((q) => (
        <div key={q.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 ${!q.readByAdmin ? 'border-amber-300 ring-1 ring-amber-300 ring-offset-2' : 'border-slate-200'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-navy-950 text-lg">{q.name}</h3>
              {!q.readByAdmin && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 animate-pulse">New</span>}
              {q.replied && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Replied</span>}
              <span className="text-xs text-slate-400 ml-auto">{new Date(q.submittedAt).toLocaleString()}</span>
            </div>
            <div className="flex gap-4 text-sm text-slate-600 mb-4 font-medium">
              <span>✉️ {q.email || 'N/A'}</span>
              <span>📞 {q.phone}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
              {q.message}
            </div>
          </div>
          <div className="flex md:flex-col gap-2 justify-start shrink-0">
            <button onClick={() => startReply(q)} disabled={!q.email} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-700 text-sm font-semibold rounded-md transition-colors w-full">Reply</button>
            {!q.readByAdmin && <button onClick={() => read(q.id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-md transition-colors w-full">Mark Read</button>}
            <button onClick={() => remove(q.id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-md transition-colors w-full">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
// ---------------- Revisions ----------------
function RevisionsTab({ token }) {
  const [items, setItems] = useState([])
  const load = () => getRevisions(token).then(setItems)
  useEffect(() => { load() }, [])

  const restore = async (rev) => {
    if (!window.confirm(`Are you sure you want to restore this ${rev.entityType} revision? Current data will be overwritten.`)) return;
    
    try {
      const parsedData = JSON.parse(rev.entitySnapshotJson)
      switch (rev.entityType) {
        case 'ThemeSettings': await updateTheme(token, parsedData); break;
        case 'HeroSection': await updateHero(token, parsedData); break;
        case 'CompanyInfo': await updateCompanyInfo(token, parsedData); break;
        case 'StatisticItem': await updateStatistic(token, rev.entityId, parsedData); break;
        case 'WhyChooseItem': await updateWhyChoose(token, rev.entityId, parsedData); break;
        case 'CommitmentItem': await updateCommitment(token, rev.entityId, parsedData); break;
        case 'NavigationItem': await updateNavigation(token, rev.entityId, parsedData); break;
        case 'ServiceItem': await updateService(token, rev.entityId, parsedData); break;
        case 'Project': await updateProject(token, rev.entityId, parsedData); break;
        case 'GalleryImage': await updateGalleryImage(token, rev.entityId, parsedData); break;
        default: alert('Restore not supported for this entity type.'); return;
      }
      alert('Successfully restored!')
      load() // Refresh revisions list so the new save is visible
    } catch (err) {
      console.error(err)
      alert('Failed to restore revision.')
    }
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm font-medium mb-6">
        ℹ️ Revisions track changes made to singletons and entities. This allows viewing past states and restoring them.
      </div>
      {items.length === 0 && <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">No revisions found.</div>}
      {items.map((rev) => (
        <div key={rev.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
            <div>
              <span className="font-bold text-navy-950 text-lg mr-2">{rev.entityType}</span>
              <span className="text-slate-400 text-sm">ID: {rev.entityId}</span>
            </div>
            <div className="flex items-center gap-4 text-right">
              <button onClick={() => restore(rev)} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-sm font-bold transition-colors">Restore Version</button>
              <div>
                <div className="text-sm font-medium text-slate-600">By {rev.changedBy}</div>
                <div className="text-xs text-slate-400">{new Date(rev.changedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
              {JSON.stringify(JSON.parse(rev.entitySnapshotJson), null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  )
}
