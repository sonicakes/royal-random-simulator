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

const DIFFICULTY_CLASS: Record<Scenario['difficulty'], string> = {
  easy: 'text-diff-easy',
  medium: 'text-diff-medium',
  hard: 'text-diff-hard',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md z-200 pt-px overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="shadow-modal">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#B87A0A] hover:text-[#D4920A] text-4xl leading-none cursor-pointer font-bold z-[300]" style={{ textShadow: '0 2px 8px #080f14, 0 0 12px #080f14' }}
          aria-label="Close"
        >
          ×
        </button>
        <div className="relative p-6 bg-band outline outline-1 outline-ochre-btn/35 clip-slash-left">

        {/* thumbnail */}
        {scenario.thumbnail ? (
          <img
            src={scenario.thumbnail}
            alt={scenario.title}
            className="w-full h-65 object-cover mb-4 mt-8 clip-slash-left"
          />
        ) : (
          <img
            src={pickPlaceholder(scenario.id)}
            alt="Spooky placeholder"
            className="w-full h-65 object-cover mb-4 mt-8 clip-slash-left"
          />
        )}

        <p className="text-sm font-semibold font-sub uppercase tracking-widest text-ochre mb-1">
          You got…
        </p>
        <h2 className="text-2xl font-display tracking-wide mb-1 capitalize">{scenario.title}</h2>
        <p className="text-sm text-white/70 mb-3 flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5">
            {scenario.sourceType === 'film'
              ? <PiFilmSlate className="text-ochre" size={14} />
              : <PiBookOpenText className="text-ochre" size={14} />}
            {scenario.source} ({scenario.year})
          </span>
          {' · '}
          <span className={`font-semibold ${DIFFICULTY_CLASS[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </p>
        <p className="text-sm text-white/85 leading-relaxed mb-5">{scenario.description}</p>

        <div className="flex gap-3">
          <Link
            to={`/scenarios/${scenario.id}`}
            className="flex-1 py-2 font-bold text-sm text-center btn-primary text-bg transition-colors font-sub"
          >
            View Scenario
          </Link>
          <button
            onClick={onSpinAgain}
            className="flex-1 py-2 font-bold text-sm cursor-pointer border border-[#B87A0A]/50 hover:border-[#B87A0A] text-[#B87A0A] transition-colors bg-transparent font-sub btn-skew"
          >
            Spin Again
          </button>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}
