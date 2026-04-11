import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText } from 'react-icons/pi'
import type { Scenario } from '../types/scenario'
import { pickPlaceholder } from '../utils/placeholder'

interface ScenarioModalProps {
  scenario: Scenario
  onClose: () => void
  onSpinAgain: () => void
}

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: '#D4920A',
  medium: '#7C3AED',
  hard: '#B81515',
}

export default function ScenarioModal({ scenario, onClose, onSpinAgain }: ScenarioModalProps) {
  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-card p-6 shadow-2xl z-200"
        style={{ background: 'rgb(19, 15, 12)', border: '1px solid rgba(74,222,128,0.35)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/40 hover:text-white text-xl leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        {/* thumbnail */}
        {scenario.thumbnail ? (
          <img
            src={scenario.thumbnail}
            alt={scenario.title}
            className="w-full h-65 object-cover rounded-lg mb-4"
          />
        ) : (
          <img
            src={pickPlaceholder(scenario.id)}
            alt="Spooky placeholder"
            className="w-full h-65 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-sm font-semibold uppercase tracking-widest text-sims-green mb-1">
          You got…
        </p>
        <h2 className="text-2xl font-extrabold mb-1 capitalize">{scenario.title}</h2>
        <p className="text-sm text-white/70 mb-3 flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5">
            {scenario.sourceType === 'film'
              ? <PiFilmSlate className="text-sims-green" size={14} />
              : <PiBookOpenText className="text-sims-green" size={14} />}
            {scenario.source} ({scenario.year})
          </span>
          {' · '}
          <span className="font-semibold" style={{ color: DIFFICULTY_COLOUR[scenario.difficulty] }}>
            {scenario.difficulty}
          </span>
        </p>
        <p className="text-base text-white/85 leading-relaxed mb-5">{scenario.description}</p>

        <div className="flex gap-3">
          <button
            onClick={onSpinAgain}
            className="flex-1 py-2 rounded-card font-bold text-sm btn-primary cursor-pointer text-bg"
          >
            Spin Again
          </button>
          <Link
            to={`/scenarios/${scenario.id}`}
            className="flex-1 py-2 rounded-card font-bold text-sm text-center border border-[#B87A0A]/50 hover:border-[#B87A0A] text-[#B87A0A] transition-colors"
          >
            View Scenario
          </Link>
        </div>
      </div>
    </div>
  )
}
