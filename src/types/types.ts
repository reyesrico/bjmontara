// Game
export type GameState =
  "refreshDeck" | "waitForBets" | "playersReady" | "gameStarted" | "gameFinished" | undefined;

// Cards
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';  
export type Number = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardType = { number: Number, suit: Suit };

// Deck
export type DeckHook = {
  deck: CardType[];
  deckIndexFinish: number;
  refreshDeck: () => void;
  drawCards: (count: number) => CardType[];
  drawCardsForDealer: (dealerCards: CardType[]) => CardType[];
}

// Player
export type PlayerType = { id: number, money: number, hands: CardType[][] };

export type ReadyPlayers = {
  [key: number]: boolean
};

export type PlayersHook = {
  players: Record<number, PlayerType>;
  addCard: (playerId: number, handIndex: number, card: CardType) => void;
  addHands: (cards: CardType[][]) => void;
  addHandSplit: (playerId: number, handIndex: number, newHands: CardType[][]) => void;
  refreshPlayers: () => void;
  clearHands: () => void;
  getHands: (playerId: number) => CardType[][];
}

// Result
export type ResultType = 'win' | 'lose' | 'draw' |
  'blackjack' | 'dealer_blackjack' | undefined;

// Chip
export const chipTypes = [1, 5, 15, 25, 100, 500, 1000] as const;
export type ChipType = typeof chipTypes[number];

// Bets
export type BetsType = {
  [key: number]: {          // playerId
    [key: number]: number;  // handsId -> bet
  }
};

export type BetResult = {
  playerId: number,
  handsId: number,
  result: number,
};

export type LastBet = {
  [key: number]: number;         // playerId -> bet
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
    players: PlayerType[],
    dealerHand: CardType[],
    isDealerBJ: boolean
  ) => {
    playerId: number;
    handsId: number;
    result: number;
  }[];
  lastBets: LastBet;
};
