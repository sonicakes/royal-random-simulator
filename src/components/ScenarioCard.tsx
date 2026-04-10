import { Link } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple } from 'react-icons/pi'
import type { Scenario } from '../types/scenario'
import { pickPlaceholder } from '../utils/placeholder'

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: '#4ade80',
  medium: '#7A3AAD',
  hard: '#C05A28',
}

function tagClass(sourceType: Scenario['sourceType']) {
  if (sourceType === 'film') return 'bg-[#2ABDA8]/20 text-[#2ABDA8]'
  if (sourceType === 'book') return 'bg-sims-green/20 text-sims-green'
  if (sourceType === 'tv')   return 'bg-[#3A6B7A]/25 text-[#7CBDCC]'
  return 'bg-white/10 text-white/60'
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
        background: 'rgb(5, 15, 24)',
        border: '1px solid rgba(26,56,72,0.5)',
        boxShadow: '0 4px 20px rgba(42,189,168,0.12)',
        animation: 'fadeIn 1.5s ease-out',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(42,189,168,0.45)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,56,72,0.5)'
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
        <h3 className="text-lg group-hover:text-sims-green transition-colors">
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
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagClass(scenario.sourceType)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
