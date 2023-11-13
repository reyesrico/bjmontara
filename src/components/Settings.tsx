import React, { CSSProperties } from 'react';
import Toggle from './Toggle';

interface SettingsProps {
  showBook: boolean;
  setShowBook: (showBook: boolean) => void;
  cardsInDeck: number;
  indexFinish: number;
}

const getStyles = () => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    marginRight: 12
  }
} as any);

const Settings = (props: SettingsProps) => {
  const { showBook, setShowBook, cardsInDeck, indexFinish } = props;
  const styles = getStyles();

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.text}>{"Show Recommendations"}</div>
        <Toggle
          toggled={showBook}
          onClick={() => setShowBook(!showBook)}
        />
    </div>
    <div>Cards In Deck {cardsInDeck} / {indexFinish}</div>
  </div>
  )
}

export default Settings;
