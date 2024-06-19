import React from 'react';

import PlayerHand from './PlayerHand';
import PlayerBet from './PlayerBet';
import Result from './Result';

import { BetsControl, CardType, GameState, PlayersHook, PlayerType } from '@/types/types';
import { getTotalFromCards } from '@/helpers/cardHelpers';

interface PlayerProps {
  player: PlayerType;
  isLastPlayer: boolean;
  bets: BetsControl;
  turn: number;
  gameState: GameState;
  isDealerBJ: boolean;
  playerReady: () => void;
  deckHook: any;
  playersHook: PlayersHook;
  setTurn: (turn: number) => void;
  minBet: number;
  dealerHand: CardType[];
}

const getStyles = (args: {
  playerIndex: number,
  turn: number 
}): any => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    backgroundColor: "#CDA37D",
    color: "#6A3A1C",
  },
  handsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  handContainer: {
    display: "flex",
    flexDirection: "column",
  }
});

const Player = (props: PlayerProps) => {
  const { bets, player, turn, playerReady, isLastPlayer, gameState, minBet,
    dealerHand, deckHook, playersHook, isDealerBJ, setTurn } = props;
  const styles = getStyles({ playerIndex: player.id, turn });
  const liveGame = gameState === "gameStarted";
  const waitForBets = gameState === "waitForBets";

  const doubleDown = (handId: number, hand: CardType[]) => {
    let card = deckHook.drawCards(1)[0];
    hand.push(card);

    // Applying double down bet
    const currentBet = bets.currentBet?.(turn, handId) || 0;
    bets.addBet?.(turn, handId, currentBet);

    if (!isLastPlayer) {
      setTurn(turn + 1);
    } else {
      stand(handId);
    }
  }

  const split = (handsTurn: number, hand: CardType[]) => {
    const newCards = deckHook.drawCards(2);
    const firstHand = [hand[0], newCards[0]];
    const secondHand = [hand[1], newCards[1]];

    playersHook.addHandSplit(turn, handsTurn, [firstHand, secondHand]);

    const currentBet = bets.currentBet?.(turn, 0) || 0;
    bets.addBet?.(turn, 1, currentBet);
  }

  const hit = (handId: number) => {
    let card = deckHook.drawCards(1)[0];
    playersHook.addCard(player.id, handId, card);
    const hand = playersHook.getHands(player.id)[handId];

    if (getTotalFromCards([...hand, card]).isBust) {
      console.log("BUST");
      if (!isLastPlayer) {
        setTurn(turn + 1);
      } else {
        stand(handId);
      }
    }
  }

  const stand = (handId: number) => {
    const handsTotal = player.hands.length;
    if (handId < handsTotal - 1) {
      // pass to the next same player hand.
    } else {
      setTurn(turn + 1);
    }
  }

  const isPlayerBJAction = (handId: number) => {
    if (!isLastPlayer) {
      setTurn(turn + 1);
    } else {
      stand(handId);
    }
  }

  return (
    <div style={styles.container} >
      <h1 style={styles.title}>Player {player.id+1}</h1>
      <hr />
      {waitForBets &&
        <PlayerBet
          bets={bets}
          player={player}
          playerReady={playerReady}
          minBet={minBet}
        />
      }
      {(!waitForBets && !player.hands.length) &&
        <div style={styles.title}>Player Ready</div>}
      <div style={styles.handsContainer}>
        {player.hands.map((hand, index) => (
          <div key={index} style={styles.handContainer}>
            <PlayerHand
              key={index}
              player={player}
              bets={bets}
              hand={hand}
              liveGame={liveGame}
              gameState={gameState}
              turn={turn}
              isDealerBJ={isDealerBJ}
              playerReady={playerReady}
              hit={() => hit(index)}
              stand={() => stand(index)}
              doubleDown={() => doubleDown(index, hand)}
              isPlayerBJAction={() => isPlayerBJAction(index)}
              split={() => split(index, hand)}      
            />
            {gameState === 'gameFinished' &&
              <Result
                dealerHand={dealerHand}
                playerHand={hand}
                isDealerBJ={isDealerBJ}
              />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Player;
