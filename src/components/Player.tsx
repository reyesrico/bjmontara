import React from 'react';

import Card from './Card';
import Total from './Total';

import { getTotalFromCards } from '@/helpers/cardHelpers';
import { BetsControl, CardType, GameState, PlayerType } from '@/types/types';
import PlayerBet from './PlayerBet';

interface PlayerProps {
  player: PlayerType;
  playerHand: CardType[];
  bets: BetsControl;
  turn: number;
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  split: () => void;
  gameState: GameState;
  isDealerBJ: boolean;
  isPlayerBJAction: () => void;
  playerReady: () => void;
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
  button: {
    backgroundColor: "#61AFD5",
    color: "black",
    width: 100,
    height: 50,
    padding: 4,
    border: "1px black solid",
    margin: 4,
  },
  buttonDisabled: {
    backgroundColor: "lightgrey",
    color: "black",
    width: 100,
    height: 50,
    padding: 4,
    border: "1px black solid",
    margin: 4,
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: args.playerIndex===args.turn ? "#613414" : "transparent"
  },
  buttonsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsColumn: {
    display: "flex",
    flexDirection: "column",
  }
});

const Player = (props: PlayerProps) => {
  const { bets, player, playerHand, turn, playerReady, doubleDown,
    split, hit, stand, gameState, isDealerBJ, isPlayerBJAction } = props;
  const styles = getStyles({ playerIndex: player.id, turn });
  const liveGame = gameState === "gameStarted";
  const disableHit = liveGame && getTotalFromCards(playerHand).isBust;
  const playerBJ = liveGame && getTotalFromCards(playerHand).isBlackJack;
  const disableDoubleDown = playerHand?.length !== 2 || playerBJ;

  React.useEffect(() => {
    if (player.id === turn && playerBJ) {
      isPlayerBJAction();
    }
  }, [isPlayerBJAction, playerBJ, player, turn]);

  const showButtons = React.useMemo(() => {
    const liveGame = gameState === "gameStarted";
    return liveGame && player.id === turn && !isDealerBJ && !playerBJ;
  }, [isDealerBJ, gameState, playerBJ, player, turn]);

  const buttonStyle = React.useCallback((doubleDown = false) => {
    const isDoubleDown = doubleDown ? disableDoubleDown : false;
    return (disableHit || isDoubleDown) ? styles.buttonDisabled : styles.button;
  }, [disableDoubleDown, disableHit, styles]);

  return (
    <div style={styles.container} >
      <h1 style={styles.title}>Player {player.id+1}</h1>
      <hr />
      <div style={styles.cardsContainer}>
        {playerHand?.map((card: CardType, index: number) =>
          <Card key={index} number={card.number} suit={card.suit} />
        )}
      </div>
      {liveGame && <Total hand={playerHand} />}
      <hr />
      <PlayerBet bets={bets} player={player} playerReady={playerReady} waitForBets={gameState === "waitForBets"}/>
      <hr />
      {showButtons && (
        <div style={styles.buttonsRow}>
          <div style={styles.buttonsColumn}>
            <button disabled={disableHit} style={buttonStyle()} onClick={hit}>Hit</button>
            <button style={buttonStyle()} onClick={stand}>Stand</button>
          </div>
          <div style={styles.buttonsColumn}>
            <button disabled={disableDoubleDown} style={buttonStyle(true)} onClick={doubleDown}>Double Down</button>
            <button disabled={true} style={styles.buttonDisabled} onClick={split}>Split</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
