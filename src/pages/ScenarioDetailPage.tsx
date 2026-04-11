import { useEffect, useState } from 'react'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple, PiArrowUp, PiCaretLeft } from 'react-icons/pi'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import LightboxGallery from '../components/LightboxGallery'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'
import { pickPlaceholder } from '../utils/placeholder'

const playthroughModules = import.meta.glob('../data/playthroughs/*.md', { query: '?raw', import: 'default' })

function parsePlaythrough(raw: string): { content: string; screenshots: string[] } {
  const normalised = raw.replace(/\r\n/g, '\n')
  const match = normalised.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
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
  easy: '#D4920A',
  medium: '#7C3AED',
  hard: '#B81515',
}

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scenario = scenarios.find((s) => s.id === id)

  const [playthrough, setPlaythrough] = useState<Playthrough | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <button onClick={() => navigate(-1)} className="mt-4 text-sims-green text-sm hover:underline cursor-pointer flex items-center gap-1 mx-auto">
          <PiCaretLeft size={14} /> Go back
        </button>
      </main>
    )
  }

  return (
    <>
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full relative z-10" style={{ background: 'rgba(12,10,8,0.97)' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-white/60 hover:text-[#B87A0A] transition-colors mb-6 flex items-center gap-1 cursor-pointer"
      >
        <PiCaretLeft size={14} /> Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">{scenario.title}</h1>
        <p className="text-base text-white/70 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 align-middle">
            {scenario.sourceType === 'film'
              ? <PiFilmSlate className="inline text-sims-green" size={16} />
              : scenario.sourceType === 'book'
              ? <PiBookOpenText className="inline text-sims-green" size={16} />
              : <PiTelevisionSimple className="inline text-sims-green" size={16} />}
            {scenario.source} ({scenario.year})
          </span>
          {' · '}
          <span className="font-semibold" style={{ color: DIFFICULTY_COLOUR[scenario.difficulty] }}>
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
        <img
          src={pickPlaceholder(scenario.id)}
          alt="Spooky placeholder"
          className="w-full rounded-card object-contain mb-8"
        />
      )}

      {/* Description */}
      <p className="text-base text-white/85 leading-relaxed mb-8">{scenario.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {scenario.tags.map((tag) => (
          <span
            key={tag}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              scenario.sourceType === 'film' ? 'bg-[#B87A0A]/20 text-[#D4920A]' :
              scenario.sourceType === 'book' ? 'bg-[#5C1A2E]/30 text-[#C47A8A]' :
              scenario.sourceType === 'tv'   ? 'bg-[#2D4A6B]/30 text-[#7AADCC]' :
              'bg-white/10 text-white/60'
            }`}
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
                <svg viewBox="0 0 12 14" fill="none" stroke="#D4920A" strokeWidth="1.2" strokeLinejoin="round" style={{ width: '0.7em', height: '0.85em', flexShrink: 0, marginTop: '0.3em' }}>
                  <polygon points="3,0 9,0 12,5 6,14 0,5" />
                  <line x1="0" y1="5" x2="12" y2="5" strokeOpacity="0.5" />
                </svg>
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
        <ol className="relative border-l-2 border-[#B87A0A]/20 space-y-0">
          {scenario.storyBeats.map((beat, i) => {
            const isLast = i === scenario.storyBeats.length - 1
            return (
              <li key={beat.step} className={`ml-5 ${isLast ? 'pb-0' : 'pb-6'}`}>
                {/* dot */}
                <span
                  className="absolute -left-3.25 flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold"
                  style={{ background: '#050F18', border: '2px solid #B87A0A', marginTop: '1.25px' }}
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
              <div className="w-px h-4 bg-[#B87A0A]/40" />
            </div>
            {/* Branch */}
            <div className="relative">
              <div className="absolute top-0 left-[16.67%] right-[16.67%] h-px bg-[#B87A0A]/40" />
              <div className="grid grid-cols-3">
                {scenario.endings.map((e) => (
                  <div key={e.title} className="flex flex-col items-center pt-px">
                    <div className="w-px h-5 bg-[#B87A0A]/40" />
                    <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid rgba(212,146,10,0.4)' }} />
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
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid rgba(212,146,10,0.4)' }}
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

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 p-3 rounded-card border border-[#B87A0A]/40 bg-bg text-[#B87A0A] hover:border-[#B87A0A] hover:bg-[#B87A0A]/10 transition-colors cursor-pointer shadow-lg z-[100]"
        >
          <PiArrowUp size={20} />
        </button>
      )}
    </>
  )
}
