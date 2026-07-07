import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { DUBAI_COMMUNITIES } from '../../utils/communities'
import { MagicCard } from '../magicui/magic-card'

const ACCENTS = ['#E8C874', '#7DA6FF', '#7EE8B0', '#F0A6A6', '#C9A24B', '#9E9EF0']

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
      .catch(() => setError('No live index data yet — showing tracked communities.'))
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gold-400">Communities</h2>
        {error && <span className="text-[11px] text-white/40">{error}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-auto pr-1">
        {DUBAI_COMMUNITIES.map((c, i) => {
          const level = levels[c.name]
          const isSelected = selected === c.name
          const accent = ACCENTS[i % ACCENTS.length]
          return (
            <MagicCard
              key={c.name}
              onClick={() => onSelect(c.name)}
              gradientColor={accent}
              className={`cursor-pointer p-3 transition-transform hover:-translate-y-0.5 ${
                isSelected ? 'ring-1 ring-gold-400/70' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
                <span className="text-xs font-medium text-white/90 truncate">{c.name}</span>
              </div>
              <div className="text-lg font-semibold text-white/95">
                {level ? level.toFixed(1) : '—'}
              </div>
              <div className="text-[10px] text-white/40">price index</div>
            </MagicCard>
          )
        })}
      </div>
    </div>
  )
}
