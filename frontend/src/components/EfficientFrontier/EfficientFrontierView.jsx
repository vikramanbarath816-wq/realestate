import { useEffect, useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApi } from '../../hooks/useApi'

export default function EfficientFrontierView() {
  const api = useApi()
  const [points, setPoints] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getEfficientFrontier()
      .then(({ data }) => {
        setPoints(data.frontier.map((p) => ({ risk: +(p.risk * 100).toFixed(2), return: +(p.return * 100).toFixed(2) })))
      })
      .catch(() => setError('Need at least two communities with price history to build a frontier.'))
  }, [])

  return (
    <div className="card">
      <h2 className="font-semibold text-gold-400 mb-2">Efficient Frontier</h2>
      {error ? (
        <p className="text-xs text-white/40">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#ffffff1a" />
            <XAxis dataKey="risk" name="Risk (vol %)" unit="%" tick={{ fontSize: 10, fill: '#ffffffaa' }} />
            <YAxis dataKey="return" name="Expected return" unit="%" tick={{ fontSize: 10, fill: '#ffffffaa' }} />
            <Tooltip contentStyle={{ background: '#0F1B2B', border: '1px solid #ffffff22' }} />
            <Scatter data={points} fill="#C9A24B" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
