import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { forgotPassword } from '../api/client.js'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (isForgot) {
        await forgotPassword(email)
        setSuccess('If the email is registered, a reset link has been sent.')
        setEmail('')
      } else {
        await login(username, password)
        navigate('/admin/editor')
      }
    } catch (err) {
      setError(err.message || 'Operation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-xl p-8">
        <h1 className="text-xl font-bold text-navy-950 mb-1">
          {isForgot ? 'Reset Password' : 'Admin Login'}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {isForgot ? 'Enter your admin email to receive a reset link' : 'MS Construction content management'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isForgot ? (
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm font-medium">{success}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-950 hover:bg-navy-800 text-white font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-60"
          >
            {loading ? (isForgot ? 'Sending...' : 'Logging in...') : (isForgot ? 'Send Reset Link' : 'Log In')}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 items-center">
          <button 
            onClick={() => { setIsForgot(!isForgot); setError(''); setSuccess('') }}
            className="text-navy-950 text-sm font-semibold hover:text-amber-500 transition-colors"
          >
            {isForgot ? 'Back to login' : 'Forgot Password?'}
          </button>
          
          <a href="/" className="text-center text-slate-400 text-xs hover:text-amber-500">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
