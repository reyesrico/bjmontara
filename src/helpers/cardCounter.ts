import { CardType, Number } from '@/types/types';

/**
 * Card Counting Service using Hi-Lo Strategy
 * Based on: https://www.wikihow.com/Count-Cards
 * 
 * Hi-Lo System:
 * - Cards 2-6: +1
 * - Cards 7-9: 0
 * - Cards 10, J, Q, K, A: -1
 */

export interface CardCountResult {
  runningCount: number;
  trueCount: number;
  recommendation: string;
  shouldBet: boolean;
  betMultiplier: number;
}

/**
 * Get the Hi-Lo value for a card
 */
const getCardValue = (cardNumber: Number): number => {
  switch (cardNumber) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      return 1; // Low cards increase count
    case '7':
    case '8':
    case '9':
      return 0; // Neutral cards
    case '10':
    case 'J':
    case 'Q':
    case 'K':
    case 'A':
      return -1; // High cards decrease count
    default:
      return 0;
  }
};

/**
 * Calculate the running count from all visible cards
 */
const calculateRunningCount = (cards: CardType[]): number => {
  return cards.reduce((count, card) => count + getCardValue(card.number), 0);
};

/**
 * Calculate the true count based on remaining decks
 * True Count = Running Count / Number of Decks Remaining
 */
const calculateTrueCount = (runningCount: number, decksRemaining: number): number => {
  if (decksRemaining <= 0) return 0;
  return Math.round((runningCount / decksRemaining) * 10) / 10; // Round to 1 decimal
};

/**
 * Estimate remaining decks from cards used
 * Standard deck has 52 cards
 * Rounds to nearest half-deck for practical card counting
 */
const estimateDecksRemaining = (totalDecks: number, cardsUsed: number): number => {
  const totalCards = totalDecks * 52;
  const cardsRemaining = totalCards - cardsUsed;
  const exactDecks = cardsRemaining / 52;
  
  // Round to nearest half-deck (0.5) for standard card counting practice
  // Examples: 5.8 → 6.0, 5.3 → 5.5, 5.7 → 5.5
  const roundedDecks = Math.round(exactDecks * 2) / 2;
  
  return Math.max(0.5, roundedDecks); // Minimum 0.5 decks
};

/**
 * Get recommendation based on true count
 */
const getRecommendation = (trueCount: number): string => {
  if (trueCount >= 5) {
    return "Excellent! Strong advantage - Maximum bet recommended";
  } else if (trueCount >= 3) {
    return "Very Good! High cards remaining - Increase bet significantly";
  } else if (trueCount >= 2) {
    return "Good! Favorable deck - Increase bet moderately";
  } else if (trueCount >= 1) {
    return "Slight advantage - Small bet increase";
  } else if (trueCount >= 0) {
    return "Neutral deck - Minimum bet recommended";
  } else if (trueCount >= -1) {
    return "Slightly unfavorable - Minimum bet or wait";
  } else if (trueCount >= -2) {
    return "Unfavorable - Consider minimum bet or sitting out";
  } else {
    return "Very Unfavorable - Strongly consider sitting out this hand";
  }
};

/**
 * Determine if player should bet and bet multiplier
 */
const getBettingStrategy = (trueCount: number): { shouldBet: boolean; betMultiplier: number } => {
  if (trueCount >= 5) {
    return { shouldBet: true, betMultiplier: 5 };
  } else if (trueCount >= 3) {
    return { shouldBet: true, betMultiplier: 4 };
  } else if (trueCount >= 2) {
    return { shouldBet: true, betMultiplier: 3 };
  } else if (trueCount >= 1) {
    return { shouldBet: true, betMultiplier: 2 };
  } else if (trueCount >= 0) {
    return { shouldBet: true, betMultiplier: 1 };
  } else {
    // Negative count - still bet minimum but flag as unfavorable
    return { shouldBet: true, betMultiplier: 1 };
  }
};

/**
 * Main card counting function
 * 
 * @param totalDecks - Number of decks being used in the shoe
 * @param visibleCards - All cards currently visible on the table (player hands, dealer up card, etc.)
 * @param cardsUsed - Total number of cards that have been dealt from the shoe
 * @returns Card counting result with recommendations
 */
export const countCards = (
  totalDecks: number,
  visibleCards: CardType[],
  cardsUsed: number
): CardCountResult => {
  // Calculate running count from visible cards
  const runningCount = calculateRunningCount(visibleCards);
  
  // Estimate remaining decks
  const decksRemaining = estimateDecksRemaining(totalDecks, cardsUsed);
  
  // Calculate true count
  const trueCount = calculateTrueCount(runningCount, decksRemaining);
  
  console.log('🎯 Card Counter Math:', {
    'Total Decks in Shoe': totalDecks,
    'Cards Used': cardsUsed,
    'Cards Remaining': (totalDecks * 52) - cardsUsed,
    'Decks Remaining': decksRemaining.toFixed(2),
    '---': '---',
    'Running Count': runningCount,
    'True Count Formula': `${runningCount} / ${decksRemaining.toFixed(2)} = ${trueCount}`,
    'True Count': trueCount,
    '---': '---',
    'Bet Multiplier (based on True Count)': getBettingStrategy(trueCount).betMultiplier
  });
  
  // Get recommendation
  const recommendation = getRecommendation(trueCount);
  
  // Get betting strategy
  const { shouldBet, betMultiplier } = getBettingStrategy(trueCount);
  
  return {
    runningCount,
    trueCount,
    recommendation,
    shouldBet,
    betMultiplier
  };
};

/**
 * Get all visible cards from the game state
 * This includes player hands and dealer's visible card(s)
 */
export const getAllVisibleCards = (
  playerHands: CardType[][],
  dealerCards: CardType[],
  hideDealerSecondCard: boolean = false
): CardType[] => {
  const allCards: CardType[] = [];
  
  // Add all player cards
  playerHands.forEach(hand => {
    allCards.push(...hand);
  });
  
  // Add dealer cards (possibly hiding second card during game)
  if (hideDealerSecondCard && dealerCards.length > 0) {
    allCards.push(dealerCards[0]); // Only first card visible
  } else {
    allCards.push(...dealerCards);
  }
  
  return allCards;
};
