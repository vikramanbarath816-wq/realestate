export default function Logo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C874" />
          <stop offset="100%" stopColor="#A8832F" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="9" stroke="url(#logoGrad)" strokeWidth="1.5" fill="#0F1B2B" />
      <path d="M11 27V16l4-3 4 3v11" stroke="url(#logoGrad)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 27V11l4.5-3.5L28 11v16" stroke="url(#logoGrad)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 27h24" stroke="url(#logoGrad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 16h3M23 20h3" stroke="url(#logoGrad)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
