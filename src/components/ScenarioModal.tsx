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
  easy: '#2EAD3F',
  medium: '#7C3AED',
  hard: '#15B8B0',
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
        className="relative w-full max-w-md z-200"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingTop: '1px', overflow: 'hidden' }}
      >
      <div style={{ boxShadow: '3px 6px 16px rgba(212,146,10,0.18), -3px 6px 16px rgba(212,146,10,0.10)' }}>
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#B87A0A] hover:text-[#D4920A] text-4xl leading-none cursor-pointer font-bold z-[300]" style={{ textShadow: '0 2px 8px #080f14, 0 0 12px #080f14' }}
          aria-label="Close"
        >
          ×
        </button>
        <div
          className="relative p-6"
          style={{
            background: '#3D0E1A',
            outline: '1px solid rgba(184,122,10,0.35)',
            clipPath: 'polygon(0 20px, 100% 0, 100% 100%, 0 100%)',
          }}
        >

        {/* thumbnail */}
        {scenario.thumbnail ? (
          <img
            src={scenario.thumbnail}
            alt={scenario.title}
            className="w-full h-65 object-cover mb-4 mt-8"
            style={{ clipPath: 'polygon(0 20px, 100% 0, 100% 100%, 0 100%)' }}
          />
        ) : (
          <img
            src={pickPlaceholder(scenario.id)}
            alt="Spooky placeholder"
            className="w-full h-65 object-cover mb-4 mt-8"
            style={{ clipPath: 'polygon(0 20px, 100% 0, 100% 100%, 0 100%)' }}
          />
        )}

        <p className="text-sm font-semibold font-sub uppercase tracking-widest text-sims-green mb-1">
          You got…
        </p>
        <h2 className="text-2xl font-display tracking-wide mb-1 capitalize">{scenario.title}</h2>
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
        <p className="text-sm text-white/85 leading-relaxed mb-5">{scenario.description}</p>

        <div className="flex gap-3">
          <Link
            to={`/scenarios/${scenario.id}`}
            className="flex-1 py-2 font-bold text-sm text-center btn-primary text-bg transition-colors" style={{ fontFamily: 'var(--font-sub)' }}
          >
            View Scenario
          </Link>
          <button
            onClick={onSpinAgain}
            className="flex-1 py-2 font-bold text-sm cursor-pointer border border-[#B87A0A]/50 hover:border-[#B87A0A] text-[#B87A0A] transition-colors bg-transparent" style={{ fontFamily: 'var(--font-sub)', transform: 'skewX(-8deg)', boxShadow: '0 2px 8px rgba(255,255,255,0.08)' }}
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
