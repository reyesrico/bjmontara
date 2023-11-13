import React from 'react';

import { getTotalFromCards } from '@/helpers/cardHelpers';
import { CardType } from '@/types/types';
import { get } from 'http';

interface TotalProps {
  hand: CardType[];
};

const getStyles = () => ({
  text: {
    backgroundColor: "#CDA37D",
    color: "#6A3A1C",
  }
});

const Total = (props: TotalProps) => {
  const { hand } = props;
  const { totals } = getTotalFromCards(hand);
  const totalValues = `[ ${totals.join(", ")} ]`;
  const styles = getStyles();
  const isBlackJack = getTotalFromCards(hand).isBlackJack;

  if (isBlackJack) {
    return <div style={styles.text}>Blackjack!</div>;
  }
  return <div style={styles.text}>Totals {totalValues}</div>;
}

export default Total;
