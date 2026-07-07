import { useEffect, useRef } from 'react'

export function Particles({ className = '', quantity = 80, color = '#C9A24B', size = 1.4, staticity = 40, ease = 42 }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, dpr

    function resize() {
      dpr = window.devicePixelRatio || 1
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    function init() {
      particles.current = Array.from({ length: quantity }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * size + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      particles.current.forEach((p) => {
        p.x += p.vx + (mouse.current.x - p.x) / (staticity * ease)
        p.y += p.vy + (mouse.current.y - p.y) / (staticity * ease)
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      raf.current = requestAnimationFrame(draw)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    resize()
    init()
    draw()
    window.addEventListener('resize', () => { resize(); init() })
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [quantity, color, size, staticity, ease])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
