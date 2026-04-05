export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-white/10 z-50 text-center text-sm text-white/40" style={{ background: 'rgba(8,15,20,0.97)', boxShadow: '0 -2px 12px rgba(255,255,255,0.04)' }}>
      <a
        href="https://github.com/sonicakes/royal-random-simulator"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-sims-green transition-colors"
      >
        GitHub
      </a>
      <span className="mx-2">·</span>
      <span>Designed, Developed & Deployed by The Film Lady Productions in 2026</span>
    </footer>
  )
}
