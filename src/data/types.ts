export type Complexity = 'low' | 'medium' | 'high';

export interface SetupStep {
  stepNumber: number;
  instruction: string;
  expansionId?: string; // only show for specific expansion
  minPlayers?: number; // only show when player count >= this
}

export interface LearnStep {
  title: string;
  content: string;
  tips?: string[];
}

export interface QuickRules {
  turnOrder: string[];
  actions: string[];
  scoring: string[];
  edgeCases: string[];
}

export interface TurnPhase {
  name: string;
  description: string;
  actions: string[];
}

export interface Action {
  name: string;
  description: string;
  cost?: string;
  example?: string;
}

export interface RuleSnippet {
  category: string;
  text: string;
  example?: string;
}

export interface Tip {
  text: string;
  isBeginner: boolean;
}

export interface FirstPlayStep {
  phase: string;
  instruction: string;
  hint?: string;
}

export interface Expansion {
  id: string;
  name: string;
  playerCount: string;
  description: string;
  setupModifications: string[];
  extraRules: string[];
  extraActions: string[];
}

export interface Game {
  id: string;
  name: string;
  imageUrl?: string;
  description: string;
  playerCount: string;
  playTime: string;
  complexity: Complexity;
  category: string;
  expansions: Expansion[];
  setupSteps: SetupStep[];
  learnSteps: LearnStep[];
  quickRules: QuickRules;
  turnPhases: TurnPhase[];
  actions: Action[];
  ruleSnippets: RuleSnippet[];
  tips: Tip[];
  firstPlaySteps: FirstPlayStep[];
  isCustom?: boolean;
}
