import { Game } from './types';
import { catan } from './catan';
import { wingspan } from './wingspan';
import { ticketToRide } from './ticket-to-ride';

export const defaultGames: Game[] = [catan, wingspan, ticketToRide];
