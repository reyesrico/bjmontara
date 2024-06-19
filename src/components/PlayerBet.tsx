import React from 'react';

import { BetsControl, PlayerType, chipTypes } from '@/types/types';

interface PlayerBetProps {
  bets: BetsControl;
  player: PlayerType;
  playerReady: () => void;
  minBet: number;
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
  error: {
    color: "red",
    backgroundColor: "#f7d7dc",
    width: "100%",
    border: "1px solid red",
  }
};

const PlayerBet = (props: PlayerBetProps) => {
  const { bets, player, playerReady, minBet } = props;
  const [betDone, setBetDone] = React.useState(false);
  const [buttonClicked, setButtonClicked] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setError("");
    setBetDone(false);
  }, []);

  const deal = () => {
    const bet = bets.currentBet?.(player.id, 0) || 0;
    if (bet >= minBet) {
      setError("");
      setBetDone(true);
      setButtonClicked("");
      playerReady();  
    } else {
      setError("Bet must be greater than or equal to the minimum bet");
    }
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
      <div>Last Bet: {bets.lastBets[player.id]}</div>
      {error && <div style={styles.error}>{error}</div>}
      <hr />
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
    </div>
  );
};

export default PlayerBet;
