import { memo } from 'react'

export const AuroraText = memo(function AuroraText({
  children,
  className = '',
  colors = ['#E8C874', '#3B7A57', '#C9A24B', '#7cff9c'],
  speed = 1,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
    backgroundSize: '200% 200%',
    animationDuration: `${10 / speed}s`,
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span
        className="bg-clip-text text-transparent animate-aurora"
        style={gradientStyle}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
})
