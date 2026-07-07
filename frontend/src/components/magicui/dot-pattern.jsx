export function DotPattern({ className = '', width = 18, height = 18, cx = 1, cy = 1, cr = 1 }) {
  const id = 'dot-pattern-nav'
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}
