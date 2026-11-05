'use client'

import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('terra_admin_theme')
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
      }
    } catch {}
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('terra_admin_theme', next)
    } catch {}
  }

  // Check if already logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = '/admin'
        }
      })
      .catch(() => {})
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/admin'
        }, 150)
      } else {
        setError(data.message || 'Login gagal, periksa kembali username dan password')
        setLoading(false)
      }
    } catch {
      setError('Terjadi kendala jaringan saat mencoba login')
      setLoading(false)
    }
  }

  const fillDefaultCredentials = () => {
    setUsername('admin')
    setPassword('password123')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'light' ? 'admin-theme-light bg-slate-50 text-slate-900' : 'admin-theme-dark bg-zinc-950 text-zinc-100'} selection:bg-zinc-800 selection:text-white font-sans antialiased relative transition-colors duration-150`}>
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="space-y-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-base mx-auto shadow-sm">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Terra Admin
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Masuk untuk mengelola galeri dan paket petualangan
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Login berhasil! Mengalihkan ke workspace...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 pr-10 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="h-9 w-full rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50 mt-2"
          >
            {success ? 'Mengalihkan...' : loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        {/* Quick credential helper */}
        <div className="pt-4 border-t border-zinc-800 text-center space-y-1.5">
          <p className="text-[11px] text-zinc-500">Akun default:</p>
          <div className="inline-flex items-center gap-2 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 text-xs">
            <span className="font-mono text-zinc-400">admin / password123</span>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="font-medium text-zinc-200 hover:text-white underline cursor-pointer ml-1"
            >
              Gunakan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
