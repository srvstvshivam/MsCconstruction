const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export let onUnauthorized = null
export const setUnauthorizedCallback = (cb) => { onUnauthorized = cb }

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    if (onUnauthorized && !path.includes('/auth/login')) onUnauthorized()
    throw new Error(path.includes('/auth/login') ? 'Invalid username or password.' : 'Session expired, please log in again.')
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

// ---------- Public ----------
export const getSiteData = () => request('/api/public/site')
export const getPublicTeam = () => request('/api/public/team')
export const submitQuery = (data) => request('/api/public/contact-query', { method: 'POST', body: data })

// ---------- Admin auth ----------
export const adminLogin = (username, password) =>
  request('/api/admin/auth/login', { method: 'POST', body: { username, password } })

// ---------- Admin: draft (unpublished editor state, never shown on the public site) ----------
export const getAdminSiteData = (token) => request('/api/admin/site', { token })
export const getDraft = (token) => request('/api/admin/draft', { token })
export const saveDraft = (token, content) => request('/api/admin/draft', { method: 'PUT', body: content, token })
export const clearDraft = (token) => request('/api/admin/draft', { method: 'DELETE', token })

// ---------- Admin: singletons ----------
export const updateCompanyInfo = (token, data) => request('/api/admin/company-info', { method: 'PUT', body: data, token })
export const updateHero = (token, data) => request('/api/admin/hero', { method: 'PUT', body: data, token })
export const updateTheme = (token, data) => request('/api/admin/theme', { method: 'PUT', body: data, token })

// ---------- Admin: lists ----------
export const createStatistic = (token, data) => request('/api/admin/statistics', { method: 'POST', body: data, token })
export const updateStatistic = (token, id, data) => request(`/api/admin/statistics/${id}`, { method: 'PUT', body: data, token })
export const deleteStatistic = (token, id) => request(`/api/admin/statistics/${id}`, { method: 'DELETE', token })

export const createWhyChoose = (token, data) => request('/api/admin/why-choose', { method: 'POST', body: data, token })
export const updateWhyChoose = (token, id, data) => request(`/api/admin/why-choose/${id}`, { method: 'PUT', body: data, token })
export const deleteWhyChoose = (token, id) => request(`/api/admin/why-choose/${id}`, { method: 'DELETE', token })

export const createCommitment = (token, data) => request('/api/admin/commitments', { method: 'POST', body: data, token })
export const updateCommitment = (token, id, data) => request(`/api/admin/commitments/${id}`, { method: 'PUT', body: data, token })
export const deleteCommitment = (token, id) => request(`/api/admin/commitments/${id}`, { method: 'DELETE', token })

export const createNavigation = (token, data) => request('/api/admin/navigation', { method: 'POST', body: data, token })
export const updateNavigation = (token, id, data) => request(`/api/admin/navigation/${id}`, { method: 'PUT', body: data, token })
export const deleteNavigation = (token, id) => request(`/api/admin/navigation/${id}`, { method: 'DELETE', token })

export const createService = (token, data) => request('/api/admin/services', { method: 'POST', body: data, token })
export const updateService = (token, id, data) => request(`/api/admin/services/${id}`, { method: 'PUT', body: data, token })
export const deleteService = (token, id) => request(`/api/admin/services/${id}`, { method: 'DELETE', token })

export const createProject = (token, data) => request('/api/admin/projects', { method: 'POST', body: data, token })
export const updateProject = (token, id, data) => request(`/api/admin/projects/${id}`, { method: 'PUT', body: data, token })
export const deleteProject = (token, id) => request(`/api/admin/projects/${id}`, { method: 'DELETE', token })

export const addGalleryImage = (token, data) => request('/api/admin/gallery', { method: 'POST', body: data, token })
export const updateGalleryImage = (token, id, data) => request(`/api/admin/gallery/${id}`, { method: 'PUT', body: data, token })
export const deleteGalleryImage = (token, id) => request(`/api/admin/gallery/${id}`, { method: 'DELETE', token })

export const getTeam = (token) => request('/api/admin/team', { token })
export const createTeamMember = (token, data) => request('/api/admin/team', { method: 'POST', body: data, token })
export const updateTeamMember = (token, id, data) => request(`/api/admin/team/${id}`, { method: 'PUT', body: data, token })
export const deleteTeamMember = (token, id) => request(`/api/admin/team/${id}`, { method: 'DELETE', token })

// ---------- Admin: queries ----------
export const getQueries = (token) => request('/api/admin/queries', { token })
export const markQueryRead = (token, id) => request(`/api/admin/queries/${id}/mark-read`, { method: 'PUT', token })
export const replyQuery = (token, id, data) => request(`/api/admin/queries/${id}/reply`, { method: 'POST', body: data, token })
export const deleteQuery = (token, id) => request(`/api/admin/queries/${id}`, { method: 'DELETE', token })

// ---------- Admin: revisions ----------
export const getRevisions = (token, type, id) => {
    let url = '/api/admin/revisions';
    if (type && id) url += `?entityType=${type}&entityId=${id}`;
    return request(url, { token });
}

// ---------- Admin: media ----------
export const getMedia = (token) => request('/api/admin/media', { token })
export const deleteMedia = (token, id) => request(`/api/admin/media/${id}`, { method: 'DELETE', token })

export async function uploadImage(token, file, folder = 'ms-construction/general') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch(`${BASE_URL}/api/admin/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized()
    throw new Error('Session expired, please log in again.')
  }

  if (!res.ok) {
    let message = `Upload failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // response wasn't JSON (e.g. an unexpected server error page) - keep the generic message
    }
    throw new Error(message)
  }

  const data = await res.json()
  return data.url
}
