

# Board Game Guide App — Complete MVP Build Plan

## Overview

Build the full static MVP in **2 credits** with everything from the PRD: dark brutalist design, 3 games (Catan with expansions, Wingspan, Ticket to Ride), all guide modes, plus an **Add Game form** so you can quickly add new games yourself. No database — games stored in localStorage so you can add them on the fly at game night.

## Credit 1 — Foundation, Design System & Data

### Design System
- Dark brutalist CSS variables: `#0A0A0A` bg, `#141414` panels, `#1F1F1F` cards, `#2A2A2A` borders
- Google Fonts: **Space Grotesk** (headings) + **JetBrains Mono** (rules)
- Accent colors: Blue `#2563EB` (actions), Orange `#F97316` (hints/tips), Green `#16A34A` (completed)
- 8px spacing grid, visible borders on everything, 120-180ms transitions
- Typographic hierarchy per design guide (H1 34px, H2 24px, H3 20px, Body 16px mono)

### Data Layer (`src/data/`)
- TypeScript interfaces: `Game`, `SetupStep`, `LearnStep`, `QuickRules`, `TurnPhase`, `Action`, `RuleSnippet`, `Tip`
- **Catan** — base game (3-4 players) + **5-6 Player Expansion** + **Seafarers** + **Cities & Knights** expansion data (setup differences, extra rules, new actions)
- **Wingspan** — 1-5 players, full content
- **Ticket to Ride** — 2-5 players, full content
- Each game: 6-8 setup steps, 5 learn screens, quick rules sections, turn phases, actions, rule snippets, beginner tips
- Expansion data modeled as variants within the game (player count selector adjusts setup steps and rules)

### Pages & Routing
- `/` — Home: search bar, game grid, "recently viewed" (localStorage)
- `/games` — Game Library: search, complexity filter, player count filter
- `/games/:id` — Game Page hub with tabs
- `/add-game` — Add/Edit Game form

### Components (Credit 1)
- Layout shell with brutalist nav bar
- `GameCard` — bordered card with name, player count, complexity badge
- `SearchBar` + `ComplexityFilter` + `PlayerCountFilter`
- Home page and Game Library page

### Add Game Feature
- Multi-section form: basic info, setup steps (dynamic add/remove), learn mode screens, quick rules, tips
- Saves to localStorage, merges with hardcoded games
- Quick and dirty but functional — add a game in 5 minutes by typing in the rules from the box

## Credit 2 — Game Pages, All Guide Modes & Polish

### Game Page (tabbed)
- **Overview** — description, player count, play time, complexity, expansion selector (for Catan)
- **Setup Guide** — interactive checklist with green completion, step-by-step with "Next Step" button. Player count selector adjusts steps (e.g., Catan 5-6 player setup differences)
- **Learn Mode** — 5-screen stepper with progress bar (Goal → Setup → Turns → Actions → Scoring)
- **Quick Rules** — monospace cheat sheet in boxed rule cards (turn order, actions, scoring, edge cases)
- **First Play Assistant** — guided first round walkthrough with phase tracking and hint cards (orange bordered)

### Catan Expansions
- Expansion selector on the Game Page: Base, 5-6 Players, Seafarers, Cities & Knights
- Each expansion modifies: setup steps, available actions, rule snippets, scoring rules
- 5-6 Player expansion: adds "Special Building Phase" after each turn, adjusted resource distribution

### Key Components
- `SetupChecklist` — checkboxes with green state, tracks progress in useState
- `LearnStepper` — 5 screens, prev/next, progress bar
- `RuleCard` — brutalist bordered card, monospace text, category label
- `HintCard` — orange-bordered tip cards that appear contextually
- `ExpansionSelector` — dropdown/tabs to switch expansion context
- `QuickRulesSheet` — sectioned cheat sheet
- `FirstPlayAssistant` — step-by-step first round guide with phase indicators

### Smart Setup
- Player count selector on setup page
- Setup instructions adjust based on player count and expansion selection
- Example: Catan 5-6 players shows extra hex tiles and frame pieces

### Mobile Optimization
- Mobile-first layout, 44px tap targets
- Bottom navigation for quick access during gameplay
- Cards stack vertically on mobile

## Data Architecture

```text
Game
├── id, name, description, playerCount, playTime, complexity, thumbnail
├── expansions: Expansion[]
│   └── id, name, playerCount, setupModifications, extraRules, extraActions
├── setupSteps: SetupStep[]  (tagged by expansion + player count)
├── learnSteps: LearnStep[]  (5 screens)
├── quickRules: { turnOrder, actions, scoring, edgeCases }
├── turnPhases: TurnPhase[]
├── actions: Action[]  (name, description, cost, example)
├── ruleSnippets: RuleSnippet[]  (category, text, example)
├── tips: Tip[]  (text, isBeginner)
└── firstPlaySteps: FirstPlayStep[]
```

## Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/games` | Game Library |
| `/games/:id` | Game Page (tabbed) |
| `/games/:id/setup` | Setup Guide |
| `/games/:id/learn` | Learn Mode |
| `/games/:id/quick-rules` | Quick Rules |
| `/games/:id/first-play` | First Play Assistant |
| `/add-game` | Add New Game Form |

## What's Deferred
- Supabase database (future session)
- AI Rule Assistant / OpenAI integration
- "What Happens Next?" AI button
- User accounts, auth, favorites
- Rule Search with embeddings
- Voice assistant

