# Royal Random SIMulator — Claude Code Instructions

## Project overview
Royal Random SIMulator is a Sims 4 horror scenario generator. It is a personal web app created with Claude's help, giving players scenario ideas based on horror films and books. Users discover scenarios via a spinning wheel, browse a searchable library, or navigate directly to a scenario. It can be used alongside The Cinefile Blog (https://cinefile-blog.netlify.app/) and The Kino Royale Podcast (https://open.spotify.com/show/5Ri7xJYDE9JDel4iCdl6LA).

There is no backend, no database, no authentication, and no AI integration. All scenario data lives in a single `src/data/scenarios.json` file.

---

## Tech stack
- React/Typescript + Vite
- React Router v7 with BrowserRouter
- No UI component library — all styling is custom CSS, Tailwind v4 class system 
- No state management library — React useState/useEffect only
- No backend or API calls

---

## Commands
```bash
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
    scenarios.json       # all scenario data — single source of truth
  pages/
    HomePage.tsx             # two-column layout: spinning wheel + about card
    BrowsePage.tsx           # search + filter + card grid
    ScenarioDetailPage.tsx   # full individual scenario
  components/
    SpinningWheel.tsx        # canvas-based spinning wheel
    ScenarioCard.tsx         # card used in Browse and scenario grid
    ScenarioModal.tsx        # modal shown after wheel lands
    NavBar.tsx               # slim top nav with inline GemM icon in site name
    Footer.tsx               # github link to project, other links coming too
    PlumbobSVG.tsx           # legacy SVG component, no longer used in nav
  index.css           # tailwind classes, theme
  App.tsx
  main.tsx
public/
  images/                # scenario thumbnails (jpg/png)
```

---

## Routes
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Spinning wheel |
| `/browse` | `Browse` | Search, filter, card grid |
| `/scenarios/:id` | `ScenarioDetail` | Full scenario detail |

---

## Data schema
All scenarios live in `src/data/scenarios.json` as a top-level array. The shape of each scenario:

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

Field notes:
- `id` — kebab-case, unique, used as the URL slug
- `source` — string title of the source work
- `sourceType` — `"film"` or `"book"`
- `year` — release/publication year of the source work
- `difficulty` — `"easy"`, `"medium"`, or `"hard"`
- `tags` — freeform lowercase strings, defined by the author
- `thumbnail` — optional; path relative to `/public/images/`; omit if no image yet
- `householdMembers` — each member has `name`, `role`, and `traits` (string array)
- `storyBeats` — ordered objects with `step` (number) and `text` (string)

---

## Design system

### Colours
```css
--bg:             #080f14;   /* page background */
--green-bright:   #4ade80;   /* primary Sims green — nav, hover, gem icon */
--green-btn:      #1db86a;   /* spin button base */
--amber:          #F5B800;   /* warm accent — medium difficulty */
--coral:          #B81515;   /* hard difficulty, "Torture" title */
--text-primary:   #ffffff;
--text-muted:     rgba(255,255,255,0.35);
--text-hint:      rgba(255,255,255,0.28);
--border-default: rgba(255,255,255,0.07);
--border-hover:   rgba(74,222,128,0.35);
```

### Difficulty colours
- easy → `#4ade80` (green)
- medium → `#F5B800` (amber)
- hard → `#B81515` (coral)

### Wheel segment palette
8-colour complementary palette — four colours from a botanical reference image plus their direct opposites. Cycle through in order:
```js
["#2EAD3F","#15B8B0","#F5B800","#6BCF3A","#AD2E9C","#B81515","#0047F5","#7C3AED"]
```

### Tags
- Film source → amber tint
- Book source → green tint
- Generic tags → subtle white tint

### Typography
- Font: Nunito (Google Fonts) with system sans fallback
- Weights: 400 regular, 700 bold
- Border radius: 12px for cards and buttons, 99px for pills/badges

### Nav logo (GemM)
The "M" in "SIMulator" in the nav is replaced by an inline faceted gem SVG — a three-polygon diamond in green tones, sized to sit flush with the surrounding text:
```jsx
<svg viewBox="0 0 12 14" style={{ display: 'inline', width: '0.75em', height: '0.875em', verticalAlign: 'middle' }}>
  <polygon points="3,0 9,0 12,5 6,14 0,5" fill="#4ade80" />
  <polygon points="3,0 9,0 6,5" fill="#86efac" opacity="0.8" />
  <polygon points="0,5 12,5 6,14" fill="#16a34a" opacity="0.9" />
</svg>
```
The nav is 60px tall (`h-15`), no bottom border, and renders: **Royal Si♦ulator** on the left, **Browse Scenarios** on the right.

---

## Wheel behaviour
- Built on HTML `<canvas>` — no external library
- Segments drawn from `scenarios.json`, one per scenario
- Spin triggered by button click; smooth ease-out deceleration (~3.4s)
- On spin complete: open `ScenarioModal` for the landed scenario; confetti effect implemented using 'canvas-confetti' package
- Wheel pointer is a crimson downward triangle above the wheel
---

## Functionality notes
- Browse page: search is live (filters as user types), no submit button
- Filters (film/book, difficulty, tags) are additive — AND logic
- Modal closes on backdrop click or ✕ button
- No loading states needed — all data is local JSON
- No error boundaries needed for MVP

---

## Out of scope for MVP
- No AI / Claude API integration
- No admin panel or CMS
- No user accounts, saves, or favourites
- No animations beyond the wheel spin & confetti
- No dark/light mode toggle (dark only)

## Behavior Instructions

- Before modifying anything, show the proposed solution and explain it in plain language.
- Ask clarifying questions on both minor and major decisions.
- When starting a new feature or bug fix: check the current branch, show it to the user, and ask if it's the correct one. If not, ask what branch to create based on the feature/bug/task name.
- When starting a new feature, bug fix, or architectural change: ask if the user wants to enter /plan mode before proceeding.