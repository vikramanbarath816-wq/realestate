import { useRef } from 'react'

export function MagicCard({ children, className = '', onClick, gradientColor = '#C9A24B' }) {
  const ref = useRef(null)

  function onMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={onClick}
      className={`magic-card relative overflow-hidden rounded-xl border border-white/10 bg-ink-800/70 ${className}`}
      style={{ '--glow': gradientColor }}
    >
      <div className="magic-card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
