import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { DUBAI_COMMUNITIES } from '../../utils/communities'
import { demoCorrelationMatrix } from '../../utils/demoData'

function colorFor(value) {
  // -1 -> red, 0 -> ink, 1 -> gold
  const t = (value + 1) / 2
  const r = Math.round(80 + t * (201 - 80))
  const g = Math.round(60 + t * (162 - 60))
  const b = Math.round(90 + t * (75 - 90))
  return `rgb(${r},${g},${b})`
}

export default function Heatmap({ onSelect }) {
  const api = useApi()
  const [matrix, setMatrix] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    api.getCorrelation()
      .then(({ data }) => {
        if (data.communities?.length >= 2) setMatrix(data)
        else {
          setMatrix(demoCorrelationMatrix(DUBAI_COMMUNITIES.map((c) => c.name)))
          setIsDemo(true)
        }
      })
      .catch(() => {
        setMatrix(demoCorrelationMatrix(DUBAI_COMMUNITIES.map((c) => c.name)))
        setIsDemo(true)
      })
  }, [])

  if (!matrix) return <div className="text-xs text-white/40">Loading correlation heatmap…</div>

  const { communities, matrix: values } = matrix

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gold-400">Correlation Heatmap</h2>
        {isDemo && <span className="text-[10px] text-white/30 uppercase tracking-wide">Demo data</span>}
      </div>
      <div className="overflow-auto">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `120px repeat(${communities.length}, 32px)` }}
        >
          <div />
          {communities.map((c) => (
            <div key={c} className="text-[9px] text-white/50 rotate-45 origin-bottom-left h-8">
              {c.slice(0, 8)}
            </div>
          ))}
          {communities.map((row, i) => (
            <FragmentRow key={row} row={row} i={i} communities={communities} values={values} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FragmentRow({ row, i, communities, values, onSelect }) {
  return (
    <>
      <div className="text-[10px] text-white/70 flex items-center pr-2 truncate">{row}</div>
      {communities.map((col, j) => (
        <div
          key={col}
          title={`${row} × ${col}: ${values[i][j].toFixed(2)}`}
          onClick={() => onSelect?.(row)}
          className="w-8 h-8 cursor-pointer rounded-sm"
          style={{ backgroundColor: colorFor(values[i][j]) }}
        />
      ))}
    </>
  )
}
