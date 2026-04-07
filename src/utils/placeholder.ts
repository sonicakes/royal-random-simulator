const PLACEHOLDERS = [
  '/images/placeholder/halloween.png',
  '/images/placeholder/knife.png',
  '/images/placeholder/reaper.png',
  '/images/placeholder/scream.png',
  '/images/placeholder/spooks.png',
]

export function pickPlaceholder(id: string): string {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PLACEHOLDERS[hash % PLACEHOLDERS.length]
}
