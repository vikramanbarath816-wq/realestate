const LISTINGS = [
  { community: 'Palm Jumeirah', title: 'Signature Beachfront Villa', price: 18500000, beds: 5, sqft: 7200, gradient: 'from-amber-500/40 to-ink-800', tag: 'Villa' },
  { community: 'Downtown Dubai', title: 'Burj Khalifa View Residence', price: 4200000, beds: 2, sqft: 1450, gradient: 'from-yellow-400/30 to-ink-800', tag: 'Apartment' },
  { community: 'Dubai Marina', title: 'Marina Promenade Tower Unit', price: 2650000, beds: 2, sqft: 1180, gradient: 'from-sky-500/30 to-ink-800', tag: 'Apartment' },
  { community: 'Dubai Hills Estate', title: 'Golf Course Family Villa', price: 6900000, beds: 4, sqft: 4100, gradient: 'from-emerald-500/30 to-ink-800', tag: 'Villa' },
  { community: 'Business Bay', title: 'Canal-Facing Corner Suite', price: 1980000, beds: 1, sqft: 850, gradient: 'from-fuchsia-500/25 to-ink-800', tag: 'Apartment' },
  { community: 'Jumeirah Village Circle', title: 'Modern Townhouse Cluster', price: 1450000, beds: 3, sqft: 2000, gradient: 'from-rose-500/25 to-ink-800', tag: 'Townhouse' },
]

function formatAED(n) {
  return `AED ${n.toLocaleString()}`
}

export default function Listings({ onSelect }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gold-400">Featured Listings</h2>
        <span className="text-[10px] text-white/30 uppercase tracking-wide">Demo data</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {LISTINGS.map((l) => (
          <button
            key={l.title}
            onClick={() => onSelect?.(l.community)}
            className="text-left rounded-lg overflow-hidden border border-white/10 hover:border-gold-500/50 transition-colors group"
          >
            <div className={`h-24 bg-gradient-to-br ${l.gradient} relative flex items-end p-2`}>
              <span className="text-[10px] bg-ink-900/70 text-gold-400 px-2 py-0.5 rounded-full">{l.tag}</span>
            </div>
            <div className="p-3 bg-ink-700/60">
              <p className="text-sm font-medium text-white/90 group-hover:text-gold-400 transition-colors">{l.title}</p>
              <p className="text-xs text-white/50 mb-2">{l.community}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gold-400 font-semibold">{formatAED(l.price)}</span>
                <span className="text-white/40">{l.beds} bd · {l.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
