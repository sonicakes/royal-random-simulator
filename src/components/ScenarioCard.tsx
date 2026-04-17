import { Link } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple } from 'react-icons/pi'
import type { Scenario } from '../types/scenario'
import { pickPlaceholder } from '../utils/placeholder'

const DIFFICULTY_CLASS: Record<Scenario['difficulty'], string> = {
  easy: 'text-diff-easy',
  medium: 'text-diff-medium',
  hard: 'text-diff-hard',
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
  if (sourceType === 'film') return <PiFilmSlate className="text-ochre" size={14} />
  if (sourceType === 'book') return <PiBookOpenText className="text-ochre" size={14} />
  return <PiTelevisionSimple className="text-ochre" size={14} />
}

export default function ScenarioCard({ scenario, index = 0 }: ScenarioCardProps) {
  const thumb = scenario.thumbnail || pickPlaceholder(scenario.id)
  const slashLeft = index % 2 === 0

  const tags = (
    <div className="flex flex-wrap gap-1 mt-2">
      {scenario.tags.map((tag) => (
        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagClass(scenario.sourceType)}`}>
          {tag}
        </span>
      ))}
    </div>
  )

  return (
    <div className="pt-px overflow-hidden">
    <div className="animate-[fadeIn_1.5s_ease-out]">
    <Link
      to={`/scenarios/${scenario.id}`}
      className={`group flex flex-col overflow-hidden transition-all duration-200 hover:rotate-2 z-90 bg-bg border-b-2 border-ochre-btn/[0.15] ${slashLeft ? 'clip-slash-left' : 'clip-slash-right'}`}
    >
      <img src={thumb} alt={scenario.title} className="w-full h-90 object-cover" />
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-lg font-display group-hover:text-ochre transition-colors">{scenario.title}</h3>
        <p className="text-sm text-white/65 flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5">
            <SourceIcon sourceType={scenario.sourceType} />
            {scenario.year}
          </span>
          {' · '}
          <span className={`font-semibold ${DIFFICULTY_CLASS[scenario.difficulty]}`}>{scenario.difficulty}</span>
        </p>
        <p className="text-sm text-white/75 leading-relaxed mt-1 line-clamp-2">{scenario.description}</p>
        {tags}
      </div>
    </Link>
    </div>
    </div>
  )
}
