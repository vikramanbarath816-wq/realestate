import { useMemo } from 'react'

export function Meteors({ number = 18 }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${5 + Math.random() * 5}s`,
      })),
    [number]
  )

  return (
    <>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor absolute top-0 h-0.5 w-0.5 rounded-full bg-gold-300 shadow-[0_0_0_1px_#ffffff10]"
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }}
        />
      ))}
    </>
  )
}
