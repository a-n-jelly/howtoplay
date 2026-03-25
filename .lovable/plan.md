

# Plan: Rules Q&A Chatbot

## What
A floating chat button on every game page that opens a slide-up panel where users can ask natural language questions about that game's rules. The AI receives the game's full data as context so answers are grounded in actual content. Responses stream token-by-token.

## Steps

### 1. Create edge function `supabase/functions/ask-rules/index.ts`
- Accepts `{ gameContext, messages }` where `gameContext` is a pre-serialized string of the game's rules/setup/tips
- System prompt: "You are a rules expert for this board game. Answer questions using ONLY the provided game data. Be concise."
- Streams SSE responses via Lovable AI gateway using `google/gemini-3-flash-preview`
- No auth required (public feature)
- Handles 429/402 errors

### 2. Create `src/components/RulesChat.tsx`
- Floating chat button (bottom-right corner, `MessageCircle` icon)
- Click opens a fixed panel (bottom-right, ~400px wide, ~500px tall) with:
  - Message list with markdown rendering via `react-markdown`
  - Text input + send button
  - Loading indicator during streaming
- Accepts `game: Game` prop
- Serializes game fields (`quickRules`, `setupSteps`, `learnSteps`, `tips`, `ruleSnippets`, `turnPhases`, `actions`, expansion data) into a context string sent with each request
- Conversation is ephemeral (in-memory state, no database)
- SSE streaming with token-by-token rendering using the standard pattern

### 3. Update `src/pages/GamePage.tsx`
- Import and render `<RulesChat game={game} />` after the Tips section
- No other changes needed

### 4. Update `supabase/config.toml`
- Add `[functions.ask-rules]` with `verify_jwt = false`

## Technical Details

**Context serialization** -- helper function that converts the `Game` object into a structured text block:
```text
Game: Catan
Setup: 1. Lay out the board... 2. Each player takes...
Turn Order: 1. Roll dice 2. Collect resources...
Actions: Trade, Build, Buy dev card...
Scoring: 10 VP to win...
Tips: Build on ports early (beginner)...
```

**Model**: `google/gemini-3-flash-preview` (fast, cheap, good for Q&A)

**Dependencies**: `react-markdown` (already likely available; will verify at implementation)

## Estimated Credits
**1-2 messages** to implement everything.

