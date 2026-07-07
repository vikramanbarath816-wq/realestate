import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import AuthPage from './components/Auth/AuthPage'
import Logo from './components/Logo'
import { AuroraText } from './components/magicui/aurora-text'
import { DotPattern } from './components/magicui/dot-pattern'
import { Particles } from './components/magicui/particles'
import { Meteors } from './components/magicui/meteors'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(201,162,75,0.18), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(59,90,158,0.22), transparent 60%), linear-gradient(180deg, #0B1420 0%, #0A121E 50%, #070C14 100%)',
        }}
      >
        <Particles quantity={90} color="#E8C874" size={1.1} />
        <Meteors number={14} />
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
