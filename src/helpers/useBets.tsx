import { useState } from 'react';

import { BetResult, BetsType, CardType,
  InsuranceType, PlayerType, ResultType } from '@/types/types';
import { getResult } from '@/helpers/resultHelper';

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
        return bet + (bet * 1.5);
      case "win":
        return bet + bet;
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
    players: PlayerType[],
    dealerHand: CardType[],
    isDealerBJ: boolean
  ) => {
    return players.reduce((acc: BetResult[], player) => {
      const playerId = player.id;
      const insurance = insurances
        .find(insurance => insurance.playerId === playerId)?.insurance;
      const results = player.hands.map((hand, i) => {
        const result = getResult(dealerHand, hand, isDealerBJ);
        return {
          playerId,
          handsId: i,
          result: resultBet(playerId, i, result.result, insurance)
        };
      });

      acc = [...acc, ...results];
      return acc;
    }, []);
  }

  return {
    bets,
    addBet,
    removeBet,
    resultBet,
    clearBets,
    currentBet,
    executeBets
  };
}