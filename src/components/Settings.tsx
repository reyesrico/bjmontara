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

const Settings = (props: SettingsProps) => {
  const { setMinBet, minBet, showBook, setShowBook, cardsInDeck, indexFinish } = props;

  return (
    <>
      <div className="bj-settings-item">
        <div>Show recs</div>
        <Toggle
          toggled={showBook}
          onClick={() => setShowBook(!showBook)}
        />
      </div>
      <div className="bj-settings-item">
        <span>Min Bet:</span>
        <button
          className="bj-settings-button"
          onClick={() => setMinBet(Math.max(1, minBet-1))}
        >-</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{minBet}</span>
        <button
          className="bj-settings-button"
          onClick={() => setMinBet(minBet + 1)}
        >+</button>
      </div>
      <div className="bj-settings-item">
        Cards: {cardsInDeck} / {indexFinish}
      </div>
    </>
  )
}

export default Settings;
