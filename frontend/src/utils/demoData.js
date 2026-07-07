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
