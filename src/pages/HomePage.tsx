import { useState, useCallback } from 'react'
import { PiCaretRight } from 'react-icons/pi'
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
      colors: ['#D4920A', '#B87A0A', '#B81515', '#7C3AED', '#ffffff'],
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
    <main className="flex flex-col items-center flex-1">
      <div className="w-full">
      <div
        className="w-full flex flex-col items-center px-4 pt-16 pb-24"
        style={{
          background: '#3D0E1A',
          clipPath: 'polygon(0 5%, 100% 0, 100% 93%, 0 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative diagonal plane — slate blue, top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '55%', height: '55%',
          background: '#2D4A6B',
          clipPath: 'polygon(50% 0, 100% 0, 100% 100%)',
          opacity: 0.18,
          pointerEvents: 'none',
        }} />
        {/* Decorative diagonal plane — dark ochre, bottom-left */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '45%', height: '45%',
          background: '#B87A0A',
          clipPath: 'polygon(0 30%, 100% 100%, 0 100%)',
          opacity: 0.14,
          pointerEvents: 'none',
        }} />
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center" style={{ position: 'relative', zIndex: 1 }}>

        {/* Wheel column — 2/3 */}
        <div className="md:col-span-2 flex flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Wheel of <span className="line-through text-white/40">Fortune</span>{' '}
              <span className='italic'>Torture</span>
            </h1>
            <div className="flex justify-center">
              <ol className="text-white/80 text-sm leading-relaxed flex flex-col gap-1">
                {['Spin the wheel to get a random horror scenario', 'Build the household described in the scenario', 'Follow the story beats in order and see how it plays out'].map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-btn-green font-bold shrink-0">{i + 1}.</span>
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
            className="px-10 py-3 font-display rounded-card tracking-widest text-xl btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-bg shadow-lg"
          >
            {isSpinning ? 'Spinning…' : 'Spin!'}
          </button>
        </div>

        {/* About card — 1/3 */}
        <div
          className="md:col-span-1 p-6 flex flex-col gap-5 self-stretch bg-bg"
          style={{
            clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
            boxShadow: '0 2px 12px rgba(255,255,255,0.04)',
            outline: '1px solid rgba(184,122,10,0.25)',
          }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-ochre/80 font-bold text-base uppercase tracking-widest">About</h2>
            <div className="text-white/80 text-sm leading-relaxed flex flex-col gap-3">
              
              <p>
                A companion project to{' '}<a href="https://cinefile-blog.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-btn-green hover:underline">The Cinefile Blog</a>{' '}and{' '}
                <a href="https://open.spotify.com/show/5Ri7xJYDE9JDel4iCdl6LA?si=eb1e6971fd3d4844" target="_blank" rel="noopener noreferrer" className="text-btn-green hover:underline">The Kino Royale Podcast</a>,{' '}
                <span className="font-bold">The Royal Simulator</span> turns horror films, tv shows and novels into playable Sims 4 scenarios — designed to recreate the logic and atmosphere of each source material inside the game. Each scenario includes full lot setup, household traits, daily rules, story beats, and multiple endings. Difficulty ratings run from easy one-night camps to hard multi-week deterioration arcs.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-ochre/80 font-bold text-base uppercase tracking-widest mb-2">How it's made</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              A pilot project where the actual pilot is Claude Code — Anthropic's AI coding assistant. Film Lady supplies the design and dev briefs; Claude implements and refines.
               Glintmote mostly creates chaos, criticising the critic herself! 
               Scenario images are generated by Gemini AI in the Eastern European Art House Film Poster style 
               (think  <a href="https://filmartgallery.com/collections/walerian-borowczyk-movie-posters">Walerian Borowczyk posters</a> & movie <a href="https://www.imdb.com/title/tt0066516/">Valerie & her week of wonders</a>), using prompts like <em>"generate an image illustrating The Shining in the style of Sims 4".</em> Placeholder img by Unsplash.
            </p>

          </div>

          <a
            href="/browse"
            className="text-btn-green tracking-wider font-display self-end hover:underline mt-auto"
          >
            Browse all <PiCaretRight size={14} className="inline" />
          </a>
        </div>
      </div>
      </div>{/* end clip-path wrapper */}
      </div>{/* end ochre bg wrapper */}

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
