interface PlumbobSVGProps {
  size?: number
  className?: string
}

export default function PlumbobSVG({ size = 32, className = '' }: PlumbobSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 48"
      width={size}
      height={size * 1.2}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* top diamond face */}
      <polygon points="20,0 32,16 20,22 8,16" fill="#4ade80" />
      {/* left facet */}
      <polygon points="8,16 20,22 20,40" fill="#16a34a" />
      {/* right facet */}
      <polygon points="32,16 20,22 20,40" fill="#22c55e" />
      {/* bottom tip */}
      <polygon points="8,16 20,40 32,16 20,40 20,48" fill="#15803d" />
    </svg>
  )
}
