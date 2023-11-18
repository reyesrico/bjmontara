import { useState } from "react";

import { CardType, PlayersHook, PlayerType } from "@/types/types";

const initPlayers = (numberOfPlayers: number) => {
  return Array
    .from({ length: numberOfPlayers })
    .reduce((acc: Record<number, PlayerType>, _, i) => {
      acc[i] = {
        id: i,
        hands: [],
        money: 1000,
      }
      return acc;
    }, {});
}

export const usePlayers = (numberOfPlayers: number) => {
  const [players, setPlayers] =
    useState<Record<number, PlayerType>>(initPlayers(numberOfPlayers));

  const refreshPlayers = () => {
    setPlayers(initPlayers(numberOfPlayers));
  }

  const addHands = (cards: CardType[][]) => {
    let _players = {...players};
    for (let i = 0; i < numberOfPlayers; i++) {
      _players[i].hands.push(cards[i]);
    }
    setPlayers(_players);
  }

  const addCard = (playerId: number, handIndex: number, card: CardType) => {
    setPlayers({ 
      ...players,
      [playerId]: {
        ...players[playerId],
        hands: [
          ...players[playerId].hands.slice(0, handIndex),
          [...players[playerId].hands[handIndex], card],
          ...players[playerId].hands.slice(handIndex+1)
        ]
      }
    })
  }

  const addHandSplit = (playerId: number, handIndex: number, newHands: CardType[][]) => {
    const hands = players[playerId].hands;
    hands[handIndex] = newHands[0];
    hands.splice(handIndex+1, 1, newHands[1]);
  }

  const clearHands = () => {
    Object.keys(players).forEach(key => {
      players[parseInt(key)].hands = [];
    });
  }

  const getHands = (playerId: number) => {
    return players[playerId].hands;
  }

  return {
    players,
    addHands,
    addCard,
    addHandSplit,
    getHands,
    refreshPlayers,
    clearHands
  } as PlayersHook;
}