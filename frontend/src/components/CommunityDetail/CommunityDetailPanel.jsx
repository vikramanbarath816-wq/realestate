import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApi } from '../../hooks/useApi'
import { demoIndexSeries } from '../../utils/demoData'

export default function CommunityDetailPanel({ community, onClose }) {
  const api = useApi()
  const [series, setSeries] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setSeries(null)
    setIsDemo(false)
    api.getIndex(community)
      .then(({ data }) => {
        const points = Object.entries(data.index)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, value]) => ({ date, value: +value.toFixed(2) }))
        if (points.length) setSeries(points)
        else {
          setSeries(demoIndexSeries(community))
          setIsDemo(true)
        }
      })
      .catch(() => {
        setSeries(demoIndexSeries(community))
        setIsDemo(true)
      })
  }, [community])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gold-400">{community}</h2>
        <button onClick={onClose} className="text-white/40 hover:text-white text-sm">✕</button>
      </div>
      {isDemo && <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Demo data</p>}
      {series && (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={series}>
            <CartesianGrid stroke="#ffffff1a" />
            <XAxis dataKey="date" hide />
            <YAxis tick={{ fontSize: 10, fill: '#ffffffaa' }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#0F1B2B', border: '1px solid #ffffff22' }} />
            <Line type="monotone" dataKey="value" stroke="#C9A24B" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
