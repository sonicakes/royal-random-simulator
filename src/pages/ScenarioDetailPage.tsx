import { useParams, useNavigate } from 'react-router-dom'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const scenarios = scenariosData as Scenario[]

const DIFFICULTY_COLOUR: Record<Scenario['difficulty'], string> = {
  easy: 'text-sims-green',
  medium: 'text-yellow-400',
  hard: 'text-horror-red',
}

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scenario = scenarios.find((s) => s.id === id)

  if (!scenario) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-white/40">Scenario not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sims-green text-sm hover:underline cursor-pointer">
          ← Go back
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-white/40 hover:text-sims-green transition-colors mb-6 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">{scenario.title}</h1>
        <p className="text-sm text-white/50">
          {scenario.sourceType === 'film' ? '🎬' : '📖'} {scenario.source} ({scenario.year}) ·{' '}
          <span className={`font-semibold ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </p>
      </div>

      {/* Thumbnail */}
      {scenario.thumbnail ? (
        <img
          src={scenario.thumbnail}
          alt={scenario.title}
          className="w-full aspect-video rounded-card object-cover mb-8"
        />
      ) : (
        <div
          className="w-full aspect-video rounded-card flex items-center justify-center text-white/30 text-xs tracking-wide mb-8"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          img goes here
        </div>
      )}

      {/* Description */}
      <p className="text-white/70 leading-relaxed mb-8">{scenario.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-sims-green/10 text-sims-green/70 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Household Members */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-sims-green mb-3">Household</h2>
        <div
          className="rounded-card overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 text-xs uppercase tracking-wider bg-white/5">
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Role</th>
                <th className="px-4 py-2 font-semibold">Traits</th>
              </tr>
            </thead>
            <tbody>
              {scenario.householdMembers.map((member, i) => (
                <tr
                  key={member.name}
                  className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
                >
                  <td className="px-4 py-3 font-semibold">{member.name}</td>
                  <td className="px-4 py-3 text-white/60">{member.role}</td>
                  <td className="px-4 py-3 text-white/50">{member.traits.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Goals */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-sims-green mb-3">Goals</h2>
        <ul className="space-y-2">
          {scenario.goals.map((goal, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/70">
              <span className="text-sims-green font-bold shrink-0">{i + 1}.</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Story Beats — timeline */}
      <section>
        <h2 className="text-lg font-bold text-sims-green mb-4">Story Beats</h2>
        <ol className="relative border-l-2 border-sims-green/20 space-y-0">
          {scenario.storyBeats.map((beat, i) => {
            const isLast = i === scenario.storyBeats.length - 1
            return (
              <li key={beat.step} className={`ml-5 ${isLast ? 'pb-0' : 'pb-6'}`}>
                {/* dot */}
                <span
                  className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                  style={{ background: '#080f14', border: '2px solid #4ade80', marginTop: '2px' }}
                >
                  {beat.step}
                </span>
                <p className="text-sm text-white/70 leading-relaxed pt-0.5">{beat.text}</p>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
