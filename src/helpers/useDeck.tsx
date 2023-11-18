import { useState } from 'react';
import { dealerShouldHit, generateBJDeck, getTotalFromCards } from './cardHelpers';
import { CardType, DeckHook } from '@/types/types';

export const useDeck = () => {
  const { deckIndexFinish: dif, deck: initialDeck } = generateBJDeck();
  const [deck, setDeck] = useState<CardType[]>(initialDeck);
  const [deckIndexFinish, setDeckIndexFinish] = useState<number>(dif);

  const refreshDeck = () => {
    const { deckIndexFinish: dif, deck: initialDeck } = generateBJDeck();
    setDeck(initialDeck);
    setDeckIndexFinish(dif);
  }

  const drawCards = (numCards: number) => {
    const cards = [];
    for (let i = 0; i < numCards; i++) {
      cards.push(deck.pop()!);
    }
    return cards;
  }

  const drawCardsForDealer = (dealerCards: CardType[]) => {
    let totals = getTotalFromCards(dealerCards).totals;
    let shouldHit = dealerShouldHit(totals);

    // Creating a copy of the dealerCards array
    let newDealerCards = [...dealerCards];
  
    while (shouldHit) {
      const card = deck.pop()!;
      newDealerCards.push(card);
      const _totals = getTotalFromCards(newDealerCards).totals;
      shouldHit = dealerShouldHit(_totals);
    }
    return newDealerCards;
  }

  return {
    deck,
    deckIndexFinish,
    refreshDeck,
    drawCards,
    drawCardsForDealer
  } as DeckHook;
}
