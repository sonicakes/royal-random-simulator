import { Link } from 'react-router-dom'
import type { Scenario } from '../types/scenario'

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: 'text-sims-green',
  medium: 'text-yellow-400',
  hard: 'text-horror-red',
}

interface ScenarioCardProps {
  scenario: Scenario
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Link
      to={`/scenarios/${scenario.id}`}
      className="group flex flex-col rounded-card overflow-hidden transition-all duration-200"
      style={{
        background: '#0d1f16',
        border: '1px solid rgba(255,255,255,0.07)',
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
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-white/10 border-b border-white/10 flex items-center justify-center text-white/30 text-xs select-none tracking-wide">
          img goes here
        </div>
      )}

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-base leading-snug group-hover:text-sims-green transition-colors">
          {scenario.title}
        </h3>
        <p className="text-xs text-white/40">
          {scenario.sourceType === 'film' ? '🎬' : '📖'} {scenario.year} ·{' '}
          <span className={`font-semibold ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </p>
        <p className="text-xs text-white/55 leading-relaxed mt-1 line-clamp-2">
          {scenario.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {scenario.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-sims-green/10 text-sims-green/70 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
