import { useState } from 'react';

import { BetResult, BetsType, CardType,
  InsuranceType, LastBet, LastResult, PlayerType, ResultType } from '@/types/types';
import { getResult } from '@/helpers/resultHelper';

export const useBets = () => {
  const [bets, setBets] = useState<BetsType>({});
  const [insurances, setInsurances] = useState<InsuranceType[]>([]);
  const [lastBets, setLastBets] = useState<LastBet>({});
  const [lastResults, setLastResults] = useState<LastResult>({});
  const [initialBets, setInitialBets] = useState<LastBet>({}); // Track initial bet before splits

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
  
  const snapshotInitialBets = () => {
    // Snapshot current bets for hand 0 as initial bets (before any splits)
    const initial: LastBet = {};
    Object.keys(bets).forEach(playerIdStr => {
      const playerId = parseInt(playerIdStr);
      initial[playerId] = bets[playerId]?.[0] || 0;
    });
    setInitialBets(initial);
    console.log('Snapshotted initial bets:', initial);
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
    setInitialBets({}); // Clear initial bets for new round
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
      
      // Calculate initial bet (hand 0 only) for this player
      const initialBet = initialBets[playerId] || bets[playerId]?.[0] || 0;
      
      // Set initial bet (not total across splits)
      setLastBets(prev => ({...prev, [playerId]: initialBet}));
      
      // Process all hands and aggregate results
      const handResults: Array<'Won' | 'Lost' | 'Tied'> = [];
      
      const results = player.hands.map((hand, i) => {
        const result = getResult(dealerHand, hand, isDealerBJ);
        
        // Track result status for this hand
        let resultStatus: 'Won' | 'Lost' | 'Tied';
        switch(result.result) {
          case "dealer_blackjack":
            resultStatus = insurance ? 'Tied' : 'Lost';
            break;
          case "blackjack":
          case "win":
            resultStatus = 'Won';
            break;
          case "lose":
            resultStatus = 'Lost';
            break;
          default:
            resultStatus = 'Tied';
        }
        handResults.push(resultStatus);
        
        return {
          playerId,
          handsId: i,
          result: resultBet(playerId, i, result.result, insurance)
        };
      });
      
      // Aggregate results: Won > Tied > Lost
      let finalResult: 'Won' | 'Lost' | 'Tied' = 'Lost';
      if (handResults.includes('Won')) {
        finalResult = 'Won';
      } else if (handResults.includes('Tied')) {
        finalResult = 'Tied';
      }
      
      // Set aggregated result once for this player
      setLastResults(prev => ({...prev, [playerId]: finalResult}));
      console.log('Player', playerId, 'hand results:', handResults, '-> final:', finalResult);

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
    executeBets,
    snapshotInitialBets,
    lastBets,
    lastResults,
  };
}