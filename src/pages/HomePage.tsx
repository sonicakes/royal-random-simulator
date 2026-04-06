import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import SpinningWheel from '../components/SpinningWheel'
import ScenarioModal from '../components/ScenarioModal'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const scenarios = scenariosData as Scenario[]

export default function HomePage() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Scenario | null>(null)

  const handleSpinEnd = useCallback((scenario: Scenario) => {
    setIsSpinning(false)
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#4ade80', '#16a34a', '#F5B800', '#15B8B0', '#ffffff'],
    })
    setResult(scenario)
  }, [])

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    setResult(null)
    setIsSpinning(true)
  }, [isSpinning])

  const handleSpinAgain = useCallback(() => {
    setResult(null)
    setIsSpinning(true)
  }, [])

  return (
    <main className="flex flex-col items-center flex-1 px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* Wheel column — 2/3 */}
        <div className="md:col-span-2 flex flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Wheel of <span className="line-through text-white/40">Fortune</span>{' '}
              <span style={{ fontFamily: "'Barriecito', cursive", color: '#B81515' }}>Torture</span>
            </h1>
            <div className="flex justify-center">
              <ol className="text-white/70 text-sm leading-relaxed flex flex-col gap-1">
                {['Spin the wheel to get a random horror scenario', 'Build the household described in the scenario', 'Follow the story beats in order and see how it plays out'].map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-sims-green font-bold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative w-full max-w-130">
            <SpinningWheel
              scenarios={scenarios}
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
            />
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="px-10 py-3 rounded-card font-extrabold text-lg btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-bg shadow-lg"
          >
            {isSpinning ? 'Spinning…' : 'Spin!'}
          </button>
        </div>

        {/* About card — 1/3 */}
        <div
          className="md:col-span-1 rounded-card border p-6 flex flex-col gap-5 self-stretch bg-bg"
          style={{  borderColor: 'rgba(255,255,255,0.25)', boxShadow: '0 2px 12px rgba(255,255,255,0.04)' }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">About</h2>
            <div className="text-white/70 text-sm leading-relaxed flex flex-col gap-3">
              
              <p>
                A companion project to{' '}<a href="https://cinefile-blog.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sims-green hover:underline">The Cinefile Blog</a>{' '}and{' '}
                <a href="https://open.spotify.com/show/5Ri7xJYDE9JDel4iCdl6LA?si=eb1e6971fd3d4844" target="_blank" rel="noopener noreferrer" className="text-sims-green hover:underline">The Kino Royale Podcast</a>,
          
              <span className='pl-1 font-bold'>The Royal Simulator</span> turns horror films and novels into playable Sims 4 scenarios — designed to recreate the logic and atmosphere of each source material inside the game.
            </p>
              <p>
                <span className="text-white uppercase tracking-wider text-xs font-bold">What each scenario includes</span><br />
                Full lot setup, household traits, daily rules, story beats, and multiple endings. Difficulty ratings run from easy one-night camps to hard multi-week deterioration arcs.
              </p>
              <p>
                <span className="text-white uppercase tracking-wider text-xs font-bold">How to use it</span><br />
                Spin the wheel to let chance decide what you play next, or search the library by title, difficulty, tag, or source type.
              </p>
             
            </div>
          </div>
          <div>
            <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-2">How it's made</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              A pilot project where the actual pilot is Claude Code — Anthropic's AI coding assistant. Film Lady supplies the design and dev briefs; Claude implements and refines. Glintmote mostly creates chaos, criticising the critic herself! Scenario images are generated by ChatGPT using prompts like <em>"generate an image illustrating The Shining in the style of Sims 4".</em> Placeholder img by Unsplash.
            </p>

          </div>

          <a
            href="/browse"
            className="text-sims-green text-sm font-bold self-end hover:underline mt-auto"
          >
            Browse all scenarios →
          </a>
        </div>
      </div>

      {result && (
        <ScenarioModal
          scenario={result}
          onClose={() => setResult(null)}
          onSpinAgain={handleSpinAgain}
        />
      )}
    </main>
  )
}
