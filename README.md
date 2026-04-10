# Royal Random SIMulator

A personal Sims 4 horror scenario generator, created with Claude's help. Gives players scenario ideas based on horror films and books — discovered via a spinning wheel, browsed in a searchable library, or navigated to directly. Pairs with [The Cinefile Blog](https://cinefile-blog.netlify.app/) and [The Kino Royale Podcast](https://open.spotify.com/show/5Ri7xJYDE9JDel4iCdl6LA).

No backend. No database. No auth. All scenario data lives in a single JSON file.

**Live site:** [royal-simulator.netlify.app](https://royal-simulator.netlify.app/)

---

## Deployment

Hosted on **Netlify** with automatic deploys from the `master` branch.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

`public/_redirects` rewrites all paths to `index.html` so React Router handles client-side navigation correctly on direct URL access and page refresh.

---

## Tech stack

- React + TypeScript + Vite
- React Router v7
- Tailwind v4 (custom CSS only — no component library)
- `canvas-confetti` for the post-spin effect
- No state management library — `useState` / `useEffect` only

---

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint
```

---

## Project structure

```
src/
  data/
    scenarios.json         # all scenario data — single source of truth
  pages/
    HomePage.tsx           # spinning wheel + modal
    BrowsePage.tsx         # search, filter, card grid
    ScenarioDetailPage.tsx # full individual scenario
  components/
    SpinningWheel.tsx      # canvas-based spinning wheel
    ScenarioCard.tsx       # card used in browse grid
    ScenarioModal.tsx      # modal shown after wheel lands
    NavBar.tsx             # slim nav with inline GemM icon
    Footer.tsx
    PlumbobSVG.tsx         # legacy, no longer used in nav
  types/
    scenario.ts            # TypeScript interfaces
  index.css                # Tailwind theme + keyframes
  App.tsx
  main.tsx
public/
  images/                  # scenario thumbnails
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Spinning wheel |
| `/browse` | `BrowsePage` | Search, filter, card grid |
| `/scenarios/:id` | `ScenarioDetailPage` | Full scenario detail |

All three routes are real browser URLs and are directly linkable and bookmarkable. The app uses `BrowserRouter`, so the server must fall back to `index.html` for all paths in production (e.g. a `_redirects` file on Netlify).

---

## Features

### Home page

The home page uses a two-column layout on desktop (wheel takes 2/3, about card takes 1/3) and stacks on mobile.

Above the wheel: a **How to Play** 3-step guide with green-numbered steps. The **about card** covers what the app is, what each scenario includes, how to use it, and a "How it's made" section — describing the Claude Code pilot project model and Gemini-generated scenario images.

### Spinning wheel

A canvas-drawn wheel with one segment per scenario. Click **Spin** — the wheel decelerates over ~4 seconds and lands on a random scenario. A modal appears with confetti, showing the scenario title, source, difficulty, and description. From there you can spin again or go to the full scenario page.

### Browse page

A searchable, filterable grid of all scenarios:

- **Live search** — filters by title as you type
- **Source type** — toggle between All / Film / Book
- **Difficulty** — toggle between All / Easy / Medium / Hard
- **Tags** — every tag across all scenarios rendered as toggleable pills; AND logic (must match all selected tags)
- **Sort** — default order, year ascending, year descending, or title A–Z
- **Lazy loading** — 6 cards per batch, loaded via `IntersectionObserver` as you scroll

### Scenario detail page

Full scenario view at `/scenarios/:id`. Sections:

- Title, source (🎬 / 📖), year, difficulty
- Thumbnail (placeholder shown if no image)
- Description
- Tags
- Household — table of Sim members with name, role, and traits
- Goals — numbered list
- Story Beats — vertical timeline with numbered steps

---

## How the spinning wheel works

The wheel is built entirely with the native **Canvas 2D API** and **`requestAnimationFrame`** — no animation library.

### Drawing

Every frame, `drawWheel(rotation)` repaints the entire canvas from scratch. Each segment is a filled wedge:

```ts
ctx.beginPath()
ctx.moveTo(cx, cy)
ctx.arc(cx, cy, radius, startAngle, endAngle)
ctx.closePath()
ctx.fillStyle = PALETTE[i % PALETTE.length]
ctx.fill()
```

Labels are drawn by rotating the canvas context to point outward along each segment's midpoint, then drawing right-aligned text near the rim. Titles longer than 12 characters are truncated with `…`.

On top of the segments: a green outer ring, a small dark center circle, and a fixed triangle pointer at the top.

### Animation

When the spin button is clicked, `HomePage` sets `isSpinning: true`. The wheel watches this prop and when it flips, picks a target rotation before the animation even starts:

```ts
const extraSpins = 5 + Math.random() * 5       // 5–10 full rotations
const randomStop = Math.random() * 2 * Math.PI // random position within one rotation
const totalRotation = extraSpins * 2 * Math.PI + randomStop
targetRotation = currentRotation + totalRotation
```

The animation loop then runs for 4000ms, applying an **ease-out cubic** curve each frame:

```ts
const progress = Math.min(elapsed / SPIN_DURATION, 1)
const eased = 1 - Math.pow(1 - progress, 3)
currentRotation = startRotation + eased * totalRotation
```

This gives the wheel a fast start and a smooth natural deceleration to a stop — always landing exactly on the pre-chosen target.

### Determining the winner

Once the animation completes, the winning segment is calculated from the final rotation angle:

```ts
const normalised = ((-(rotation % (2 * Math.PI))) + 2 * Math.PI) % (2 * Math.PI)
const winIdx = Math.floor(normalised / segAngle) % n
```

- `% (2 * Math.PI)` collapses accumulated rotation (e.g. 44 radians after many spins) to a 0–2π range
- Negating converts canvas clockwise rotation to the counter-clockwise angle system
- `+ 2 * Math.PI) % (2 * Math.PI)` keeps the result positive
- Dividing by `segAngle` and flooring gives the index of whichever segment is under the pointer

That index maps to a scenario, which is passed back to `HomePage` via `onSpinEnd`. Confetti fires, the modal opens.

> The result is determined before the spin starts. The animation just plays out to the pre-chosen position.

---

## How lazy loading works

The browse grid uses the native **`IntersectionObserver`** API — no library.

An invisible sentinel `<div>` sits at the bottom of the grid:

```tsx
{visibleCount < filtered.length && <div ref={sentinelRef} className="h-8 mt-4" />}
```

It only exists when there are more scenarios to load. An observer watches it:

```ts
const observer = new IntersectionObserver(
  (entries) => { if (entries[0]?.isIntersecting) loadMore() },
  { rootMargin: '0px' }
)
observer.observe(el)
```

When the sentinel scrolls into the viewport, `loadMore` fires:

```ts
setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))
```

This increments the visible count by 6, capped at the total filtered results. The grid always renders:

```ts
const visible = filtered.slice(0, visibleCount)
```

When filters or search change, `visibleCount` resets to 6 so the grid always starts fresh:

```ts
useEffect(() => {
  setVisibleCount(PAGE_SIZE)
}, [filtered])
```

Cards fade in on mount via a CSS keyframe animation, making each new batch appear smoothly rather than popping in.

---

## Data schema

All scenarios live in `src/data/scenarios.json` as a top-level array:

```json
{
  "id": "the-shining",
  "title": "The Shining",
  "source": "The Shining",
  "sourceType": "film",
  "year": 1980,
  "difficulty": "hard",
  "tags": ["isolation", "psychological", "family"],
  "description": "A longer written description in the author's voice.",
  "thumbnail": "/images/the-shining.jpg",
  "householdMembers": [
    {
      "name": "Jack Torrance",
      "role": "Father / Caretaker",
      "traits": ["Creative", "Hot-Headed", "Loner"]
    }
  ],
  "goals": [
    "Jack must reach level 5 Writing skill within 2 sim-weeks."
  ],
  "storyBeats": [
    { "step": 1, "text": "The family settles in. Keep them happy." },
    { "step": 6, "text": "Wendy must escape the lot with Danny." }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Kebab-case, unique, used as the URL slug |
| `source` | `string` | Title of the source work |
| `sourceType` | `"film" \| "book" \| "tv"` | |
| `year` | `number` | Release / publication year |
| `difficulty` | `"easy" \| "medium" \| "hard"` | |
| `tags` | `string[]` | Freeform lowercase, defined by the author |
| `thumbnail` | `string` (optional) | Path relative to `/public/images/` |
| `householdMembers` | `array` | Each has `name`, `role`, `traits` |
| `storyBeats` | `array` | Each has `step` (number) and `text` (string) |

---

## Design system

### Colours

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080f14` | Page background |
| `--green-bright` | `#4ade80` | Nav, hover states, gem icon |
| `--green-btn` | `#1db86a` | Spin button base |
| `--horror-red` | `#F5B800` | Amber — medium difficulty, UI accent |
| `--text-muted` | `rgba(255,255,255,0.35)` | Secondary text |

Difficulty colours: easy `#4ade80` (green) · medium `#F5B800` (amber) · hard `#B81515` (coral).

### Wheel & palette

The wheel cycles through an 8-colour complementary palette derived from a botanical reference image — four source colours plus their direct opposites:

![Site palette reference](public/images/easter-egg-sims.png)

| Colour | Hex | Pair |
|---|---|---|
| Forest green | `#2EAD3F` | ↔ Magenta `#AD2E9C` |
| Teal | `#15B8B0` | ↔ Coral `#B81515` |
| Amber | `#F5B800` | ↔ Blue `#0047F5` |
| Lime | `#6BCF3A` | ↔ Purple `#7C3AED` |

The Spin button gradient animates through all 8 colours in wheel order.

Font: **Quicksand** / **Josefin Sans** (Google Fonts). Border radius: 12px for cards/buttons, 99px for pills/badges.
