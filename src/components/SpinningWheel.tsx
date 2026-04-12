import { useRef, useEffect, useCallback, useState } from 'react'
import type { Scenario } from '../types/scenario'

const PALETTE = [
  '#5C1A2E',  // deep burgundy      (~330°) ↔ forest green
  '#1A6B3A',  // forest green        (~150°) ↔ burgundy
  '#B87A0A',  // ochre               (~38°)  ↔ slate blue
  '#2D4A6B',  // slate blue          (~218°) ↔ ochre
  '#0D7A7A',  // teal                (~180°) ↔ sienna
  '#6B3A1A',  // dark sienna         (~25°)  ↔ teal
  '#7C3AED',  // purple              (~270°) ↔ dark olive
  '#5A8A18',  // dark olive          (~88°)  ↔ purple
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

      // --- segments: solid fill + radial gradient overlay + white dividers ---
      for (let i = 0; i < n; i++) {
        const startA = rotation + i * segAngle - Math.PI / 2
        const endA = startA + segAngle
        const baseColor = PALETTE[i % PALETTE.length] ?? '#16a34a'

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, radius, startA, endA)
        ctx.closePath()
        ctx.fillStyle = baseColor
        ctx.fill()

        // darker-at-centre radial gradient overlay
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0,   'rgba(0,0,0,0.48)')
        grad.addColorStop(0.5, 'rgba(0,0,0,0.18)')
        grad.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, radius, startA, endA)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()

        // semi-transparent white dividers
        ctx.strokeStyle = 'rgba(255,255,255,0.18)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // --- inner accent ring at 60% radius ---
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.6, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(212,146,10,0.45)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // --- labels: Staatliches, uppercase ---
      for (let i = 0; i < n; i++) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation + i * segAngle + segAngle / 2 - Math.PI / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = 'rgba(255,255,255,0.92)'
        const fontSize = Math.max(11, Math.min(15, radius / (n * 0.55)))
        ctx.font = `${fontSize}px Staatliches, sans-serif`
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '1.5px'
        const raw = scenarios[i]?.title ?? ''
        const maxChars = radius < 150 ? 7 : radius < 200 ? 10 : 13
        const label = raw.length > maxChars + 1 ? raw.slice(0, maxChars) + '…' : raw
        ctx.fillText(label.toUpperCase(), radius - 10, 5)
        ctx.restore()
      }

      // --- outer ring with shadow glow ---
      ctx.shadowColor = 'rgba(212,146,10,0.9)'
      ctx.shadowBlur = 5
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = '#D4920A'
      ctx.lineWidth = 5
      ctx.stroke()

      // --- rim tick marks at segment boundaries ---
      for (let i = 0; i < n; i++) {
        const angle = rotation + i * segAngle - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * (radius - 10), cy + Math.sin(angle) * (radius - 10))
        ctx.lineTo(cx + Math.cos(angle) * (radius - 1),  cy + Math.sin(angle) * (radius - 1))
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // --- center medallion with plumbob gem ---
      const medalR = Math.max(16, size * 0.04)
      ctx.beginPath()
      ctx.arc(cx, cy, medalR, 0, 2 * Math.PI)
      ctx.fillStyle = '#0C0A08'
      ctx.fill()
      ctx.strokeStyle = '#D4920A'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // plumbob diamond (green, matching nav gem)
      const dH = medalR * 1.1
      const dW = medalR * 0.6
      ctx.beginPath()
      ctx.moveTo(cx,      cy - dH)           // top
      ctx.lineTo(cx - dW, cy - dH * 0.1)     // left
      ctx.lineTo(cx,      cy + dH)            // bottom
      ctx.lineTo(cx + dW, cy - dH * 0.1)     // right
      ctx.closePath()
      ctx.fillStyle = '#4ade80'
      ctx.fill()
      // crown facet highlight
      ctx.beginPath()
      ctx.moveTo(cx - dW, cy - dH * 0.1)
      ctx.lineTo(cx,      cy - dH)
      ctx.lineTo(cx + dW, cy - dH * 0.1)
      ctx.strokeStyle = 'rgba(134,239,172,0.7)'
      ctx.lineWidth = 0.8
      ctx.stroke()
      // girdle line
      ctx.beginPath()
      ctx.moveTo(cx - dW, cy - dH * 0.1)
      ctx.lineTo(cx + dW, cy - dH * 0.1)
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // --- constructivist elongated diamond pointer ---
      const pCx = cx
      ctx.beginPath()
      ctx.moveTo(pCx, 2)
      ctx.lineTo(pCx - 8, 14)
      ctx.lineTo(pCx, 30)
      ctx.lineTo(pCx + 8, 14)
      ctx.closePath()
      ctx.fillStyle = '#B81515'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.lineWidth = 1
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
