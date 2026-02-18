# 🐉 Pokémon Explorer Code Challenge

## Overview

Welcome! This challenge is designed to simulate one slice of Flywire’s day-to-day work: building a fast, accessible, and maintainable React SPA with a real-world public API. You’ll create a small "Pokémon Explorer" that lets users:

1. **Browse** a list of Pokémon in a table view.
2. **Inspect** details for any Pokémon by clicking its row.

Two wireframes (Table View & Details View) are provided in the `/wireframes` directory as a visual guideline—your implementation should follow their layout and flow but does **not** need to be pixel-perfect.

Behind the scenes you’ll fetch data from [PokeAPI](https://pokeapi.co/) and demonstrate best-in-class frontend practices.

---

## 🚀 Getting Started

1. **Clone** this repo and install dependencies:
   ```bash
   npm install
   ```
2. **Run** in development mode:
   ```bash
   npm start
   ```
3. **Run tests**:
   ```bash
   npm test
   ```
4. **Build** for production:
   ```bash
   npm run build
   ```

---

## 🎯 Mandatory Requirements

1. **Tech Stack**
   - **React** as the primary library (mandatory)
   - All other choices (TypeScript vs. JavaScript, styling tools, testing frameworks, state management etc.) are yours to decide. See the **Bonus Points** section for technologies that will earn extra credit.

2. **Table View**
   - Fetch Pokémon data from PokeAPI and display a paginated list. You should only display 5 - 10 pokémons at a time per page.
   - Columns:
     - Sprite image
     - Name + Base EXP
     - Type(s) (icons or colored badges are optional but desirable)
     - HP stat
     - Speed stat
     - Primary ability
   - The stats header is optional

<div align="center">
  <img src="./wireframes/table_view.png" alt="Table View Wireframe" width="600" />
</div>

3. **Details View**
   - On row click, show a detail panel or separate route.
   - Display:
     - Pokémon name, ID, Official artwork (from sprites.other['official-artwork'].front_default)
     - Type(s)
     - Base stats (HP, Atk, Def, Sp. Atk, Sp. Def, Speed)
     - Physical traits (height, weight, base XP)
     - Evolution chain (optional)
     - Scrollable list of moves with type labels
   - Implement "back" navigation.

<div align="center">
  <img src="./wireframes/detail_view.png" alt="Details View Wireframe" width="600" />
</div>

4. **Code Quality & Architecture**
   - Follow TDD if possible: tests first where practical.
   - Clean, modular, DRY code with clear separation of concerns.
   - Proper error handling and edge-case coverage.
   - Accessibility best practices are desirable.

---

## ✨ Bonus Points 💯
- The Stats header in the table view:
     - Show the total amount of pokémon in the collection
     - The average HP in the current view
     - The pokémon type percentages in the current view
     - The most powerful pokémon in the current view, this might be a combination of HP, Speed and base XP
- **Sorting** by any stat column in the table view
- Routing
- Typescript
- Tailwind CSS for styling
- Jest + React Testing Library for unit/integration tests
- Playwright for end-to-end tests
- Containerize with **Docker**.
- Responsive design (mobile ↔ desktop).

---

## 📤 Submission

1. Clone the template repo
This challenge is hosted on a starter repository we've prepared for you. Start by cloning it.

2. Work on your solution
Implement your code directly in this repo. Commit early and often — we’d love to see how you approach the problem.

3. (Optional) Document your decisions
If you want to explain architectural decisions, trade-offs, or anything else about your approach, feel free to create a short section at the bottom of the README titled 🧠 Notes or 📌 Design Decisions.

4. Open a Pull Request
When you're done, open a pull request against this repo. Please include a brief summary of what you built, and any notes we should be aware of during the review.

**Good luck!**






# Notes:
______________________________________________________________________________________


A small SPA with two distinct views (Table and Detail) and shared data-fetching logic. We need a maintainable structure that separates concerns cleanly.

## File Structure

```
src/
├── services/
│   └── pokeApi.js          # All fetch functions (pure async functions)
├── hooks/
│   ├── usePokemonPage.js   # Page-level data: list + parallel detail fetches
│   └── usePokemonDetail.js # Single Pokémon: detail + species + evolution chain
├── components/
│   ├── TypeBadge.jsx       # Reusable colored type pill
│   ├── LoadingSpinner.jsx  # Accessible loading indicator
│   ├── ErrorMessage.jsx    # Error display with retry support
│   ├── StatsHeader.jsx     # Aggregated stats (total, avg HP, type dist, most powerful)
│   ├── Pagination.jsx      # Prev/Next page controls
│   ├── PokemonRow.jsx      # Single table row
│   ├── PokemonTable.jsx    # Full table with sorting + column headers
│   ├── BaseStatsBar.jsx    # Animated stat bar for detail view
│   ├── EvolutionChain.jsx  # Linear evolution chain display
│   └── MovesList.jsx       # Paginated scrollable moves list with type labels
├── views/
│   ├── TableView.jsx       # Route "/" — owns page state in URL search params
│   └── DetailView.jsx      # Route "/pokemon/:id" — owns back navigation
├── App.jsx                 # createBrowserRouter setup
├── main.jsx                # QueryClient + QueryClientProvider + React root
└── index.css               # @import "tailwindcss" only
```

## Key Architectural Decisions

### Separation of Concerns
- **services/**: Pure fetch functions with no React coupling. Easy to test or swap.
- **hooks/**: Compose services with TanStack Query. Return normalized data shapes.
- **components/**: Presentational, receive data as props (no direct API calls except MoveItem which owns its type query for clean encapsulation).
- **views/**: Own route-level state (URL params, navigation). Compose hooks + components.

### URL-Driven Pagination
Table page is stored in `?page=N` query param (via `useSearchParams`). This allows:
- Back/forward browser navigation to restore page
- Direct link sharing to a specific page
- No redundant state synchronization

### Sorting in Component State
Column sorting lives in `PokemonTable` local state (not URL) because:
- It's a transient UI preference
- Adding it to URL would complicate the implementation without meaningful benefit
- Resets when changing pages (correct behavior: sort within current page)

### Most Powerful Score
Score = `HP + Speed + base_experience`.

### Accessibility
- All interactive elements are keyboard-navigable (buttons, table rows with `tabIndex`)
- `aria-label` on icon-only controls
- `role="status"` on loading indicators
- Sufficient color contrast on type badges (verified against WCAG AA for the colors chosen)
- Images have descriptive `alt` attributes

### Responsive Design
- Table view: horizontally scrollable on mobile, full table on desktop (md+)
- Detail view: single column on mobile, two columns on tablet+ (lg+)
- Stats header: 2×2 grid on mobile, 4-column row on desktop






## API

PokeAPI v2 is a free, public REST API with no authentication. Its list endpoints (`/pokemon?limit=N&offset=M`) return only `{name, url}` per item—no stats, sprites, or types. To populate the table we need to fetch each Pokémon individually.

## Key Endpoint Facts

| Endpoint | Returns |
|---|---|
| `GET /pokemon?limit=10&offset=0` | `{count, results[{name,url}]}` — total is ~1350 |
| `GET /pokemon/{id}` | Full detail: sprites, types, stats, abilities, moves, base_experience, height, weight |
| `GET /pokemon-species/{id}` | `evolution_chain.url` for the evolution endpoint |
| `GET /evolution-chain/{url}` | Recursive `chain` tree |
| `GET /move/{id}` | `type.name` for move type labels |

## Decisions

### Parallel Detail Fetches with useQueries
For each page of 10 Pokémon, we:
1. Fetch the list to get IDs (`useQuery`)
2. Immediately fire 10 parallel detail fetches (`useQueries`)

This avoids a sequential waterfall. With TanStack Query caching (staleTime: 24h), navigating back to a previously visited page is instant.

### ID Extraction from URLs
All PokeAPI resource URLs follow the pattern `https://pokeapi.co/api/v2/{resource}/{id}/`.
We extract the numeric ID with: `url.split('/').filter(Boolean).pop()`

### Sprite Strategy
- **Table row sprite:** `sprites.front_default` (small PNG, fast to load)
- **Detail header:** `sprites.other['official-artwork'].front_default` (high-res)
- **Evolution chain sprites:** `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` (derived from species URL ID to avoid extra fetch)

### Evolution Chain Flattening
The evolution chain is a recursive tree. We traverse only the first `evolves_to[0]` path (linear chains). Branching evolutions (e.g., Eevee) show only the first branch. This covers ~95% of Pokémon correctly and keeps the component simple.

### Move Type Fetching
Moves are paginated within the detail view (20 per page). Each `MoveItem` component calls its own `useQuery(['move', id])`. TanStack Query deduplicates and caches move data globally, so a move type fetched for one Pokémon is immediately available for another. This is the simplest approach that satisfies the wireframe without introducing a local lookup table.

### Caching
All queries use `staleTime: 24 * 60 * 60 * 1000` (24h) matching PokeAPI's own `Cache-Control: public, max-age=86400` header. This means repeated navigation never re-fetches within a session.


