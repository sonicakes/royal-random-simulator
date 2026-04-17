import { useState, useEffect, useCallback } from 'react'

interface LightboxGalleryProps {
  screenshots: string[]
  alt?: string
}

export default function LightboxGallery({ screenshots, alt = 'Screenshot' }: LightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const isOpen = activeIndex !== null
  const total = screenshots.length

  const close = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(() => setActiveIndex((i) => (i === null ? 0 : (i - 1 + total) % total)), [total])
  const next = useCallback(() => setActiveIndex((i) => (i === null ? 0 : (i + 1) % total)), [total])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close, prev, next])

  const cols = total === 1 ? 'grid-cols-1' : total === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <>
      {/* Thumbnail grid */}
      <div className={`grid ${cols} gap-2 mb-6`}>
        {screenshots.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="overflow-hidden rounded-card focus:outline-none focus:ring-2 focus:ring-ochre cursor-pointer"
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-28 object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92"
          onClick={close}
        >
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
            {activeIndex + 1} / {total}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-5 text-white/50 hover:text-white text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/50 hover:text-white text-3xl px-3 py-6 cursor-pointer"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={screenshots[activeIndex]}
            alt={`${alt} ${activeIndex + 1}`}
            className="max-w-full max-h-[85vh] rounded-card object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/50 hover:text-white text-3xl px-3 py-6 cursor-pointer"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
