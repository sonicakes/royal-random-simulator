import { useRef, useEffect, useCallback, useState } from 'react'
import type { Scenario } from '../types/scenario'

const PALETTE = [
  '#16a34a',
  '#0369a1',
  '#7c3aed',
  '#eab308',
  '#e8143c',
  '#0f766e',
  '#be185d',
  '#15803d',
  '#1d4ed8',
]

interface SpinningWheelProps {
  scenarios: Scenario[]
  isSpinning: boolean
  onSpinEnd: (scenario: Scenario) => void
}

const SPIN_DURATION = 4000 // ms

export default function SpinningWheel({ scenarios, isSpinning, onSpinEnd }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(380)
  const rotationRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const targetRotationRef = useRef(0)
  const hasCalledEndRef = useRef(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize(Math.floor(entry.contentRect.width))
    })
    observer.observe(wrapper)
    setSize(Math.floor(wrapper.getBoundingClientRect().width))
    return () => observer.disconnect()
  }, [])

  const n = scenarios.length
  const segAngle = (2 * Math.PI) / n

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const size = canvas.width
      const cx = size / 2
      const cy = size / 2
      const radius = size / 2 - 4

      ctx.clearRect(0, 0, size, size)

      // segments
      for (let i = 0; i < n; i++) {
        const startA = rotation + i * segAngle - Math.PI / 2
        const endA = startA + segAngle

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, radius, startA, endA)
        ctx.closePath()
        ctx.fillStyle = PALETTE[i % PALETTE.length] ?? '#16a34a'
        ctx.fill()
        ctx.strokeStyle = '#080f14'
        ctx.lineWidth = 2
        ctx.stroke()

        // label
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation + i * segAngle + segAngle / 2 - Math.PI / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${Math.max(10, Math.min(14, radius / (n * 0.6)))}px Nunito, sans-serif`
        const label =
          scenarios[i]?.title && scenarios[i].title.length > 12
            ? scenarios[i].title.slice(0, 11) + '…'
            : (scenarios[i]?.title ?? '')
        ctx.fillText(label, radius - 10, 4)
        ctx.restore()
      }

      // outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = '#4ade80'
      ctx.lineWidth = 3
      ctx.stroke()

      // center circle
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, 2 * Math.PI)
      ctx.fillStyle = '#080f14'
      ctx.fill()
      ctx.strokeStyle = '#4ade80'
      ctx.lineWidth = 2
      ctx.stroke()

      // pointer at top
      const pCx = cx
      const pTip = 2
      const pBase = 22
      const pHalf = 10
      ctx.beginPath()
      ctx.moveTo(pCx, pTip)
      ctx.lineTo(pCx - pHalf, pBase)
      ctx.lineTo(pCx + pHalf, pBase)
      ctx.closePath()
      ctx.fillStyle = '#080f14'
      ctx.fill()
      ctx.strokeStyle = '#080f14'
      ctx.lineWidth = 1.5
      ctx.stroke()
    },
    [n, scenarios, segAngle],
  )

  // redraw on mount, scenario change, or resize
  useEffect(() => {
    drawWheel(rotationRef.current)
  }, [drawWheel, size])

  useEffect(() => {
    if (!isSpinning) return

    hasCalledEndRef.current = false
    startTimeRef.current = null

    // pick random target: at least 5 full rotations + random extra
    const extraSpins = 5 + Math.random() * 5
    const randomStop = Math.random() * 2 * Math.PI
    const totalRotation = extraSpins * 2 * Math.PI + randomStop
    targetRotationRef.current = rotationRef.current + totalRotation

    const animate = (ts: number) => {
      if (startTimeRef.current === null) startTimeRef.current = ts
      const elapsed = ts - startTimeRef.current
      const progress = Math.min(elapsed / SPIN_DURATION, 1)

      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      rotationRef.current =
        (targetRotationRef.current - totalRotation) + eased * totalRotation

      drawWheel(rotationRef.current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        rotationRef.current = targetRotationRef.current
        drawWheel(rotationRef.current)

        if (!hasCalledEndRef.current) {
          hasCalledEndRef.current = true
          // figure out which segment is at the pointer (top = -PI/2)
          const normalised = ((-(rotationRef.current) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          const winIdx = Math.floor(normalised / segAngle) % n
          onSpinEnd(scenarios[winIdx] ?? scenarios[0]!)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    }
  }, [isSpinning, drawWheel, n, scenarios, segAngle, onSpinEnd])

  return (
    <div ref={wrapperRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  )
}
