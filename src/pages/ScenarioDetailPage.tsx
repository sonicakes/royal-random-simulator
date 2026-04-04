import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import LightboxGallery from '../components/LightboxGallery'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const playthroughModules = import.meta.glob('../data/playthroughs/*.md', { query: '?raw', import: 'default' })

function parsePlaythrough(raw: string): { content: string; screenshots: string[] } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { content: raw.trim(), screenshots: [] }
  const screenshots: string[] = []
  const section = match[1].match(/screenshots:\s*\n((?:\s+- .+\n?)+)/)
  if (section) {
    section[1].trim().split('\n').forEach((line) => {
      const m = line.match(/^\s*- (.+)$/)
      if (m) screenshots.push(m[1].trim())
    })
  }
  return { content: match[2].trim(), screenshots }
}

interface Playthrough {
  content: string
  screenshots: string[]
}

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

  const [playthrough, setPlaythrough] = useState<Playthrough | null>(null)

  useEffect(() => {
    const key = `../data/playthroughs/${id}.md`
    const loader = playthroughModules[key]
    if (!loader) { setPlaythrough(null); return }
    loader().then((raw) => {
      setPlaythrough(parsePlaythrough(raw as string))
    })
  }, [id])

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
        className="text-sm text-white/60 hover:text-sims-green transition-colors mb-6 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">{scenario.title}</h1>
        <p className="text-base text-white/70">
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
          className="w-full rounded-card object-contain mb-8"
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
      <p className="text-base text-white/85 leading-relaxed mb-8">{scenario.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-sims-green/10 text-sims-green/90 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Setup */}
      {scenario.setup && scenario.setup.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-sims-green mb-3">Setup</h2>
          <ul className="space-y-2">
            {scenario.setup.map((item, i) => (
              <li key={i} className="flex gap-3 text-base text-white/85">
                <span className="text-sims-green shrink-0 mt-1">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Household Members */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-sims-green mb-3">Household</h2>
        <div
          className="rounded-card overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/60 text-xs uppercase tracking-wider bg-white/5">
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
                  <td className="px-4 py-3 text-white/75">{member.role}</td>
                  <td className="px-4 py-3 text-white/65">{member.traits.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Goals */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-sims-green mb-3">Goals</h2>
        <ul className="space-y-2">
          {scenario.goals.map((goal, i) => (
            <li key={i} className="flex gap-3 text-base text-white/85">
              <span className="text-sims-green font-bold shrink-0">{i + 1}.</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Rules */}
      {scenario.rules && scenario.rules.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-sims-green mb-3">Rules</h2>
          <ul className="space-y-2">
            {scenario.rules.map((rule, i) => (
              <li key={i} className="flex gap-3 text-base text-white/85">
                <span className="text-sims-green font-bold shrink-0">{i + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Story Beats — timeline */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-sims-green mb-4">Story Beats</h2>
        <ol className="relative border-l-2 border-sims-green/20 space-y-0">
          {scenario.storyBeats.map((beat, i) => {
            const isLast = i === scenario.storyBeats.length - 1
            return (
              <li key={beat.step} className={`ml-5 ${isLast ? 'pb-0' : 'pb-6'}`}>
                {/* dot */}
                <span
                  className="absolute -left-3.25 flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                  style={{ background: '#080f14', border: '2px solid #4ade80', marginTop: '1.25px' }}
                >
                  {beat.step}
                </span>
                <p className="text-base text-white/85 leading-relaxed pt-0.5">{beat.text}</p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* How It Ends */}
      {scenario.endings && scenario.endings.length > 0 && (
        <section className="mb-8">
          {/* Title */}
          <h2 className="text-xl font-bold text-sims-green text-center mb-0">How It Ends</h2>

          {/* Connector — stem + horizontal branch + drops (hidden on mobile) */}
          <div className="hidden sm:block">
            {/* Stem */}
            <div className="flex justify-center">
              <div className="w-px h-4 bg-sims-green/40" />
            </div>
            {/* Branch */}
            <div className="relative">
              <div className="absolute top-0 left-[16.67%] right-[16.67%] h-px bg-sims-green/40" />
              <div className="grid grid-cols-3">
                {scenario.endings.map((e) => (
                  <div key={e.title} className="flex flex-col items-center pt-px">
                    <div className="w-px h-5 bg-sims-green/40" />
                    <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid rgba(74,222,128,0.4)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 sm:mt-0">
            {scenario.endings.map((ending) => (
              <div
                key={ending.title}
                className="rounded-card p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid rgba(74,222,128,0.4)' }}
              >
                <h3 className="font-bold text-base text-white mb-2">{ending.title}</h3>
                <p className="text-sm text-white/75 leading-relaxed">{ending.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playthrough journal */}
      {playthrough && (
        <section className="mt-2">
          <h2 className="text-xl font-bold text-sims-green mb-4">My Playthrough</h2>
          {playthrough.screenshots.length > 0 && (
            <LightboxGallery screenshots={playthrough.screenshots} alt="Playthrough screenshot" />
          )}
          <div className="playthrough-body text-base">
            <ReactMarkdown>{playthrough.content}</ReactMarkdown>
          </div>
        </section>
      )}
    </main>
  )
}
