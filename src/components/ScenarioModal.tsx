import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Scenario } from '../types/scenario'

interface ScenarioModalProps {
  scenario: Scenario
  onClose: () => void
  onSpinAgain: () => void
}

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: 'text-sims-green',
  medium: 'text-yellow-400',
  hard: 'text-horror-red',
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
        className="relative w-full max-w-md rounded-card p-6 shadow-2xl"
        style={{ background: '#0a1a12', border: '1px solid rgba(74,222,128,0.35)' }}
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
            className="w-full h-44 object-cover rounded-[8px] mb-4"
          />
        ) : (
          <div className="w-full h-44 rounded-[8px] bg-white/10 flex items-center justify-center text-white/30 text-xs tracking-wide mb-4">
            img goes here
          </div>
        )}

        <p className="text-xs font-semibold uppercase tracking-widest text-sims-green mb-1">
          You got…
        </p>
        <h2 className="text-2xl font-extrabold mb-1">{scenario.title}</h2>
        <p className="text-sm text-white/50 mb-3">
          {scenario.sourceType === 'film' ? '🎬' : '📖'} {scenario.source} ({scenario.year}) ·{' '}
          <span className={`font-semibold ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </p>
        <p className="text-sm text-white/70 leading-relaxed mb-5">{scenario.description}</p>

        <div className="flex gap-3">
          <button
            onClick={onSpinAgain}
            className="flex-1 py-2 rounded-card font-bold text-sm bg-btn-green hover:bg-btn-green-hover cursor-pointer transition-colors text-white"
          >
            Spin Again
          </button>
          <Link
            to={`/scenarios/${scenario.id}`}
            className="flex-1 py-2 rounded-card font-bold text-sm text-center border border-sims-green/50 hover:border-sims-green text-sims-green transition-colors"
          >
            View Scenario
          </Link>
        </div>
      </div>
    </div>
  )
}
