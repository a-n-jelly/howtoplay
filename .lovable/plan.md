

# Plan: Add Delete UI for Custom Games

## What
Add a delete button with confirmation dialog to `GameCard.tsx` (library view) and `GamePage.tsx` (detail view) for custom games only.

## Steps

1. **Update `GameCard.tsx`** — Add a trash icon button (visible only when `game.isCustom`) with an `AlertDialog` confirmation. Accept an `onDelete` callback prop.

2. **Update `GamesLibrary.tsx`** — Pass the `deleteGame` function from `useCustomGames` as the `onDelete` prop to `GameCard`.

3. **Update `GamePage.tsx`** — Add a delete button in the header section for custom games, with the same confirmation dialog pattern. On delete, navigate back to `/games`.

## Estimated Credits
**1 message** to implement all three file changes.

---

## Re: End-to-End Test Flow
Testing signup → generate game → save → verify persistence → delete would be **0 additional build messages** — that's a manual verification step you'd do in the preview. Just sign up, create a game, refresh, confirm it's there, then delete it.

