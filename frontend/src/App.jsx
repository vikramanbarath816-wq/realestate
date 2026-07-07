import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import AuthPage from './components/Auth/AuthPage'
import Aurora from './components/Backgrounds/Aurora'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-10 bg-ink-900">
        <div className="absolute inset-0 opacity-70">
          <Aurora colorStops={['#E8C874', '#3B7A57', '#0B1F3A']} amplitude={1.4} blend={0.7} />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, #0B1420 75%)' }}
        />
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
