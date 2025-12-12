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
  
  const resultClass = color === 'green' ? 'bj-result-win' : color === 'red' ? 'bj-result-lose' : 'bj-result-push';

  return <div className={`bj-result ${resultClass}`}>{resultText}</div>;
};

export default Result;
