import { Link } from 'react-router-dom'

function GemM() {
  return (
    <svg
      viewBox="0 0 12 14"
      style={{ display: 'inline', width: '0.75em', height: '0.875em', verticalAlign: 'middle', position: 'relative', top: '-0.05em' }}
      aria-hidden="true"
      fill="none"
      stroke="#4ade80"
      strokeWidth="0.9"
      strokeLinejoin="round"
    >
      {/* outer shape */}
      <polygon points="3,0 9,0 12,5 6,14 0,5" />
      {/* girdle line */}
      <line x1="0" y1="5" x2="12" y2="5" />
      {/* crown facets */}
      <line x1="3" y1="0" x2="6" y2="5" />
      <line x1="9" y1="0" x2="6" y2="5" />
    </svg>
  )
}

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-100 bg-bg border-b border-[#B87A0A]/20 px-4 sm:px-6 font-display" style={{ boxShadow: '0 2px 12px rgba(255,255,255,0.04)' }}>
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white font-rubik tracking-wider text-xl">
            Royal Si<GemM />ulator
          </span>
        </Link>
        <Link
          to="/browse"
          className="tracking-wide text-white/80 hover:text-[#B87A0A] transition-colors"
        >
          <span className="md:hidden">Browse</span>
          <span className="hidden md:inline">Browse Scenarios</span>
        </Link>
      </div>
    </nav>
  )
}
