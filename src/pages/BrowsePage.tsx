import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import ScenarioCard from '../components/ScenarioCard'
import scenariosData from '../data/scenarios.json'
import type { Scenario } from '../types/scenario'

const allScenarios = scenariosData as Scenario[]

const allTags = Array.from(new Set(allScenarios.flatMap((s) => s.tags))).sort()

const PAGE_SIZE = 6

export default function BrowsePage() {
  const [search, setSearch] = useState('')
  const [sourceType, setSourceType] = useState<'all' | 'film' | 'book'>('all')
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'default' | 'year-asc' | 'year-desc' | 'title'>('default')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
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

    if (sortBy === 'year-asc') list = [...list].sort((a, b) => a.year - b.year)
    else if (sortBy === 'year-desc') list = [...list].sort((a, b) => b.year - a.year)
    else if (sortBy === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [search, sourceType, difficulty, selectedTags, sortBy])

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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
      <h1 className="text-2xl font-extrabold text-sims-green mb-6">Browse Scenarios</h1>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-card px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sims-green/50"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/5 border border-white/10 rounded-card px-3 py-2 text-sm text-white focus:outline-none focus:border-sims-green/50"
          >
            <option value="default">Sort: default</option>
            <option value="year-asc">Year (oldest first)</option>
            <option value="year-desc">Year (newest first)</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* source type */}
          {(['all', 'film', 'book'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setSourceType(v)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                sourceType === v
                  ? 'bg-sims-green text-bg border-sims-green'
                  : 'bg-transparent text-white/50 border-white/20 hover:border-white/40'
              }`}
            >
              {v === 'all' ? 'All types' : v === 'film' ? '🎬 Film' : '📖 Book'}
            </button>
          ))}

          <span className="text-white/20 text-xs mx-1">|</span>

          {/* difficulty */}
          {(['all', 'easy', 'medium', 'hard'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setDifficulty(v)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                difficulty === v
                  ? 'bg-sims-green text-bg border-sims-green'
                  : 'bg-transparent text-white/50 border-white/20 hover:border-white/40'
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
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                selectedTags.includes(tag)
                  ? 'bg-sims-green/20 text-sims-green border-sims-green/50'
                  : 'bg-transparent text-white/40 border-white/15 hover:border-white/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-white/30 mb-4">
        {filtered.length} scenario{filtered.length !== 1 ? 's' : ''}
        {selectedTags.length > 0 && ` · tags: ${selectedTags.join(', ')}`}
      </p>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-white/40 text-sm">No scenarios match those filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      )}

      {/* Lazy load sentinel */}
      {visibleCount < filtered.length && <div ref={sentinelRef} className="h-8 mt-4" />}
    </main>
  )
}
