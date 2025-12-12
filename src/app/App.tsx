'use client'

import React from 'react';

import BlackJackGame from '@/components/BlackJackGame';

const MAX_PLAYERS = 3;

const App = () => {
  const [start, setStart] = React.useState<boolean>(false);
  const [players, setPlayers] = React.useState<number>(0);

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
      <div className="bj-game-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="bj-table" style={{ maxWidth: '600px', margin: '0 auto', padding: '50px', textAlign: 'center' }}>
          <h1 style={{ 
            color: '#FFD700', 
            fontSize: '48px', 
            fontWeight: 'bold', 
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
            marginBottom: '20px',
            letterSpacing: '3px'
          }}>
            🎰 BLACKJACK 🎰
          </h1>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '3px solid #D4AF37',
            borderRadius: '15px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <h2 style={{ 
              color: '#FFD700', 
              fontSize: '24px',
              marginBottom: '15px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}>
              Select Number of Players
            </h2>
            
            <div style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
              border: '3px solid #D4AF37',
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '30px auto',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{ 
                color: '#FFD700', 
                fontSize: '64px', 
                fontWeight: 'bold',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
              }}>
                {players}
              </h3>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <button 
                className="bj-button" 
                onClick={removePlayer}
                disabled={players === 0}
                style={{ fontSize: '24px', padding: '15px 30px', minWidth: '80px' }}
              >
                -
              </button>
              <button 
                className="bj-button" 
                onClick={addPlayer}
                disabled={players >= MAX_PLAYERS}
                style={{ fontSize: '24px', padding: '15px 30px', minWidth: '80px' }}
              >
                +
              </button>
            </div>

            <button 
              className="bj-button bj-button-primary" 
              onClick={() => setStart(true)}
              disabled={players === 0}
              style={{ 
                fontSize: '20px', 
                padding: '18px 50px', 
                marginTop: '20px',
                width: '100%',
                letterSpacing: '2px'
              }}
            >
              🎲 START GAME 🎲
            </button>

            {players === 0 && (
              <p style={{ 
                color: '#FFD700', 
                marginTop: '15px',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Select at least 1 player to start
              </p>
            )}
          </div>

          <div style={{
            marginTop: '30px',
            color: '#FFD700',
            fontSize: '12px',
            opacity: 0.8
          }}>
            Maximum {MAX_PLAYERS} players
          </div>
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
