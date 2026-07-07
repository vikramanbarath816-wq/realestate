import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { DUBAI_COMMUNITIES } from '../../utils/communities'
import { demoOptimize, demoPortfolioRisk } from '../../utils/demoData'

export default function PortfolioBuilder() {
  const api = useApi()
  const [riskTolerance, setRiskTolerance] = useState(0.5)
  const [investment, setInvestment] = useState(500000)
  const [result, setResult] = useState(null)
  const [risk, setRisk] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  function handleOptimize() {
    // Show a result immediately so the button always feels responsive;
    // silently upgrade to live data if the backend answers.
    const demo = demoOptimize(riskTolerance, DUBAI_COMMUNITIES.map((c) => c.name))
    setResult(demo)
    setRisk(demoPortfolioRisk(investment))
    setIsDemo(true)
    setLoading(true)

    api.optimize(riskTolerance)
      .then(({ data }) => {
        if (!data?.allocation || !Object.keys(data.allocation).length) return
        setResult(data)
        setIsDemo(false)
        return api.portfolioRisk({
          portfolio: data.allocation,
          investment_amount: investment,
          horizon_years: 1,
          n_simulations: 5000,
        }).then(({ data: riskData }) => setRisk(riskData))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  async function handleDownload() {
    if (!result) return
    const { data } = await api.downloadReport({
      portfolio: result.allocation,
      investment_amount: investment,
      horizon_years: 1,
      n_simulations: 5000,
    })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio_report.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <h2 className="font-semibold text-gold-400 mb-2">Portfolio Builder</h2>

      <label className="text-xs text-white/60">Risk tolerance ({(riskTolerance * 100).toFixed(0)}%)</label>
      <input
        type="range" min="0" max="1" step="0.05"
        value={riskTolerance}
        onChange={(e) => setRiskTolerance(+e.target.value)}
        className="w-full accent-gold-500"
      />

      <label className="text-xs text-white/60 mt-2 block">Investment amount (AED)</label>
      <input
        type="number"
        className="input w-full"
        value={investment}
        onChange={(e) => setInvestment(+e.target.value)}
      />

      <button onClick={handleOptimize} disabled={loading} className="btn-primary w-full mt-3">
        {loading ? 'Optimizing…' : 'Build Optimal Portfolio'}
      </button>

      {result && (
        <div className="mt-3 text-sm space-y-2">
          {isDemo && <p className="text-[10px] text-white/30 uppercase tracking-wide">Demo data</p>}
          <div className="text-white/70">
            Expected return: <span className="text-gold-400">{(result.expected_return * 100).toFixed(2)}%</span>{' '}
            · Volatility: <span className="text-gold-400">{(result.expected_volatility * 100).toFixed(2)}%</span>
          </div>
          <ul className="space-y-1">
            {Object.entries(result.allocation).map(([c, w]) => (
              <li key={c} className="flex justify-between text-xs text-white/60">
                <span>{c}</span>
                <span>{(w * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
          {risk && (
            <div className="text-xs text-white/50 pt-2 border-t border-white/10">
              1yr VaR 95%: AED {risk.var_95?.toFixed(0)} · CVaR 95%: AED {risk.cvar_95?.toFixed(0)}
            </div>
          )}
          <button onClick={handleDownload} className="btn-primary w-full mt-2">
            Download PDF Report
          </button>
        </div>
      )}

      <p className="text-[10px] text-white/30 mt-3">
        Communities tracked: {DUBAI_COMMUNITIES.length}
      </p>
    </div>
  )
}
