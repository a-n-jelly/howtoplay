

# Plan: AI-Powered Add Game + Color Palette + Game Images

## Phase 1: Color Palette Update

Update `src/index.css` CSS variables to the new palette:
- **Primary**: `#004643` (dark teal) → HSL ~178 100% 14%
- **Secondary**: `#ABD1C6` (sage green) → HSL ~160 30% 74%  
- **Tertiary/Accent**: `#F9BC60` (warm gold) → HSL ~36 93% 67%

Update foreground colors, borders, and muted tones to work with this warmer palette. Background stays dark. Update `tailwind.config.ts` if needed.

**Files**: `src/index.css`

## Phase 2: Game Images (AI-Generated Pixelated Art)

Add an `imageUrl` field to the `Game` type. For existing games (Catan, Wingspan, Ticket to Ride), generate pixel-art style images using the Lovable AI image generation endpoint (`google/gemini-2.5-flash-image`) via a new edge function.

- Add `imageUrl?: string` to `Game` interface in `src/data/types.ts`
- Create edge function `supabase/functions/generate-game-image/index.ts` that generates a pixelated board game illustration and returns base64
- Update `GameCard.tsx` to display the image (with a fallback colored block)
- Store generated images as base64 data URLs in localStorage alongside custom games
- For default games, generate and embed placeholder pixel art on first load (or hardcode a colored pattern)

**Files**: `src/data/types.ts`, `src/components/GameCard.tsx`, `supabase/functions/generate-game-image/index.ts`, `supabase/config.toml`

## Phase 3: AI-Powered Add Game

### Edge Function: `supabase/functions/generate-game/index.ts`
- Accepts `{ name: string }`
- Calls Lovable AI gateway (`google/gemini-3-flash-preview`) with **tool calling** to return structured `Game` data
- Tool schema mirrors the full Game interface (setup steps, learn steps, quick rules, turn phases, actions, tips, expansions, first play steps)
- Handles 429/402 errors gracefully
- Also calls the image generation function or generates an image inline

### Simplified `src/pages/AddGame.tsx`
- Single input field + "Generate Guide" button
- Loading state with spinner/progress message
- Preview of generated game data before saving
- "Save to Library" button
- "Or add manually" toggle that reveals the current manual form as fallback

### Config
- `supabase/config.toml` with both functions registered, `verify_jwt = false`

**Files**: `supabase/functions/generate-game/index.ts`, `supabase/functions/generate-game-image/index.ts`, `supabase/config.toml`, `src/pages/AddGame.tsx`

## Summary of All File Changes

| File | Action |
|------|--------|
| `src/index.css` | Update color palette |
| `src/data/types.ts` | Add `imageUrl` field |
| `src/components/GameCard.tsx` | Show game image |
| `supabase/config.toml` | Create, register functions |
| `supabase/functions/generate-game/index.ts` | Create AI game generator |
| `supabase/functions/generate-game-image/index.ts` | Create AI image generator |
| `src/pages/AddGame.tsx` | Rewrite to single-input AI generator with manual fallback |

## Implementation Order
1. Color palette (quick, visual feedback immediately)
2. Types + GameCard image support
3. Edge functions (generate-game, generate-game-image)
4. AddGame.tsx rewrite
5. **Stop and test**

