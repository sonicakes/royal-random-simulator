import { Link } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple } from 'react-icons/pi'
import type { Scenario } from '../types/scenario'

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: '#4ade80',
  medium: '#F5B800',
  hard: '#B81515',
}

const PLACEHOLDERS = [
  '/images/placeholder/halloween.png',
  '/images/placeholder/knife.png',
  '/images/placeholder/reaper.png',
  '/images/placeholder/scream.png',
  '/images/placeholder/spooks.png',
]

function pickPlaceholder(id: string): string {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PLACEHOLDERS[hash % PLACEHOLDERS.length]
}

interface ScenarioCardProps {
  scenario: Scenario
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Link
      to={`/scenarios/${scenario.id}`}
      className="group flex flex-col rounded-card overflow-hidden transition-all duration-200 z-90"
      style={{
        background: 'rgb(8, 26, 32)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        animation: 'fadeIn 1.5s ease-out',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* thumbnail */}
      {scenario.thumbnail ? (
        <img
          src={scenario.thumbnail}
          alt={scenario.title}
          className="w-full h-60 object-cover"
        />
      ) : (
        <img
          src={pickPlaceholder(scenario.id)}
          alt="Spooky placeholder"
          className="w-full h-60 object-cover"
        />
      )}

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-lg leading-snug group-hover:text-sims-green transition-colors">
          {scenario.title}
        </h3>
        <p className="text-sm text-white/65 flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5">
            {scenario.sourceType === 'film'
              ? <PiFilmSlate className="text-sims-green" size={14} />
              : scenario.sourceType === 'book'
              ? <PiBookOpenText className="text-sims-green" size={14} />
              : <PiTelevisionSimple className="text-sims-green" size={14} />}
            {scenario.year}
          </span>
          {' · '}
          <span className="font-semibold" style={{ color: DIFFICULTY_COLOUR[scenario.difficulty] }}>
            {scenario.difficulty}
          </span>
        </p>
        <p className="text-sm text-white/75 leading-relaxed mt-1 line-clamp-2">
          {scenario.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {scenario.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-sims-green/25 text-sims-green font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
