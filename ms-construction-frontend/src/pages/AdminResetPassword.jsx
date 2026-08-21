import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/client.js'

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.')
    }
    setLoading(true)
    try {
      await resetPassword(token, newPassword)
      setSuccess('Password has been reset successfully.')
      setTimeout(() => navigate('/admin/login'), 3000)
    } catch (err) {
      setError(err.message || 'Operation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-xl p-8">
        <h1 className="text-xl font-bold text-navy-950 mb-1">Set New Password</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your new admin password below.</p>

        {success ? (
          <div className="text-center">
            <p className="text-emerald-600 text-sm font-medium mb-4">{success}</p>
            <p className="text-slate-500 text-xs">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={!token}
              className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!token}
              className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-navy-950 hover:bg-navy-800 text-white font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col gap-2 items-center">
          <a href="/admin/login" className="text-center text-slate-400 text-xs hover:text-amber-500">
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  )
}
