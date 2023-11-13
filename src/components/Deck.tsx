import React from 'react';

import { Number, Suit } from '@/types/types';

import Card from './Card';

interface DeckProps {
  cards: { number: Number, suit: Suit }[];
}

const Deck: React.FC<DeckProps> = ({ cards }) => {
  return (
    <div className="deck">
      {cards.map((card, index) => 
        <Card key={index} number={card.number} suit={card.suit} />
      )}
    </div>
  );
}

export default Deck;