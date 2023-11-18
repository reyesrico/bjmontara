import React from 'react';

import Card from "./Card";
import Total from "./Total";

import { BetsControl, CardType, GameState, PlayerType } from "@/types/types";
import { getTotalFromCards } from "@/helpers/cardHelpers";

const getStyles = (args: {
  playerIndex: number,
  turn: number 
}): any => ({
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
  const { player, hand, liveGame, gameState, isDealerBJ, key,
    turn, hit, stand, doubleDown, split, isPlayerBJAction } = props;

  const styles = getStyles({ playerIndex: player.id, turn });
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

  const buttonHitStyle = React.useMemo(() => {
    return disableHit ? styles.buttonDisabled : styles.button;
  }, [disableHit, styles]);

  const buttonDoubleDownStyle = React.useMemo(() => {
    return disableDoubleDown ? styles.buttonDisabled : styles.button;
  }, [disableDoubleDown, styles]);

  const buttonSplitStyle = React.useMemo(() => {
    return enableSplit ? styles.button : styles.buttonDisabled;
  }, [enableSplit, styles]);

  return (
    <div>
      <div style={styles.cardsContainer}>
        {hand?.map((card: CardType, index: number) =>
          <Card key={index} number={card.number} suit={card.suit} />
        )}
      </div>
      {liveGame && <Total hand={hand} />}
      <hr />
      {showButtons && (
        <div style={styles.buttonsRow}>
          <div style={styles.buttonsColumn}>
            <button disabled={disableHit} style={buttonHitStyle}
              onClick={hit}>Hit</button>
            <button style={styles.button}
              onClick={stand}>Stand</button>
          </div>
          <div style={styles.buttonsColumn}>
            <button disabled={disableDoubleDown} style={buttonDoubleDownStyle}
              onClick={doubleDown}>Double Down</button>
            <button disabled={!enableSplit} style={buttonSplitStyle}
              onClick={split}>Split</button>
          </div>
        </div>
      )}
    </div>
  )
};

export default PlayerHand;
