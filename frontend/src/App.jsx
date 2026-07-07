import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import AuthPage from './components/Auth/AuthPage'
import Aurora from './components/Backgrounds/Aurora'
import Logo from './components/Logo'
import { AuroraText } from './components/magicui/aurora-text'
import { DotPattern } from './components/magicui/dot-pattern'

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

      <nav className="relative overflow-hidden px-5 py-3 flex items-center gap-3 border-b border-white/10 bg-ink-900/60 backdrop-blur-md">
        <DotPattern className="text-white/[0.06]" />
        <Link to="/" className="relative flex items-center gap-2.5 group">
          <Logo className="w-9 h-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-tight">
            <AuroraText className="font-extrabold tracking-wide text-lg">DUBAI QUANT RE</AuroraText>
            <span className="text-[10px] text-white/40 tracking-wide">real estate portfolio engine</span>
          </div>
        </Link>
        <Link to="/auth" className="relative ml-auto btn-primary text-sm shadow-lg shadow-gold-500/20">
          Login
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  )
}
