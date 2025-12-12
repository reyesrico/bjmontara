import React, { useState, useMemo } from 'react';

import { CardType, GameState, ReadyPlayers } from '@/types/types';
import { getTotalFromCards } from '@/helpers/cardHelpers';
import { useBets } from '@/helpers/useBets';
import { useDeck } from '@/helpers/useDeck';
import { usePlayers } from '@/helpers/usePlayers';
import { countCards, getAllVisibleCards, CardCountResult } from '@/helpers/cardCounter';

import BookRecommendation from './BookRecommendation';
import Player from './Player';
import Settings from './Settings';
import Dealer from './Dealer';

interface BlackJackGameProps {
  numberPlayers: number;
};

const BlackJackGame = (props: BlackJackGameProps) => {
  const { numberPlayers } = props;

  // States
  const playersHook = usePlayers(numberPlayers);
  const players = playersHook.players;
  const [gameState, setGameState] = useState<GameState>(undefined);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [turn, setTurn] = useState(0);
  const [showBook, setShowBook] = useState<boolean>(true);
  const [isDealerBJ, setIsDealerBJ] = useState<boolean>(false);
  const [playersReady, setPlayersReady] = useState<ReadyPlayers>({});
  const [minBet, setMinBet] = useState<number>(15);
  const [numberOfDecks] = useState<number>(6); // Standard casino uses 6 decks
  const [allDealtCards, setAllDealtCards] = useState<CardType[]>([]); // Track all dealt cards for counting
  const [previousRunningCount, setPreviousRunningCount] = useState<number>(0); // Track count before current round

  // Deck
  const deckHook = useDeck();

  // Card Counting - Calculate for the first player
  const cardCountResult = useMemo<CardCountResult | null>(() => {
    if (gameState !== 'gameStarted' && gameState !== 'waitForBets') {
      return null;
    }

    // Calculate current round count from visible cards only
    const allPlayerHands = Object.values(players).flatMap(p => p.hands);
    // Get visible cards: all player cards + dealer's first card only (second is hidden)
    const currentRoundCards = getAllVisibleCards(allPlayerHands, dealerHand, gameState === 'gameStarted');
    const currentRoundCount = currentRoundCards.length > 0 ? countCards(numberOfDecks, currentRoundCards, 0).runningCount : 0;

    // Use all dealt cards (cumulative across rounds) for card counting
    // Calculate actual cards used from deck
    const initialDeckSize = numberOfDecks * 52;
    const cardsUsed = initialDeckSize - deckHook.deck.length;
    
    console.log('Card Counter Update:', {
      allDealtCardsCount: allDealtCards.length,
      currentRoundCardsCount: currentRoundCards.length,
      cardsUsed,
      deckLength: deckHook.deck.length,
      previousCount: previousRunningCount,
      currentRoundCount,
      totalRunningCount: previousRunningCount + currentRoundCount,
      playerHandsCount: allPlayerHands.length,
      dealerHandCount: dealerHand.length
    });
    
    // Get card count result using all dealt cards
    const result = countCards(numberOfDecks, allDealtCards, cardsUsed);
    
    // The running count should be previous + current round
    const actualRunningCount = previousRunningCount + currentRoundCount;
    
    console.log('Running Count Verification:', {
      fromAllDealtCards: result.runningCount,
      fromFormula: actualRunningCount,
      previousCount: previousRunningCount,
      currentRound: currentRoundCount,
      match: result.runningCount === actualRunningCount
    });
    
    // Use the formula-based count for consistency with display
    return {
      ...result,
      runningCount: actualRunningCount,
      previousCount: previousRunningCount,
      currentRoundCount
    } as any;
  }, [gameState, allDealtCards, deckHook.deck, numberOfDecks, previousRunningCount, 
      JSON.stringify(Object.values(players).flatMap(p => p.hands)), 
      JSON.stringify(dealerHand)]);

  // Bets
  const bets = useBets();

  React.useEffect(() => {
    // Initialize game by placing bets when component mounts
    if (gameState === undefined) {
      placeBets();
    }
  }, []);

  React.useEffect(() => {
    const numberReady = Object.values(playersReady).filter(ready => ready).length;
    if (numberReady === numberPlayers) {
      setGameState("playersReady");
    }
  }, [numberPlayers, playersReady]);

  // Game Functions
  const resetGame = () => {
    setTurn(0);
    setGameState("gameFinished");
  }
  
  const refreshAllDeck = () => {
    resetGame();
    playersHook.refreshPlayers();
    deckHook.refreshDeck();
    setAllDealtCards([]); // Reset card counting
    setPreviousRunningCount(0); // Reset previous count
    placeBets();
  }

  const placeBets = () => {
    bets.clearBets?.();
    playersHook.clearHands();
    setDealerHand([]);
    setTurn(0);
    setIsDealerBJ(false);
    // Update previous count to current total before clearing hands
    if (allDealtCards.length > 0) {
      const totalCount = countCards(numberOfDecks, allDealtCards, 0).runningCount;
      setPreviousRunningCount(totalCount);
    }
    setGameState("waitForBets");
  }

  const settleBets = (nextDealerHands: CardType[]) => {
    const _players = Object.values(players);
    bets.executeBets?.(_players, nextDealerHands, isDealerBJ).forEach(bet => {
      let player = players[bet.playerId];
      const money = (player?.money || 0) + bet.result;
      if (player) {
        player.money = money;
      }
    });
  }

  const startGame = () => {
    setPlayersReady({});
    setGameState("gameStarted");
    let newDealerHand: CardType[] = [];

    // Players 1st Card
    let firstCards = deckHook.drawCards(numberPlayers);
    console.log('Dealt first cards to players:', firstCards.length);
    setAllDealtCards(prev => {
      const updated = [...prev, ...firstCards];
      console.log('Total dealt cards after player 1st cards:', updated.length);
      return updated;
    });
  
    // Dealer 1st Card
    let dealerCard = deckHook.drawCards(1);
    newDealerHand.push(dealerCard[0]);
    console.log('Dealt first card to dealer');
    setAllDealtCards(prev => {
      const updated = [...prev, ...dealerCard];
      console.log('Total dealt cards after dealer 1st card:', updated.length);
      return updated;
    });

    // Players 2nd Card
    let secondCards = deckHook.drawCards(numberPlayers);
    let playersCards = secondCards.map((card, i) => (
      [firstCards[i], card]
    ));
    console.log('Dealt second cards to players:', secondCards.length);
    setAllDealtCards(prev => {
      const updated = [...prev, ...secondCards];
      console.log('Total dealt cards after player 2nd cards:', updated.length);
      return updated;
    });
  
    // Dealer 2nd Card - DON'T add to allDealtCards yet since it's hidden
    let dealerSecondCard = deckHook.drawCards(1);
    newDealerHand.push(dealerSecondCard[0]);
    // Note: We'll add dealer's second card to count when dealer plays (reveals it)
    const dealerBJ = getTotalFromCards(newDealerHand).isBlackJack;
    setIsDealerBJ(dealerBJ);
    playersHook.addHands(playersCards);
    setDealerHand(newDealerHand);
  
    if (dealerBJ) {
      // Dealer has blackjack - reveal second card and add to count before resetting
      console.log('Dealer blackjack - adding hidden card to count');
      setAllDealtCards(prev => [...prev, dealerSecondCard]);
      resetGame();
    }
  }

  const dealerPlay = () => {
    // Add dealer's hidden second card to count now that it's revealed
    if (dealerHand.length >= 2) {
      setAllDealtCards(prev => [...prev, dealerHand[1]]);
      console.log('Added dealer hidden card to count');
    }
    
    // Hitting dealers hand until 17 is reached
    const nextDealerCards = deckHook.drawCardsForDealer(dealerHand);
    // Track any new cards dealt to dealer (beyond the original 2)
    const newDealerCards = nextDealerCards.slice(dealerHand.length);
    setAllDealtCards(prev => [...prev, ...newDealerCards]);
    setDealerHand(nextDealerCards);
  
    // Calculating results
    settleBets(nextDealerCards);

    // ...reset game...
    if (deckHook.deckIndexFinish > deckHook.deck.length) {
      setGameState(undefined);
    } else {
      resetGame();
    }
  }

  return (
    <div className="bj-game-container">
      <div className="bj-settings">
        <Settings
          showBook={showBook}
          setShowBook={(val) => setShowBook(val)}
          cardsInDeck={deckHook.deck.length}
          indexFinish={deckHook.deckIndexFinish}
          minBet={minBet}
          setMinBet={setMinBet}
        />
      </div>
      <div className="bj-table">
        {!!dealerHand.length &&
          <Dealer dealerHand={dealerHand} gameState={gameState} />
        }
        {!!dealerHand.length && <hr className="bj-divider" />}
        <div className="bj-players-area">
          {Object.values(players).map((player, index) => {
            if (player.money > 0) {
              const isFirstPlayer = player.id === 0;
              const isPlayerTurn = turn === player.id && gameState === 'gameStarted';
              return (
                <div key={index} className={`bj-player-spot ${isPlayerTurn ? 'active' : ''}`}>
                  <Player
                    player={player}
                    playersHook={playersHook}
                    deckHook={deckHook}
                    isLastPlayer={turn < Object.keys(players).length - 1}
                    minBet={minBet}
                    bets={bets}
                    turn={turn}
                    gameState={gameState}
                    isDealerBJ={isDealerBJ}
                    dealerHand={dealerHand}
                    onCardsDealt={(cards) => setAllDealtCards(prev => [...prev, ...cards])}
                    playerReady={() => {
                      setPlayersReady({
                        ...playersReady,
                        [player.id]: true,
                      });
                    } }
                    setTurn={(_turn) => {
                      if (_turn === numberPlayers) {
                        dealerPlay();
                      } else {
                        setTurn(_turn);
                      }
                    }}
                  />
                  {showBook && turn === player.id &&
                    gameState === 'gameStarted' &&
                    <BookRecommendation
                      dealerCard={dealerHand[0]}
                      playerCards={players[player.id].hands[0]}
                    />
                  }
                  {isFirstPlayer && (gameState === 'gameStarted' || gameState === 'waitForBets') && cardCountResult && (
                    <div className="bj-card-counter">
                      <div className="bj-card-counter-title">
                        🎯 Card Counter
                      </div>
                      <div className="bj-card-counter-stat">
                        Previous Count: <strong>{(cardCountResult as any).previousCount > 0 ? '+' : ''}{(cardCountResult as any).previousCount}</strong>
                      </div>
                      <div className="bj-card-counter-stat">
                        Running Count: <strong>{cardCountResult.runningCount > 0 ? '+' : ''}{cardCountResult.runningCount}</strong>
                      </div>
                      <div className="bj-card-counter-stat" style={{ fontSize: '9px', fontStyle: 'italic', opacity: 0.8 }}>
                        ({(cardCountResult as any).previousCount > 0 ? '+' : ''}{(cardCountResult as any).previousCount} + {(cardCountResult as any).currentRoundCount > 0 ? '+' : ''}{(cardCountResult as any).currentRoundCount} = {cardCountResult.runningCount > 0 ? '+' : ''}{cardCountResult.runningCount})
                      </div>
                      <div className="bj-card-counter-stat">
                        True Count: <strong>{cardCountResult.trueCount > 0 ? '+' : ''}{cardCountResult.trueCount}</strong>
                      </div>
                      <div className="bj-card-counter-stat" style={{ fontSize: '9px', fontStyle: 'italic', opacity: 0.8 }}>
                        ({cardCountResult.runningCount} ÷ {((numberOfDecks * 52 - (numberOfDecks * 52 - deckHook.deck.length)) / 52).toFixed(1)} decks = {cardCountResult.trueCount})
                      </div>
                      <div className="bj-card-counter-stat" title="Based on True Count (not Running Count)">
                        Bet Multiplier: <strong>{cardCountResult.betMultiplier}x</strong>
                      </div>
                      <div className="bj-card-counter-recommendation" style={{
                        backgroundColor: cardCountResult.trueCount >= 3 ? 'rgba(0, 200, 83, 0.3)' :
                                       cardCountResult.trueCount >= 1 ? 'rgba(255, 193, 7, 0.3)' :
                                       cardCountResult.trueCount >= 0 ? 'rgba(158, 158, 158, 0.3)' :
                                       cardCountResult.trueCount >= -2 ? 'rgba(255, 152, 0, 0.3)' :
                                       'rgba(211, 47, 47, 0.3)',
                        borderLeft: `3px solid ${
                          cardCountResult.trueCount >= 3 ? '#00C853' :
                          cardCountResult.trueCount >= 1 ? '#FFC107' :
                          cardCountResult.trueCount >= 0 ? '#9E9E9E' :
                          cardCountResult.trueCount >= -2 ? '#FF9800' :
                          '#D32F2F'
                        }`,
                        paddingLeft: '6px',
                        marginTop: '4px'
                      }}>
                        {cardCountResult.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="bj-controls">
        {gameState === 'playersReady' && (
          <div style={{ 
            color: '#FFD700', 
            fontSize: '14px', 
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
          }}>
            🎲 All Players Ready! Click Start to Deal Cards 🎲
          </div>
        )}
        {!gameState && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: '#FFD700', 
              fontSize: '20px', 
              fontWeight: 'bold',
              marginBottom: '15px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}>
              🎰 Game Over - Deck Finished 🎰
            </div>
            <div style={{ 
              color: '#00C853', 
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Final Results:
            </div>
            {Object.values(players).map(player => (
              <div key={player.id} style={{
                color: '#FFD700',
                fontSize: '14px',
                margin: '5px 0',
                fontWeight: '600'
              }}>
                Player {player.id + 1}: ${player.money}
              </div>
            ))}
          </div>
        )}
        {(!gameState || gameState === 'gameFinished') &&
          <button className="bj-button" onClick={refreshAllDeck}>Refresh Deck</button>}
        {gameState === 'gameFinished' && 
          <button className="bj-button bj-button-primary" onClick={placeBets}>Place Bets</button>}
        {gameState === 'playersReady' &&
          <button 
            className="bj-button bj-button-primary" 
            onClick={startGame}
            style={{ fontSize: '15px', padding: '12px 24px', animation: 'pulse 2s infinite' }}
          >
            🃏 START GAME 🃏
          </button>}
      </div>
    </div>
  );
}

export default BlackJackGame;
