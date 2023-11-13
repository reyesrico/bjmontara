import React from 'react';

import { CardType, ResultType } from '@/types/types';
import { getTotalFromCards } from '@/helpers/cardHelpers';

interface ResultProps {
  dealerHand: CardType[];
  playerHand: CardType[];
  isDealerBJ: boolean;
}

export const getResult = (
  dealerHand: CardType[],
  playerHand: CardType[],
  isDealerBJ: boolean,
) => {
  const dealerTotal = getTotalFromCards(dealerHand).total;
  const { total, isBlackJack } = getTotalFromCards(playerHand);

  let resultText = "";
  let color = "transparent";
  let result: ResultType;

  if (total > 21) {
    resultText = "Player Bust";
    color = "red";
    result = "lose";
  } else if (dealerTotal > 21) {
    resultText = "Dealer Bust";
    color = "green";
    result = "win";
  } else if (isDealerBJ && !isBlackJack) {
    resultText = "Dealer Wins (Blackjack)";
    color = "red";
    result = "dealer_blackjack";
  } else if (isBlackJack) {
    resultText = "Player Wins (Blackjack)";
    color = "green";
    result = "blackjack";
  } else if (total < dealerTotal) {
    resultText = "Dealer Wins";
    color = "red";
    result = "lose";
  } else if (total > dealerTotal) {
    resultText = "Player Wins";
    color = "green";
    result = "win";
  } else {
    resultText = "Push";
    color = "black";
    result = "draw";
  }

  return {
    resultText,
    color,
    result
  }
};

const Result = (props: ResultProps) => {
  const { dealerHand, playerHand, isDealerBJ } = props;
  const { color, resultText } =
    getResult(dealerHand, playerHand, isDealerBJ);

  return <div style={{ color, width: "100%" }}>{resultText}</div>;
};

export default Result;
