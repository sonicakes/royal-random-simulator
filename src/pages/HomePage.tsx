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
      colors: ['#4ade80', '#16a34a', '#e8143c', '#ffffff', '#fbbf24'],
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
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-10 gap-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sims-green mb-2">
          Spin the Wheel
        </h1>
        <p className="text-white/70 text-base">
          {scenarios.length} horror scenarios — which will you play?
        </p>
      </div>

      <div className="relative w-full max-w-[min(600px,90vw)]">
        <SpinningWheel
          scenarios={scenarios}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-10 py-3 rounded-card font-extrabold text-lg bg-btn-green hover:bg-btn-green-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white shadow-lg"
      >
        {isSpinning ? 'Spinning…' : 'Spin!'}
      </button>

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
