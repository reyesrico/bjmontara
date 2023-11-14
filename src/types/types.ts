// Game
export type GameState =
  "refreshDeck" | "waitForBets" | "playersReady" | "gameStarted" | "gameFinished" | undefined;

// TODO: DELETE THIS ONE
export type PlayersHands = Record<number, CardType[]>;

// Cards
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';  
export type Number = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardType = { number: Number, suit: Suit };

// Player
export type PlayerType = { id: number, money: number, hands: CardType[][] };

// Result
export type ResultType = 'win' | 'lose' | 'draw' |
  'blackjack' | 'dealer_blackjack' | undefined;

// Chip
export const chipTypes = [0.5, 1, 5, 25, 100, 500, 1000] as const;
export type ChipType = typeof chipTypes[number];

// Bets
export type BetsType = {
  [key: number]: {          // playerId
    [key: number]: number;  // handsId -> bet
  }
};

// Insurance
export type InsuranceType = {
  playerId: number,
  insurance: number,
};

export type BetsControl = {
  bets?: BetsType;
  addBet?: (playerId: number, handsId: number, bet: number) => void;
  removeBet?: (playerId: number, handsId: number, bet: number) => void;
  resultBet?: (playerId: number, handsId: number, result: ResultType) => number;
  clearBets?: () => void;
  currentBet?: (playerId: number, handsId: number) => number;
  executeBets?: (
    playersHands: PlayersHands,
    dealerHand: CardType[],
    isDealerBJ: boolean
  ) => {
    playerId: number;
    handsId: number;
    result: number;
  }[];
};
