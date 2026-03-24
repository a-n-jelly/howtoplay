import { Game } from './types';
import { catan } from './catan';
import { wingspan } from './wingspan';
import { ticketToRide } from './ticket-to-ride';
import catanImg from '@/assets/catan.jpg';
import wingspanImg from '@/assets/wingspan.jpg';
import ticketToRideImg from '@/assets/ticket-to-ride.jpg';

export const defaultGames: Game[] = [
  { ...catan, imageUrl: catanImg },
  { ...wingspan, imageUrl: wingspanImg },
  { ...ticketToRide, imageUrl: ticketToRideImg },
];
