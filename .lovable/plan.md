

# Plan: Database Schema + Authentication Pages

## Step 1: Database Migration
Create tables and RLS policies in a single migration:
- **profiles** table (id, display_name, created_at) with auto-create trigger on signup
- **custom_games** table (id, user_id, game_slug, name, data jsonb, image_url, created_at) with unique constraint on (user_id, game_slug)
- RLS policies scoping all operations to `auth.uid() = user_id`

## Step 2: Auth Pages + Context
- Create an `AuthProvider` context wrapping the app (session state, onAuthStateChange)
- Build `/auth` page with login/signup tabs (email + password)
- Build `/reset-password` page for password recovery flow
- Add logout button to nav header
- Add route protection: unauthenticated users can browse default games but must sign in to save custom ones

## Estimated Credits
**2-3 messages** — one for the migration, one or two for auth UI + context + routing.

