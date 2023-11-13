import { useState } from 'react';

import { BetsControl, BetsType, CardType, InsuranceType, PlayersHands, ResultType } from '@/types/types';
import { getResult } from '@/components/Result';

export const useBets = () => {
  const [bets, setBets] = useState<BetsType>({});
  const [insurances, setInsurances] = useState<InsuranceType[]>([]);

  const addInsurance = (playerId: number, insurance: number) => {
    setInsurances([...insurances, { playerId, insurance }]);
  }

  const addBet = (playerId: number, handsId: number, bet: number) => {
    setBets({...bets,
      [playerId]: {
        ...bets[playerId],
        [handsId]: bets[playerId]?.[handsId] ? bets[playerId][handsId] + bet : bet
      }});
  }

  const removeBet = (playerId: number, handsId: number, bet: number) => {
    setBets({...bets,
      [playerId]: {
        ...bets[playerId],
        [handsId]: bets[playerId]?.[handsId] > bet ? bets[playerId][handsId] - bet : 0
      }});
  }

  const resultBet = (playerId: number, handsId: number,
    result: ResultType, insurance=0) => {
    const bet = bets[playerId]?.[handsId] || 0;
    switch(result) {
      case "dealer_blackjack":
        return insurance ? insurance * 2 : -1 * bet;
      case "blackjack":
        return bet * 1.5;
      case "win":
        return bet;
      case "lose":
        return -1 * bet;
      default:
        return 0;
    }
  }

  const currentBet = (playerId: number, handsId: number) => {
    return bets[playerId]?.[handsId] || 0;
  }

  const clearBets = () => {
    setBets({});
  }

  const executeBets = (
    playersHands: PlayersHands,
    dealerHand: CardType[],
    isDealerBJ: boolean
  ) => {
    return Object.keys(playersHands).map(Number).map(playerId => {
      const insurance = insurances
        .find(insurance => insurance.playerId === playerId)?.insurance;
      const result =
        getResult(dealerHand, playersHands[playerId], isDealerBJ);

      const handsId = 0; // for now
      return {
        playerId,
        handsId,
        result: resultBet(playerId, 0, result.result, insurance)
      };
    });
  }

  return {
    bets,
    addBet,
    removeBet,
    resultBet,
    clearBets,
    currentBet,
    executeBets
  } as BetsControl;
}