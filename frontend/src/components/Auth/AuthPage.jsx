import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'

export default function AuthPage() {
  const api = useApi()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') {
        const { data } = await api.login(email, password)
        if (data.access_token) localStorage.setItem('access_token', data.access_token)
        navigate('/')
      } else {
        await api.signup(email, password)
        setMode('login')
      }
    } catch (e) {
      setError(e?.response?.data?.detail || 'Authentication failed. Check your Supabase configuration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gold-400 mb-4">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>

        <label className="text-xs text-white/60">Email</label>
        <input
          type="email" required className="input w-full mb-3"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-xs text-white/60">Password</label>
        <input
          type="password" required className="input w-full mb-4"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-xs text-white/50 mt-3 w-full text-center hover:text-gold-400"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
