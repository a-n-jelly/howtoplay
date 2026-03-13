import { Game } from './types';

export const ticketToRide: Game = {
  id: 'ticket-to-ride',
  name: 'Ticket to Ride',
  description: 'Claim railway routes across North America! Collect train cards, claim routes between cities, and complete destination tickets for bonus points.',
  playerCount: '2-5',
  playTime: '30-60 min',
  complexity: 'low',
  category: 'Family',
  expansions: [],
  setupSteps: [
    { stepNumber: 1, instruction: 'Unfold the board and place it in the center of the table.' },
    { stepNumber: 2, instruction: 'Each player chooses a color and takes all 45 train car pieces of that color.' },
    { stepNumber: 3, instruction: 'Shuffle the train car cards and deal 4 to each player. Place the rest as a draw pile. Flip 5 cards face-up next to the draw pile.' },
    { stepNumber: 4, instruction: 'Shuffle the destination ticket cards and deal 3 to each player. Each player must keep at least 2 (may keep all 3). Return unwanted tickets to the bottom of the pile.' },
    { stepNumber: 5, instruction: 'Place the scoring markers for each player on the "1" space of the scoring track.' },
    { stepNumber: 6, instruction: 'The most experienced traveler goes first (or pick randomly).' },
  ],
  learnSteps: [
    {
      title: '🎯 Goal',
      content: 'Score the most points by claiming routes between cities, completing destination tickets, and earning the Longest Route bonus. Uncompleted destination tickets lose you points!',
      tips: ['Pick destination tickets that share cities — you can work toward multiple goals at once.'],
    },
    {
      title: '🛠️ Setup',
      content: 'Each player gets 45 train cars, 4 train car cards, and 3 destination tickets (keep at least 2). The board shows North American cities connected by colored and gray routes.',
      tips: ['Look at your tickets first — plan your initial routes before drawing more cards.'],
    },
    {
      title: '🔄 Turn Structure',
      content: 'On your turn, do ONE of 3 things: (1) Draw 2 train car cards (from face-up or the deck). (2) Claim a route by playing matching cards. (3) Draw 3 more destination tickets (keep at least 1).',
      tips: ['Taking a face-up locomotive (wild) counts as your whole 2-card draw.'],
    },
    {
      title: '⚡ Actions',
      content: 'Draw Cards: Take 2 cards (face-up or blind from deck). Locomotives are wild but taking one face-up uses both draws. Claim Route: Play cards matching the route\'s color and length. Gray routes accept any single color. Draw Tickets: Take 3 destination tickets, keep at least 1.',
      tips: ['Locomotives are powerful — hoard a few for claiming key routes.', 'Double routes (parallel routes between 2 cities) can only both be used in 4-5 player games.'],
    },
    {
      title: '🏆 Scoring',
      content: 'Route points: 1-length=1pt, 2=2, 3=4, 4=7, 5=10, 6=15. Completed destination tickets add their printed value. Uncompleted tickets SUBTRACT their value. Longest continuous route = 10 bonus points.',
      tips: ['Long routes (5-6 cars) are very efficient point-wise — grab them when you can!'],
    },
  ],
  quickRules: {
    turnOrder: [
      'Do ONE action per turn:',
      'Draw 2 train car cards (from face-up display or deck)',
      'OR Claim 1 route (play matching color cards)',
      'OR Draw 3 destination tickets (keep at least 1)',
    ],
    actions: [
      'Draw Cards: Take 2 (face-up locomotive = both draws)',
      'Claim Route: Play cards matching color + length of route',
      'Gray routes: use any single color',
      'Locomotives are wild — mix with any color',
      'Draw Tickets: Take 3, keep ≥1',
    ],
    scoring: [
      '1-car route = 1 pt',
      '2-car route = 2 pts',
      '3-car route = 4 pts',
      '4-car route = 7 pts',
      '5-car route = 10 pts',
      '6-car route = 15 pts',
      'Completed tickets = + printed value',
      'Failed tickets = − printed value',
      'Longest Route bonus = 10 pts',
    ],
    edgeCases: [
      'Face-up locomotive draw = uses both card draws for your turn',
      'If 3+ locomotives appear face-up, discard all 5 and redraw',
      'Double routes: only 1 route available in 2-3 player games',
      'Game end: triggered when any player has ≤2 trains left. Everyone (including that player) gets 1 more turn.',
    ],
  },
  turnPhases: [
    { name: 'Choose Action', description: 'Pick 1 of 3 possible actions.', actions: ['Draw Cards', 'Claim Route', 'Draw Tickets'] },
  ],
  actions: [
    { name: 'Draw Train Cards', description: 'Take 2 cards from face-up display or draw pile.', cost: 'Free', example: 'Take a blue card and a red card from the face-up display.' },
    { name: 'Claim a Route', description: 'Play matching color cards equal to the route length.', cost: 'Train car cards', example: 'Play 3 red cards to claim the 3-length red route from Dallas to Houston.' },
    { name: 'Draw Destination Tickets', description: 'Take 3 tickets from the pile, keep at least 1.', cost: 'Free', example: 'Draw 3 tickets, keep the one connecting cities you\'re already near.' },
  ],
  ruleSnippets: [
    { category: 'Locomotives', text: 'Locomotives (rainbow cards) are wild and can substitute for any color. Taking a face-up locomotive counts as drawing 2 cards.' },
    { category: 'Game End', text: 'When any player has 2 or fewer train cars remaining, every player (including them) gets one final turn.' },
    { category: 'Double Routes', text: 'In 2-3 player games, only one of the two parallel routes between cities may be claimed.' },
  ],
  tips: [
    { text: 'Keep your destination tickets secret — don\'t reveal your plans through obvious card collecting.', isBeginner: true },
    { text: 'Claim long routes (5-6) early — they\'re worth many points and hard to collect cards for later.', isBeginner: true },
    { text: 'Watch how many trains other players have left — the game can end suddenly!', isBeginner: true },
    { text: 'Sometimes blocking an opponent\'s obvious route is worth more than optimizing yours.', isBeginner: false },
    { text: 'Drawing blind from the deck is underrated — face-up draws reveal your strategy.', isBeginner: false },
  ],
  firstPlaySteps: [
    { phase: 'Setup', instruction: 'Look at your 3 destination tickets. Try to keep tickets that share connecting cities.', hint: 'Keeping 2 shorter tickets is safer than 1 long one for your first game.' },
    { phase: 'Early Game', instruction: 'Draw train car cards to build up your hand. Aim for colors matching routes on your tickets.', hint: 'Don\'t claim routes yet — build your hand first.' },
    { phase: 'Mid Game', instruction: 'Start claiming routes along your ticket paths. Work from one end of your ticket to the other.', hint: 'Claim the middle/contested segments first — ends are easier to claim later.' },
    { phase: 'Late Game', instruction: 'Complete your tickets! Draw new tickets only if you\'re confident you can finish them.', hint: 'Uncompleted tickets LOSE you points. Only draw more if you\'re ahead.' },
    { phase: 'Game End', instruction: 'Count route points, add completed tickets, subtract failed tickets, check longest route.', hint: 'Don\'t forget to claim any easy short routes for bonus points before the game ends.' },
  ],
};
