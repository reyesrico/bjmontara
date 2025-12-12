import React from 'react';

import { CardType } from '@/types/types';
import { getBook } from '@/helpers/book';

interface BookRecommendationProps {
  dealerCard: CardType;
  playerCards: CardType[];
}

const BookRecommendation = (props: BookRecommendationProps) => {
  const { dealerCard, playerCards } = props;
  const book = getBook(dealerCard, playerCards);

  if (!book) return <></>;

  return (
    <div className="bj-recommendation">
      <div className="bj-recommendation-title">📖 Strategy Guide</div>
      <div>Recommended: {book}</div>
    </div>);
};

export default BookRecommendation;