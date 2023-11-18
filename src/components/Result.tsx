import React from 'react';

import { CardType } from '@/types/types';
import { getResult } from '@/helpers/resultHelper';

interface ResultProps {
  dealerHand: CardType[];
  playerHand: CardType[];
  isDealerBJ: boolean;
}

const Result = (props: ResultProps) => {
  const { dealerHand, playerHand, isDealerBJ } = props;
  const { color, resultText } =
    getResult(dealerHand, playerHand, isDealerBJ);

  return <div style={{ color, width: "100%" }}>{resultText}</div>;
};

export default Result;
