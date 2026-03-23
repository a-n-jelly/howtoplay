

# Plan: Wire Custom Games to Database

## What
Create a `useCustomGames` hook that reads/writes from the database instead of localStorage, and update `AddGame.tsx`, `GamesLibrary.tsx`, `GamePage.tsx`, and `Index.tsx` to use it.

## Steps

1. **Create `src/hooks/useCustomGames.ts`** — hook using Supabase to fetch, save, and delete custom games for the authenticated user. Falls back gracefully when not logged in.

2. **Update `src/pages/AddGame.tsx`** — save generated games to database via the hook instead of localStorage. Require auth to save.

3. **Update `src/pages/GamesLibrary.tsx`** and **`src/pages/Index.tsx`** — use the hook to merge DB custom games with default games.

4. **Update `src/pages/GamePage.tsx`** — fetch custom game from DB if not found in defaults.

5. **Keep `src/data/games.ts`** — retain `defaultGames` exports but remove localStorage functions (or keep as fallback for unauthenticated users).

## Estimated Credits
**2-3 messages** — one for the hook + data layer, one or two for updating all consuming pages.

