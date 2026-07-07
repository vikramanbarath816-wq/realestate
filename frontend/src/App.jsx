import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import AuthPage from './components/Auth/AuthPage'
import Aurora from './components/Backgrounds/Aurora'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-10 opacity-40">
        <Aurora colorStops={['#C9A24B', '#3B7A57', '#0B1F3A']} amplitude={0.8} blend={0.6} />
      </div>

      <nav className="p-4 flex items-center gap-4 border-b border-white/10 bg-ink-900/70 backdrop-blur">
        <Link to="/" className="text-gold-400 font-bold tracking-wide text-lg">
          DUBAI QUANT RE
        </Link>
        <span className="text-xs text-white/40">real estate portfolio engine</span>
        <Link to="/auth" className="ml-auto btn-primary text-sm">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  )
}
