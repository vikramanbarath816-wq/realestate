// Deterministic fake price-index generator, used as a fallback whenever the
// backend has no real repeat-sales data yet (e.g. before Supabase is loaded).
function seedFromString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function demoIndexSeries(community, months = 30) {
  const rand = mulberry32(seedFromString(community))
  const drift = 0.004 + rand() * 0.01
  const points = []
  let value = 90 + rand() * 20
  const now = new Date()
  for (let i = months; i >= 0; i--) {
    const noise = (rand() - 0.5) * 3
    value = Math.max(60, value * (1 + drift) + noise)
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    points.push({ date: d.toISOString().slice(0, 7), value: +value.toFixed(2) })
  }
  return points
}

export function demoLatestLevel(community) {
  const series = demoIndexSeries(community, 6)
  return series[series.length - 1].value
}

export function demoCorrelationMatrix(communities) {
  const n = communities.length
  const base = communities.map((c) => mulberry32(seedFromString(c)))
  const matrix = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1
      } else {
        const v = base[i]() * 2 - 1
        const value = +Math.max(-0.95, Math.min(0.95, v * 0.8)).toFixed(2)
        matrix[i][j] = value
        matrix[j][i] = value
      }
    }
  }
  return { communities, matrix }
}

export function demoEfficientFrontier(communities) {
  const rand = mulberry32(seedFromString(communities.join('|')))
  const minRisk = 4 + rand() * 2
  const maxRisk = 18 + rand() * 6
  const points = []
  for (let i = 0; i <= 30; i++) {
    const t = i / 30
    const risk = minRisk + (maxRisk - minRisk) * t
    const ret = 3 + 14 * Math.sqrt(t) + (rand() - 0.5) * 0.6
    points.push({ risk: +risk.toFixed(2), return: +ret.toFixed(2) })
  }
  return points
}

export function demoOptimize(riskTolerance, communities) {
  const rand = mulberry32(seedFromString(`opt-${riskTolerance}`))
  const n = Math.min(4, communities.length)
  const picked = [...communities].sort(() => rand() - 0.5).slice(0, n)
  const raw = picked.map(() => rand() + 0.2)
  const sum = raw.reduce((a, b) => a + b, 0)
  const allocation = {}
  picked.forEach((c, i) => {
    allocation[c] = +(raw[i] / sum).toFixed(3)
  })
  return {
    allocation,
    expected_return: 0.06 + riskTolerance * 0.12,
    expected_volatility: 0.05 + riskTolerance * 0.18,
  }
}

export function demoPortfolioRisk(investmentAmount) {
  const var95 = -investmentAmount * 0.08
  const cvar95 = -investmentAmount * 0.12
  return { var_95: var95, cvar_95: cvar95, var_99: var95 * 1.5, cvar_99: cvar95 * 1.5 }
}
