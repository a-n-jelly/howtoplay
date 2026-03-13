import { Game } from './types';

export const wingspan: Game = {
  id: 'wingspan',
  name: 'Wingspan',
  description: 'A competitive bird-collection, engine-building game. Attract birds to your wildlife preserves, gaining points from eggs, cached food, tucked cards, and bonus objectives.',
  playerCount: '1-5',
  playTime: '40-70 min',
  complexity: 'medium',
  category: 'Engine Building',
  expansions: [],
  setupSteps: [
    { stepNumber: 1, instruction: 'Place the bird tray in the center of the table. Shuffle the bird deck and fill the tray with 3 face-up bird cards.' },
    { stepNumber: 2, instruction: 'Place the 5 dice in the birdfeeder tower and roll them into the tray.' },
    { stepNumber: 3, instruction: 'Shuffle the bonus cards. Deal 2 to each player (keep 1, discard 1).' },
    { stepNumber: 4, instruction: 'Deal 5 bird cards to each player. You\'ll keep some and discard others.' },
    { stepNumber: 5, instruction: 'Give each player 1 of each food token (5 total). For each bird card you keep, discard 1 food token. For each food you keep, discard 1 bird card.' },
    { stepNumber: 6, instruction: 'Give each player a player mat. Place 8 action cubes on it (7 in round 2, 6 in round 3, 5 in round 4).' },
    { stepNumber: 7, instruction: 'Randomly select 4 end-of-round goal tiles. Place them on the goal board (1 per round).' },
    { stepNumber: 8, instruction: 'Place the first player token with the starting player.' },
  ],
  learnSteps: [
    {
      title: '🎯 Goal',
      content: 'Score the most points over 4 rounds. Points come from bird cards, bonus cards, end-of-round goals, eggs on birds, food cached on birds, and tucked cards.',
      tips: ['Every bird you play is worth at least its printed VP — even 0-point birds help your engine.'],
    },
    {
      title: '🛠️ Setup',
      content: 'Each player gets a player mat with 3 habitats (Forest, Grassland, Wetland). You start with 5 bird cards and 5 food tokens, but must trade between them — more birds means less food and vice versa.',
      tips: ['Keep 2-3 birds and 2-3 food to start. Look for birds you can play immediately.'],
    },
    {
      title: '🔄 Turn Structure',
      content: 'On your turn, place an action cube on one of 4 rows: (1) Play a Bird — pay its food cost and egg cost, place it in the matching habitat. (2) Gain Food — take dice from the birdfeeder. (3) Lay Eggs — place eggs on your birds. (4) Draw Bird Cards — take from the tray or deck.',
      tips: ['Each row also activates all birds in that habitat from right to left — this is your engine!'],
    },
    {
      title: '⚡ Actions',
      content: 'Play a Bird: pay food + egg cost, place in its habitat. Gain Food: take food dice from the feeder. Lay Eggs: place eggs on birds (eggs are currency to play birds). Draw Cards: take from the face-up tray or the top of the deck. When activated, brown "when activated" powers fire from right to left.',
      tips: ['Build your Forest row first — you need food to play more birds.', 'Pink powers trigger on other players\' turns — they\'re very powerful.'],
    },
    {
      title: '🏆 Scoring',
      content: 'Add up: bird card VP, bonus card VP, end-of-round goals, 1 point per egg on birds, 1 point per food cached on birds, 1 point per tucked card. Highest total wins!',
      tips: ['Don\'t ignore end-of-round goals — they\'re worth 4-7 points.'],
    },
  ],
  quickRules: {
    turnOrder: [
      'Place an action cube on one of 4 rows on your player mat',
      'Perform the action (Play Bird, Gain Food, Lay Eggs, or Draw Cards)',
      'Activate birds in that row from right to left (brown powers)',
      'Round ends when all players use all action cubes',
      'Score end-of-round goal, then start next round with 1 fewer cube',
    ],
    actions: [
      'Play a Bird: pay food cost + egg cost, place in matching habitat',
      'Gain Food: take 1 die from birdfeeder (+ bonus from forest birds)',
      'Lay Eggs: place eggs on birds with egg capacity (+ bonus from grassland birds)',
      'Draw Cards: take 1 card from tray or deck (+ bonus from wetland birds)',
    ],
    scoring: [
      'Bird card printed VP',
      'Bonus card VP (end of game)',
      'End-of-round goal points',
      '1 VP per egg on birds',
      '1 VP per cached food on birds',
      '1 VP per tucked card',
    ],
    edgeCases: [
      'If birdfeeder is empty or has only 1 die face type, reroll all dice',
      'Egg capacity is per bird — can\'t exceed the egg limit printed on each card',
      'You lose 1 action cube per round (8, 7, 6, 5)',
      'Face-up tray refills immediately when a card is taken',
    ],
  },
  turnPhases: [
    { name: 'Choose Action', description: 'Place action cube on a row.', actions: ['Play Bird', 'Gain Food', 'Lay Eggs', 'Draw Cards'] },
    { name: 'Execute', description: 'Perform the chosen action.', actions: ['Pay costs', 'Take resources', 'Place bird'] },
    { name: 'Activate Engine', description: 'Activate brown powers right to left.', actions: ['Trigger each bird\'s power'] },
  ],
  actions: [
    { name: 'Play a Bird', description: 'Place a bird from your hand into its matching habitat.', cost: 'Food tokens (varies) + 1 egg per column after the first', example: 'Play a Robin in the Forest — pay 1 worm.' },
    { name: 'Gain Food', description: 'Take food dice from the birdfeeder.', cost: 'Free (1 action cube)', example: 'Take a wheat die from the feeder.' },
    { name: 'Lay Eggs', description: 'Place eggs on your birds.', cost: 'Free (1 action cube)', example: 'Place 2 eggs on your birds with remaining egg capacity.' },
    { name: 'Draw Cards', description: 'Take bird cards from tray or deck.', cost: 'Free (1 action cube)', example: 'Take the face-up Hawk from the tray.' },
  ],
  ruleSnippets: [
    { category: 'Powers', text: 'Brown powers activate when you use that habitat\'s action. Pink powers trigger on opponents\' turns. White powers are one-time when played.' },
    { category: 'Birdfeeder', text: 'If the feeder is empty, reroll all 5 dice. If it has dice but all show the same face, you may reroll.' },
    { category: 'Habitat Columns', text: 'Playing birds further right in a habitat costs more eggs, but strengthens that habitat\'s action.' },
  ],
  tips: [
    { text: 'Your first few birds should go in the Forest — you need food to play more birds.', isBeginner: true },
    { text: 'Eggs are a resource, not just points — you need them to play birds in columns 2-5.', isBeginner: true },
    { text: 'Check the end-of-round goals at the start — build toward them from round 1.', isBeginner: true },
    { text: 'Brown powers in the same habitat chain together — build combos!', isBeginner: false },
    { text: 'Late-game points from tucking and caching can add up fast. Don\'t underestimate them.', isBeginner: false },
  ],
  firstPlaySteps: [
    { phase: 'Setup', instruction: 'Keep 3 bird cards and 2 food tokens (or adjust based on what you can play immediately).', hint: 'Look at the food costs on your birds — keep food you can actually use.' },
    { phase: 'Round 1', instruction: 'Focus on gaining food and playing 2-3 birds, especially in the Forest.', hint: 'Don\'t worry about eggs yet — you won\'t need them until column 2.' },
    { phase: 'Round 2', instruction: 'Start laying eggs and play birds in Grassland or Wetland to diversify.', hint: 'You have 1 fewer action cube — be efficient!' },
    { phase: 'Round 3', instruction: 'Focus on your engine. Activate rows with multiple birds for big chain combos.', hint: 'Check the end-of-round goal and adjust your strategy.' },
    { phase: 'Round 4', instruction: 'Maximize points — play high-VP birds, lay eggs, tuck and cache.', hint: 'Only 5 actions this round. Every move counts!' },
  ],
};
