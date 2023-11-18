import React, { CSSProperties } from 'react';
import Toggle from './Toggle';

interface SettingsProps {
  showBook: boolean;
  setShowBook: (showBook: boolean) => void;
  cardsInDeck: number;
  indexFinish: number;
  minBet: number;
  setMinBet: (miniBet: number) => void;
}

const getStyles = () => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
  },
  text: {
    marginRight: 12
  },
  minBet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  minBetButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    marginLeft: 8,
  },
  button: {
    backgroundColor: "white",
    color: "black",
    width: 36,
    padding: 4,
    margin: 8,
    border: "1px solid black",
  }
} as any);

const Settings = (props: SettingsProps) => {
  const { setMinBet, minBet, showBook, setShowBook, cardsInDeck, indexFinish } = props;
  const styles = getStyles();

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.toggle}>
          <div style={styles.text}>{"Show Recommendations"}</div>
          <Toggle
            toggled={showBook}
            onClick={() => setShowBook(!showBook)}
          />
        </div>
        <div style={styles.minBet}>
          <h3>Min Bet</h3>
          <div style={styles.minBetButtons}>
            <button
              style={styles.button}
              onClick={() => setMinBet(minBet-1)}
            >{"-"}</button>
            <div>{minBet}</div>
            <button
              style={styles.button}
              onClick={() => setMinBet(minBet + 1)}
            >{"+"}</button>
          </div>
        </div>
        <div>Cards In Deck {cardsInDeck} / {indexFinish}</div>
    </div>
  </div>
  )
}

export default Settings;
