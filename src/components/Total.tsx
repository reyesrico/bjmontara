import React from 'react';

import { getTotalFromCards } from '@/helpers/cardHelpers';
import { CardType } from '@/types/types';
import { get } from 'http';

interface TotalProps {
  hand: CardType[];
};

const Total = (props: TotalProps) => {
  const { hand } = props;
  const { totals, isBust, isBlackJack } = getTotalFromCards(hand);
  const totalValues = `[ ${totals.join(", ")} ]`;

  if (isBlackJack) {
    return <div className="bj-total bj-total-blackjack">BLACKJACK!</div>;
  }
  if (isBust) {
    return <div className="bj-total bj-total-bust">BUST {totalValues}</div>;
  }
  return <div className="bj-total">Total: {totalValues}</div>;
}

export default Total;
