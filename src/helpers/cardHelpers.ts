import { CardType, Number, Suit } from "@/types/types";

const shuffleDeck = (deck: CardType[]) => {
  // Shuffle the deck using the Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export const generateDeck = (): CardType[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const numbers: CardType['number'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J','Q', 'K'];
  let deck: CardType[] = [];

  // Generate a sorted deck
  suits.forEach(suit => {
    numbers.forEach(number => {
      deck.push({
        suit,
        number
      });
    });
  });

  shuffleDeck(deck);
  return deck;
}

export const getCardValue = (card: CardType): number => {
  if (['J', 'Q', 'K'].includes(card.number)) {
    return 10;
  } else if (card.number === 'A') {
    return 11;
  } else {
    return parseInt(card.number);
  }
}

export const getTotalFromCards = (cards: CardType[]): {
  total: number;
  totals: number[];
  isBust: boolean;
  isBlackJack: boolean;
} => {
  let totals: number[] = [0, 0];

  // If there is an ace, we need to calculate the total with 1 and 11
  cards.forEach(card => {
    if (card.number === 'A') {
      totals[0] += 1;
      totals[1] += totals[1] <= 10 ? 11 : 1;
    } else {
      const cardValue = getCardValue(card);
      totals[0] += cardValue;
      totals[1] += cardValue;
    }
  });


  const total = Math.max(...totals) > 21
  ? Math.min(...totals)
  : Math.max(...totals);

  const isBust = totals.every(total => total > 21);
  const isBlackJack = totals.some(total => total === 21) && cards.length === 2;

  return { total, totals, isBust, isBlackJack };
}

export const generateBJDeck = () => {
  let deck: CardType[] = [];
  const numberOfDecks = 6;
  const halfOfDeck = 52 * (numberOfDecks / 2);
  // Random number from 5 to half of the full deck
  const deckIndexFinish = Math.floor(Math.random() * halfOfDeck) + 5;

  for (let i = 0; i < numberOfDecks; i++) {
    const d = generateDeck();
    deck = [...deck, ...d];
  }

  shuffleDeck(deck);

  return {
    deckIndexFinish,
    deck
  };
};

// TODO: To review
export const dealerShouldHit = (totals: number[]): boolean => {
  if (
    totals[0] >= 17 && totals[0] <= 21 ||
    totals[1] >= 17 && totals[1] <= 21) { 
      return false;
  } else if (totals[0] > 21 && totals[1] > 21) {
    return false;
  } else {
    return true;
  }
}

export const isNumberInCards = (number: Number, cards: CardType[]) => {
  return cards.some(card => card.number === number);
}
