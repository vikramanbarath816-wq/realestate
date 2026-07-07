import { useEffect, useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApi } from '../../hooks/useApi'
import { DUBAI_COMMUNITIES } from '../../utils/communities'
import { demoEfficientFrontier } from '../../utils/demoData'

export default function EfficientFrontierView() {
  const api = useApi()
  const [points, setPoints] = useState([])
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    api.getEfficientFrontier()
      .then(({ data }) => {
        if (data.frontier?.length) {
          setPoints(data.frontier.map((p) => ({ risk: +(p.risk * 100).toFixed(2), return: +(p.return * 100).toFixed(2) })))
        } else {
          setPoints(demoEfficientFrontier(DUBAI_COMMUNITIES.map((c) => c.name)))
          setIsDemo(true)
        }
      })
      .catch(() => {
        setPoints(demoEfficientFrontier(DUBAI_COMMUNITIES.map((c) => c.name)))
        setIsDemo(true)
      })
  }, [])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gold-400">Efficient Frontier</h2>
        {isDemo && <span className="text-[10px] text-white/30 uppercase tracking-wide">Demo data</span>}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#ffffff1a" />
          <XAxis dataKey="risk" name="Risk (vol %)" unit="%" tick={{ fontSize: 10, fill: '#ffffffaa' }} />
          <YAxis dataKey="return" name="Expected return" unit="%" tick={{ fontSize: 10, fill: '#ffffffaa' }} />
          <Tooltip contentStyle={{ background: '#0F1B2B', border: '1px solid #ffffff22' }} />
          <Scatter data={points} fill="#C9A24B" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
