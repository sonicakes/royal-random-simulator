type PlumbobColor = 'green' | 'purple' | 'amber'

interface PlumbobProps {
  size?: number
  color?: PlumbobColor
}

const palettes = {
  green: {
    ga: ['#7FE87A', '#1D9E75'],
    gb: ['#1D9E75', '#04342C'],
    gc: ['#9FE1CB', '#0F6E56'],
    stroke: '#085041',
    shadow: '#1D9E75',
  },
  purple: {
    ga: ['#AFA9EC', '#534AB7'],
    gb: ['#534AB7', '#26215C'],
    gc: ['#CECBF6', '#3C3489'],
    stroke: '#26215C',
    shadow: '#534AB7',
  },
  amber: {
    ga: ['#FAC775', '#BA7517'],
    gb: ['#BA7517', '#412402'],
    gc: ['#FAEEDA', '#854F0B'],
    stroke: '#412402',
    shadow: '#BA7517',
  },
}

export default function Plumbob({ size = 120, color = 'green' }: PlumbobProps) {
  const p = palettes[color] ?? palettes.green
  const id = color

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 280"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`ga-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.ga[0]} />
          <stop offset="100%" stopColor={p.ga[1]} />
        </linearGradient>
        <linearGradient id={`gb-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.gb[0]} />
          <stop offset="100%" stopColor={p.gb[1]} />
        </linearGradient>
        <linearGradient id={`gc-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.gc[0]} />
          <stop offset="100%" stopColor={p.gc[1]} />
        </linearGradient>
        <filter id={`soften-${id}`}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <style>{`
          @keyframes plumbob-bob {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          .plumbob-gem-${id} {
            animation: plumbob-bob 2.4s ease-in-out infinite;
            transform-origin: 200px 133px;
          }
          @media (prefers-reduced-motion: reduce) {
            .plumbob-gem-${id} { animation: none; }
          }
        `}</style>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx="200" cy="250" rx="30" ry="5"
        fill={p.shadow} opacity="0.15"
        filter={`url(#soften-${id})`}
      />

      {/* Gem */}
      <g className={`plumbob-gem-${id}`}>
        <polygon points="200,48 154,138 200,116 246,138" fill={`url(#ga-${id})`} />
        <polygon points="200,48 246,138 200,116 154,138" fill={`url(#gc-${id})`} opacity="0.5" />
        <line x1="200" y1="48"  x2="200" y2="116" stroke={p.stroke} strokeWidth="0.7" opacity="0.5" />
        <line x1="154" y1="138" x2="246" y2="138" stroke={p.stroke} strokeWidth="0.7" opacity="0.35" />
        <polygon points="154,138 200,116 200,218" fill={`url(#gb-${id})`} />
        <polygon points="246,138 200,116 200,218" fill={`url(#ga-${id})`} opacity="0.65" />
        <line x1="200" y1="116" x2="200" y2="218" stroke={p.stroke} strokeWidth="0.7" opacity="0.4" />
        <polygon
          points="200,48 246,138 200,218 154,138"
          fill="none" stroke={p.stroke} strokeWidth="1.5" strokeLinejoin="round"
        />
        <polygon points="200,48 222,105 200,116 178,105" fill="white" opacity="0.15" />
      </g>
    </svg>
  )
}
