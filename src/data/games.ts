import { Game } from './types';
import { catan } from './catan';
import { wingspan } from './wingspan';
import { ticketToRide } from './ticket-to-ride';

const CUSTOM_GAMES_KEY = 'boardgame-guide-custom-games';

export const defaultGames: Game[] = [catan, wingspan, ticketToRide];

export function getCustomGames(): Game[] {
  try {
    const stored = localStorage.getItem(CUSTOM_GAMES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomGame(game: Game): void {
  const games = getCustomGames();
  const idx = games.findIndex(g => g.id === game.id);
  if (idx >= 0) {
    games[idx] = game;
  } else {
    games.push(game);
  }
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(games));
}

export function deleteCustomGame(id: string): void {
  const games = getCustomGames().filter(g => g.id !== id);
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(games));
}

export function getAllGames(): Game[] {
  return [...defaultGames, ...getCustomGames()];
}

export function getGameById(id: string): Game | undefined {
  return getAllGames().find(g => g.id === id);
}
