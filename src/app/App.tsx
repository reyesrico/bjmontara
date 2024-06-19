'use client'

import React from 'react';

import BlackJackGame from '@/components/BlackJackGame';

const MAX_PLAYERS = 3;

const App = () => {
  const [start, setStart] = React.useState<boolean>(false);
  const [players, setPlayers] = React.useState<number>(0);
  const styles = getStyles();

  const addPlayer = () => {
    if (players < MAX_PLAYERS) {
      setPlayers(players+1);
    }
  }
  
  const removePlayer = () => {
    if (players > 0) {
      setPlayers(players-1);
    }
  };

  if (!start) {
    return (
      <div style={styles.container}>
        <h2>Number of Players</h2>
        <h3>{players}</h3>
        <hr></hr>
        <div style={styles.startButtonContainer}>
        <button style={styles.button} onClick={() => setStart(true)}>{"START GAME"}</button>
        </div>
        <hr></hr>
        <div style={styles.buttonsContainer}>
        <button style={styles.button} onClick={addPlayer}>{"+1"}</button>
        <button style={styles.button} onClick={removePlayer}>{"-1"}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlackJackGame numberPlayers={players} />
    </div>
  )
};

export default App;

const getStyles = () => ({
  container: {
    backgroundColor: "#CDA37D",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center"
  },
  startButtonContainer: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
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
});
