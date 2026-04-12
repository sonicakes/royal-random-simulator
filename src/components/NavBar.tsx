import { Link } from 'react-router-dom'

function GemM() {
  return (
    <svg
      viewBox="0 0 12 22"
      style={{ display: 'inline', width: '0.75em', height: '1.1em', verticalAlign: 'middle', position: 'relative', top: '-0.05em', filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.8)) drop-shadow(0 0 2px rgba(74,222,128,0.6))' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="reflGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* main body */}
      <polygon points="3,0 9,0 12,5 6,14 0,5" fill="#4ade80" />
      {/* crown highlight */}
      <polygon points="3,0 9,0 6,5" fill="#86efac" opacity="0.85" />
      {/* lower facet — darker */}
      <polygon points="0,5 12,5 6,14" fill="#16a34a" opacity="0.9" />
      {/* reflection — flipped triangle with gap, fading down */}
      <polygon points="6,17 0,22 12,22" fill="url(#reflGrad)" />
    </svg>
  )
}

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-100 bg-bg px-4 sm:px-6 font-display">
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white tracking-widest text-2xl uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Royal Si<GemM />ulator
          </span>
        </Link>
        <Link
          to="/browse"
          className="tracking-widest text-white/80 font-sub uppercase text-sm font-bold hover:text-[#B87A0A] transition-colors"
        >
          <span className="md:hidden">Browse</span>
          <span className="hidden md:inline">Browse Scenarios</span>
        </Link>
      </div>
    </nav>
  )
}
