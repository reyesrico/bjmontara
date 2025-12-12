import React from 'react';

import Card from "./Card";
import Total from "./Total";

import { BetsControl, CardType, GameState, PlayerType } from "@/types/types";
import { getTotalFromCards } from "@/helpers/cardHelpers";

interface PlayerHandProps {
  key: number;
  player: PlayerType;
  bets: BetsControl;
  hand: CardType[];
  liveGame: boolean;
  gameState: GameState;
  turn: number;
  isDealerBJ: boolean;
  playerReady: () => void;
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  split: () => void;
  isPlayerBJAction: () => void;
}

const PlayerHand = (props: PlayerHandProps) => {
  const { player, hand, liveGame, gameState, isDealerBJ, bets, key,
    turn, hit, stand, doubleDown, split, isPlayerBJAction } = props;

  const disableHit = liveGame && getTotalFromCards(hand).isBust;
  const playerBJ = liveGame && getTotalFromCards(hand).isBlackJack;
  const disableDoubleDown = hand?.length !== 2 || playerBJ;

  React.useEffect(() => {
    if (player.id === turn && playerBJ) {
      isPlayerBJAction();
    }
  }, [isPlayerBJAction, playerBJ, player, turn]);

  const showButtons = React.useMemo(() => {
    const liveGame = gameState === "gameStarted";
    return liveGame && player.id === turn && !isDealerBJ && !playerBJ;
  }, [gameState, isDealerBJ, player, playerBJ, turn]);

  const enableSplit = React.useMemo(() => {
    return !isDealerBJ && hand[0].number === hand[1].number;
  }, [hand, isDealerBJ]);

  return (
    <div>
      <div className="bj-player-name">Player {player.id + 1}</div>
      <div className="bj-player-money">💰 ${player.money}</div>
      {bets.lastBets[player.id] !== undefined && bets.lastResults?.[player.id] && (
        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          margin: '5px 0',
          padding: '3px 8px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px',
          color: '#FFD700'
        }}>
          Last Bet: ${bets.lastBets[player.id]} /
          <span style={{ 
            color: bets.lastResults[player.id] === 'Won' ? '#00C853' : 
                   bets.lastResults[player.id] === 'Lost' ? '#D32F2F' : '#FFD700',
            fontWeight: 'bold',
            marginLeft: '4px'
          }}>
            {bets.lastResults[player.id]}
          </span>
        </div>
      )}
      <div className="bj-hand-container">
        {hand?.map((card: CardType, index: number) =>
          <Card key={index} number={card.number} suit={card.suit} />
        )}
      </div>
      {liveGame && <Total hand={hand} />}
      <div className="bj-bet-area">${bets.currentBet?.(player.id, key || 0)}</div>
      {showButtons && (
        <div className="bj-action-buttons">
          <button disabled={disableHit} className="bj-button"
            onClick={hit}>Hit</button>
          <button className="bj-button"
            onClick={stand}>Stand</button>
          <button disabled={disableDoubleDown} className="bj-button"
            onClick={doubleDown}>Double</button>
          <button disabled={!enableSplit} className="bj-button"
            onClick={split}>Split</button>
        </div>
      )}
    </div>
  )
};

export default PlayerHand;
