import React from 'react';

import { BetsControl, PlayerType, chipTypes } from '@/types/types';

interface PlayerBetProps {
  bets: BetsControl;
  player: PlayerType;
  playerReady: () => void;
  minBet: number;
};

const PlayerBet = (props: PlayerBetProps) => {
  const { bets, player, playerReady, minBet } = props;
  const [betDone, setBetDone] = React.useState(false);
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
      playerReady();  
    } else {
      setError(`Bet must be at least $${minBet}`);
    }
  }

  const buttonText = React.useMemo(() => {
    return betDone ? "✓ Ready!" : "Deal Cards"
  }, [betDone]);

  const add = (chip: number) => {
    bets.addBet?.(player.id, 0, chip);
  };

  const remove = (chip: number) => {
    bets.removeBet?.(player.id, 0, chip);
  }

  // Debug logging
  console.log(`PlayerBet - Player ${player.id + 1}:`, {
    lastBet: bets.lastBets[player.id],
    lastResult: bets.lastResults?.[player.id],
    hasLastBet: bets.lastBets[player.id] !== undefined,
    hasLastResult: !!bets.lastResults?.[player.id]
  });

  return (
    <div>
      <div className="bj-player-name">Player {player.id + 1}</div>
      <div className="bj-player-money">💰 ${player.money}</div>
      {bets.lastBets[player.id] > 0 && bets.lastResults?.[player.id] && (
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
      <div className="bj-bet-area">${bets.currentBet?.(player.id, 0) || 0}</div>
      {error && <div style={{ color: '#D32F2F', backgroundColor: 'rgba(211, 47, 47, 0.1)', padding: '8px', borderRadius: '5px', margin: '10px 0', textAlign: 'center', fontSize: '12px' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', margin: '15px 0' }}>
        {chipTypes.map((chip, i) => (
          <div key={i} style={{ display: 'flex', gap: '5px' }}>
            <button 
              disabled={betDone} 
              className="bj-button" 
              style={{ padding: '8px 12px', fontSize: '14px' }}
              onClick={() => add(chip)}
            >
              +${chip}
            </button>
            <button 
              disabled={betDone} 
              className="bj-button bj-button-danger" 
              style={{ padding: '8px 12px', fontSize: '14px' }}
              onClick={() => remove(chip)}
            >
              -${chip}
            </button>
          </div>
        ))}
      </div>
      <button 
        className={`bj-button ${!betDone ? 'bj-button-primary' : ''}`}
        style={{ width: '100%', marginTop: '10px' }}
        onClick={deal}
        disabled={betDone}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PlayerBet;
