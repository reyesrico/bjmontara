import React from 'react';

import { BetsControl, PlayerType, chipTypes } from '@/types/types';

interface PlayerBetProps {
  bets: BetsControl;
  player: PlayerType;
  playerReady: () => void;
  waitForBets: boolean;
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: 200
  },
  betsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid black"
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    borderBottom: "2px solid black",
    padding: 4
  },
  button: {
    backgroundColor: "#61AFD5",
    color: "black",
    height: 50,
    padding: 4,
    border: "1px black solid",
    width: "35%",
  },
};

const PlayerBet = (props: PlayerBetProps) => {
  const { bets, player, playerReady, waitForBets } = props;
  const [betDone, setBetDone] = React.useState(false);
  const [buttonClicked, setButtonClicked] = React.useState("");

  React.useEffect(() => {
    setBetDone(false);
  }, [waitForBets]);

  const deal = () => {
    setBetDone(true);
    setButtonClicked("");
    playerReady();
  }

  const buttonText = React.useMemo(() => {
    return betDone ? "Player Ready!" : "Deal"
  }, [betDone]);

  const buttonsStyle = React.useMemo(() => ({
    ...styles.betsContainer,
    backgroundColor: betDone ? "lavender" : "transparent"
  }), [betDone]);

  const add = (chip: number) => {
    bets.addBet?.(player.id, 0, chip);
    setButtonClicked(`a-${chip}`);
  };

  const remove = (chip: number) => {
    bets.removeBet?.(player.id, 0, chip);
    setButtonClicked(`r-${chip}`);
  }

  return (
    <div style={styles.container}>
      <div>Money: {player.money}</div>
      <div>Current Bet: {bets.currentBet?.(player.id, 0)}</div>
      <hr />
      {waitForBets && (
        <>
          <div style={buttonsStyle}>
            {chipTypes.map(((chip, i) => {
              return (
                <div key={i} style={styles.buttonsContainer}>
                  <button disabled={betDone} onClick={() => add(chip)}
                    style={{
                      ...styles.button,
                      backgroundColor: buttonClicked === `a-${chip}` ? "#390072" : "#61AFD5",
                      color: buttonClicked === `a-${chip}` ? "white" : "black"
                    }} >
                    +{chip}
                  </button>
                  <button disabled={betDone} onClick={() => remove(chip)}
                    style={{
                      ...styles.button,
                      backgroundColor: buttonClicked === `r-${chip}` ? "#390072" : "#61AFD5",
                      color: buttonClicked === `r-${chip}` ? "white" : "black"
                    }} >
                    -{chip}
                  </button>
                </div>
              );
            }))}
          </div>
          <button onClick={deal}>{buttonText}</button>
        </>
      )}
    </div>
  );
};

export default PlayerBet;
