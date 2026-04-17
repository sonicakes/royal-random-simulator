export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-[#B87A0A]/20 z-50 text-center text-sm text-white/40 bg-bg/[0.97] shadow-[0_-2px_12px_rgba(255,255,255,0.04)]">
      <a
        href="https://github.com/sonicakes/royal-random-simulator"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#D4920A] transition-colors"
      >
        GitHub
      </a>
      <span className="mx-2">·</span>
      <span>Designed, Developed & Deployed by <span className="italic">The Film Lady Productions</span> in 2026</span>
    </footer>
  )
}
