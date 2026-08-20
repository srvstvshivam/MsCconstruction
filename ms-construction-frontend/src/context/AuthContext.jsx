import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin, setUnauthorizedCallback } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ms_admin_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('ms_admin_username'))

  useEffect(() => {
    if (token) localStorage.setItem('ms_admin_token', token)
    else localStorage.removeItem('ms_admin_token')
  }, [token])

  const login = async (u, p) => {
    console.log('[AuthContext] Attempting login for:', u)
    const res = await adminLogin(u, p)
    console.log('[AuthContext] Login successful, setting token')
    setToken(res.token)
    setUsername(res.username)
    localStorage.setItem('ms_admin_token', res.token)
    localStorage.setItem('ms_admin_username', res.username)
  }

  const logout = () => {
    console.log('[AuthContext] Logging out')
    setToken(null)
    setUsername(null)
    localStorage.removeItem('ms_admin_token')
    localStorage.removeItem('ms_admin_username')
  }

  useEffect(() => {
    setUnauthorizedCallback(() => {
      logout()
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
