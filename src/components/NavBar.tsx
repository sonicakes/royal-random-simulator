import { Link } from 'react-router-dom'
import PlumbobSVG from './PlumbobSVG'

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-bg border-b border-white/10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <PlumbobSVG size={24} />
          <span className="font-extrabold text-sims-green tracking-tight text-lg leading-none">
            Royal Random <span className="uppercase">SIM</span>ulator
          </span>
        </Link>
        <Link
          to="/browse"
          className="text-sm font-semibold text-white/70 hover:text-sims-green transition-colors"
        >
          Browse Scenarios
        </Link>
      </div>
    </nav>
  )
}
