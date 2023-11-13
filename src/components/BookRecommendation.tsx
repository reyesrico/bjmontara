import React from 'react';

import { CardType } from '@/types/types';
import { getBook } from '@/helpers/book';

interface BookRecommendationProps {
  dealerCard: CardType;
  playerCards: CardType[];
}

const getStyles = () => ({
  text: {
    backgroundColor: "#CDA37D",
    color: "#6A3A1C",
  }
});

const BookRecommendation = (props: BookRecommendationProps) => {
  const { dealerCard, playerCards } = props;
  const book = getBook(dealerCard, playerCards);
  const styles = getStyles();

  if (!book) return <></>;

  return (
    <div style={styles.text}>
      Reco: {book}
    </div>);
};

export default BookRecommendation;