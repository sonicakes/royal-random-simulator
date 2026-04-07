import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple, PiSlidersHorizontal, PiArrowUp, PiMagnifyingGlass } from 'react-icons/pi'
import ScenarioCard from '../components/ScenarioCard'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const allScenarios = scenariosData as Scenario[]

const allTags = Array.from(new Set(allScenarios.flatMap((s) => s.tags))).sort()

const PAGE_SIZE = 6

export default function BrowsePage() {
  const [search, setSearch] = useState('')
  const [sourceType, setSourceType] = useState<'all' | 'film' | 'book' | 'tv'>('all')
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let list = allScenarios

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((s) => s.title.toLowerCase().includes(q))
    }
    if (sourceType !== 'all') {
      list = list.filter((s) => s.sourceType === sourceType)
    }
    if (difficulty !== 'all') {
      list = list.filter((s) => s.difficulty === difficulty)
    }
    if (selectedTags.length > 0) {
      list = list.filter((s) => selectedTags.every((t) => s.tags.includes(t)))
    }

    return list
  }, [search, sourceType, difficulty, selectedTags])

  // reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filtered])

  const visible = filtered.slice(0, visibleCount)

  // lazy load via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))
  }, [filtered.length])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore() },
      { rootMargin: '0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
      <h1 className="text-2xl font-extrabold text-white mb-6">Browse Scenarios</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-8">
        {/* Search + sort + filters toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-md">
            <PiMagnifyingGlass
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 z-100 border border-white/10 rounded-card pl-9 pr-4 py-2 text-base text-white placeholder-white/50 focus:outline-none focus:border-sims-green/50"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Toggle filters"
            className={`relative flex items-center gap-2 px-4 py-2 rounded-card border transition-colors cursor-pointer ${
              showFilters
                ? 'bg-sims-green/10 text-sims-green border-sims-green/40'
                : 'bg-white/5 text-white/50 border-white/10 hover:text-white/80 hover:border-white/30'
            }`}
          >
            <PiSlidersHorizontal size={16} />
            <span className="text-sm font-semibold">Filters</span>
            {(sourceType !== 'all' || difficulty !== 'all' || selectedTags.length > 0) && (
              <span className="absolute -top-1.5 -right-1.5 bg-sims-green text-bg text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {(sourceType !== 'all' ? 1 : 0) + (difficulty !== 'all' ? 1 : 0) + selectedTags.length}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <div className="flex flex-col gap-3 pt-1">
            {/* Source type + difficulty */}
            <div className="flex flex-wrap gap-2 items-center">
              {(['all', 'film', 'book', 'tv'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSourceType(v)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    sourceType === v
                      ? 'bg-sims-green text-bg border-sims-green'
                      : 'bg-transparent text-white/65 border-white/25 hover:border-white/50'
                  }`}
                >
                  {v === 'all' ? 'All types' : v === 'film'
                    ? <span className="flex items-center gap-1.5"><PiFilmSlate size={13} className="text-sims-green" />Film</span>
                    : v === 'book'
                    ? <span className="flex items-center gap-1.5"><PiBookOpenText size={13} className="text-sims-green" />Book</span>
                    : <span className="flex items-center gap-1.5"><PiTelevisionSimple size={13} className="text-sims-green" />TV</span>}
                </button>
              ))}

              <span className="text-white/20 text-xs mx-1">|</span>

              {(['all', 'easy', 'medium', 'hard'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setDifficulty(v)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                    difficulty === v
                      ? 'bg-sims-green text-bg border-sims-green'
                      : 'bg-transparent text-white/65 border-white/25 hover:border-white/50'
                  }`}
                >
                  {v === 'all' ? 'All difficulty' : v}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-sims-green/20 text-sims-green border-sims-green/50'
                      : 'bg-transparent text-white/60 border-white/25 hover:border-white/45'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-white/60 mb-4">
        {filtered.length} scenario{filtered.length !== 1 ? 's' : ''}
        {selectedTags.length > 0 && ` · tags: ${selectedTags.join(', ')}`}
      </p>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-white/60 text-base">No scenarios match those filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      )}

      {/* Lazy load sentinel */}
      {visibleCount < filtered.length && <div ref={sentinelRef} className="h-8 mt-4" />}

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 p-3 rounded-card border border-sims-green/40 bg-bg text-sims-green hover:border-sims-green hover:bg-sims-green/10 transition-colors cursor-pointer shadow-lg z-50"
        >
          <PiArrowUp size={20} />
        </button>
      )}
    </main>
  )
}
