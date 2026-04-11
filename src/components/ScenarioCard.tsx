import { Link } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple } from 'react-icons/pi'
import type { Scenario } from '../types/scenario'
import { pickPlaceholder } from '../utils/placeholder'

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: '#D4920A',
  medium: '#7C3AED',
  hard: '#B81515',
}

function tagClass(sourceType: Scenario['sourceType']) {
  if (sourceType === 'film') return 'bg-[#B87A0A]/20 text-[#D4920A]'
  if (sourceType === 'book') return 'bg-[#5C1A2E]/30 text-[#C47A8A]'
  if (sourceType === 'tv')   return 'bg-[#2D4A6B]/30 text-[#7AADCC]'
  return 'bg-white/10 text-white/60'
}

interface ScenarioCardProps {
  scenario: Scenario
  index?: number
}

function SourceIcon({ sourceType }: { sourceType: Scenario['sourceType'] }) {
  if (sourceType === 'film') return <PiFilmSlate className="text-sims-green" size={14} />
  if (sourceType === 'book') return <PiBookOpenText className="text-sims-green" size={14} />
  return <PiTelevisionSimple className="text-sims-green" size={14} />
}

export default function ScenarioCard({ scenario, index = 0 }: ScenarioCardProps) {
  const diffColor = DIFFICULTY_COLOUR[scenario.difficulty]
  const thumb = scenario.thumbnail || pickPlaceholder(scenario.id)
  const isOffset = index % 3 === 2

  const sharedStyle = {
    background: 'rgb(12, 10, 8)',
    border: '1px solid rgba(26,56,72,0.5)',
    boxShadow: '0 4px 20px rgba(212,146,10,0.10)',
    animation: 'fadeIn 1.5s ease-out',
  }

  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,146,10,0.45)'
  }
  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,56,72,0.5)'
  }

  const tags = (
    <div className="flex flex-wrap gap-1 mt-2">
      {scenario.tags.map((tag) => (
        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagClass(scenario.sourceType)}`}>
          {tag}
        </span>
      ))}
    </div>
  )

  if (isOffset) {
    return (
      <Link
        to={`/scenarios/${scenario.id}`}
        className="group flex flex-col rounded-card overflow-hidden transition-all duration-200 z-90"
        style={sharedStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="relative">
          <img src={thumb} alt={scenario.title} className="w-full h-72 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'rgba(0,0,0,0.72)' }}>
            <h3 className="text-lg text-white group-hover:text-sims-green transition-colors">
              {scenario.title}
            </h3>
            <p className="text-sm text-white/65 flex gap-2 items-center mt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <SourceIcon sourceType={scenario.sourceType} />
                {scenario.year}
              </span>
              {' · '}
              <span className="font-semibold" style={{ color: diffColor }}>{scenario.difficulty}</span>
            </p>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-1 flex-1">
          <p className="text-sm text-white/75 leading-relaxed line-clamp-2">{scenario.description}</p>
          {tags}
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/scenarios/${scenario.id}`}
      className="group flex flex-col rounded-card overflow-hidden transition-all duration-200 hover:rotate-[2deg] z-90"
      style={sharedStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img src={thumb} alt={scenario.title} className="w-full h-60 object-cover" />
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-lg group-hover:text-sims-green transition-colors">{scenario.title}</h3>
        <p className="text-sm text-white/65 flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5">
            <SourceIcon sourceType={scenario.sourceType} />
            {scenario.year}
          </span>
          {' · '}
          <span className="font-semibold" style={{ color: diffColor }}>{scenario.difficulty}</span>
        </p>
        <p className="text-sm text-white/75 leading-relaxed mt-1 line-clamp-2">{scenario.description}</p>
        {tags}
      </div>
    </Link>
  )
}
