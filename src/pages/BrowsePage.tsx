import { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { useNavigationType } from 'react-router-dom'
import { PiFilmSlate, PiBookOpenText, PiTelevisionSimple, PiSlidersHorizontal, PiArrowUp, PiMagnifyingGlass } from 'react-icons/pi'
import ScenarioCard from '../components/ScenarioCard'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const allScenarios = scenariosData as Scenario[]

const allTags = Array.from(new Set(allScenarios.flatMap((s) => s.tags))).sort()

const PAGE_SIZE = 6
const STORAGE_KEY = 'browse-state'

export default function BrowsePage() {
  const navType = useNavigationType()

  const [search, setSearch] = useState('')
  const [sourceType, setSourceType] = useState<'all' | 'film' | 'book' | 'tv'>('all')
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollToRestore = useRef<number | null>(null)

  // Ref always holds latest state for the unmount snapshot (avoids stale closure)
  const stateRef = useRef({ search, sourceType, difficulty, selectedTags, visibleCount })
  useEffect(() => {
    stateRef.current = { search, sourceType, difficulty, selectedTags, visibleCount }
  })

  // Restore state on back navigation — useLayoutEffect so it runs before first paint
  useLayoutEffect(() => {
    if (navType !== 'POP') return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      setSearch(saved.search ?? '')
      setSourceType(saved.sourceType ?? 'all')
      setDifficulty(saved.difficulty ?? 'all')
      setSelectedTags(saved.selectedTags ?? [])
      setVisibleCount(saved.visibleCount ?? PAGE_SIZE)
      scrollToRestore.current = saved.scrollY ?? 0
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to saved position once the restored visibleCount has been committed to the DOM
  useLayoutEffect(() => {
    if (scrollToRestore.current === null) return
    const y = scrollToRestore.current
    scrollToRestore.current = null
    window.scrollTo(0, y)
  }, [visibleCount])

  // Save state to sessionStorage on unmount
  useEffect(() => {
    return () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...stateRef.current,
          scrollY: window.scrollY,
        }))
      } catch {}
    }
  }, [])

  const filtered = useMemo(() => {
    const diffOrder = { easy: 0, medium: 1, hard: 2 }
    let list = [...allScenarios].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty])

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

  // Tags available in results before tag filtering — keeps selected tags selectable even when narrowing
  const relevantTags = useMemo(() => {
    const diffOrder = { easy: 0, medium: 1, hard: 2 }
    let base = [...allScenarios].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty])
    if (search.trim()) {
      const q = search.toLowerCase()
      base = base.filter((s) => s.title.toLowerCase().includes(q))
    }
    if (sourceType !== 'all') base = base.filter((s) => s.sourceType === sourceType)
    if (difficulty !== 'all') base = base.filter((s) => s.difficulty === difficulty)
    return Array.from(new Set(base.flatMap((s) => s.tags))).sort()
  }, [search, sourceType, difficulty])

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
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="w-full">

      {/* Full-width diagonal filter strip */}
      <div className="bg-band clip-band-browse pb-15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <h1 className="text-2xl font-extrabold text-ochre mb-6">Browse Scenarios</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-4">
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
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
              className="w-full z-100 border border-white/10 pl-9 pr-4 py-2 text-base text-white placeholder-white/50 focus:outline-none focus:border-ochre/50 bg-ochre-btn/10 font-sub btn-skew"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Toggle filters"
            className={`relative flex items-center gap-2 px-4 py-2 border transition-colors cursor-pointer font-sub font-bold btn-skew ${
              showFilters
                ? 'border-[#B87A0A] text-[#B87A0A] bg-[#B87A0A]/10'
                : 'border-[#B87A0A]/50 text-[#B87A0A] bg-transparent hover:border-[#B87A0A]'
            }`}
          >
            <PiSlidersHorizontal size={16} />
            <span className="text-sm">Filters</span>
            {(sourceType !== 'all' || difficulty !== 'all' || selectedTags.length > 0) && (
              <span className="absolute -top-1.5 -right-1.5 bg-ochre text-bg text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
                  onClick={() => { setSourceType(v); setVisibleCount(PAGE_SIZE) }}
                  className={`px-3 py-1 text-sm font-semibold border transition-colors cursor-pointer btn-skew ${
                    sourceType === v
                      ? 'bg-ochre text-bg border-ochre'
                      : 'bg-transparent text-white/65 border-white/25 hover:border-white/50'
                  }`}
                >
                  {v === 'all' ? 'All types' : v === 'film'
                    ? <span className="flex items-center gap-1.5"><PiFilmSlate size={13} className="text-ochre" />Film</span>
                    : v === 'book'
                    ? <span className="flex items-center gap-1.5"><PiBookOpenText size={13} className="text-ochre" />Book</span>
                    : <span className="flex items-center gap-1.5"><PiTelevisionSimple size={13} className="text-ochre" />TV</span>}
                </button>
              ))}

              <span className="text-white/20 text-xs mx-1">|</span>

              {(['all', 'easy', 'medium', 'hard'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => { setDifficulty(v); setVisibleCount(PAGE_SIZE) }}
                  className={`px-3 py-1 text-sm font-semibold border transition-colors cursor-pointer btn-skew ${
                    difficulty === v
                      ? 'bg-ochre text-bg border-ochre'
                      : 'bg-transparent text-white/65 border-white/25 hover:border-white/50'
                  }`}
                >
                  {v === 'all' ? 'All difficulty' : v}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowTags((v) => !v)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors cursor-pointer w-fit font-sub"
              >
                <span>{showTags ? '▾' : '▸'} Tags</span>
                {selectedTags.length > 0 && (
                  <span className="text-ochre text-xs">({selectedTags.length} selected)</span>
                )}
                {!showTags && relevantTags.length < allTags.length && (
                  <span className="text-white/35 text-xs">{relevantTags.length} available</span>
                )}
              </button>
              {showTags && (
                <div className="flex flex-wrap gap-2">
                  {relevantTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-0.5 text-xs font-medium border transition-colors cursor-pointer btn-skew ${
                        selectedTags.includes(tag)
                          ? 'bg-ochre/20 text-ochre border-ochre/50'
                          : 'bg-transparent text-white/60 border-white/25 hover:border-white/45'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>{/* end controls */}
        </div>{/* end max-w container */}
      </div>{/* end filter strip */}

      {/* Results area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
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
            {visible.map((s, i) => (
              <ScenarioCard key={s.id} scenario={s} index={i} />
            ))}
          </div>
        )}

        {/* Lazy load sentinel */}
        {visibleCount < filtered.length && <div ref={sentinelRef} className="h-8 mt-4" />}
      </main>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 p-3 cursor-pointer z-[100] transition-opacity hover:opacity-80 bg-ochre-btn text-bg rounded-none btn-skew"
        >
          <PiArrowUp size={20} />
        </button>
      )}
    </div>
  )
}
