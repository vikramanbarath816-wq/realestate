import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { DUBAI_COMMUNITIES } from '../../utils/communities'

export default function CommunityMap({ onSelect, selected }) {
  const api = useApi()
  const [levels, setLevels] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getAllIndices()
      .then(({ data }) => {
        const latest = {}
        Object.entries(data).forEach(([community, series]) => {
          const dates = Object.keys(series).sort()
          latest[community] = dates.length ? series[dates[dates.length - 1]] : null
        })
        setLevels(latest)
      })
      .catch(() => setError('Could not load community index data yet.'))
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gold-400">Community Map</h2>
        {error && <span className="text-xs text-white/40">{error}</span>}
      </div>
      <div className="relative flex-1 rounded-lg bg-ink-700/50 overflow-hidden">
        {DUBAI_COMMUNITIES.map((c) => {
          const level = levels[c.name]
          const isSelected = selected === c.name
          return (
            <button
              key={c.name}
              onClick={() => onSelect(c.name)}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group`}
            >
              <span
                className={`w-3 h-3 rounded-full transition-transform group-hover:scale-125 ${
                  isSelected ? 'bg-gold-400 scale-150 ring-2 ring-gold-400/50' : 'bg-gold-500/70'
                }`}
              />
              <span className="mt-1 text-[10px] whitespace-nowrap bg-ink-900/80 px-1.5 py-0.5 rounded text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                {c.name}{level ? ` · ${level.toFixed(1)}` : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
