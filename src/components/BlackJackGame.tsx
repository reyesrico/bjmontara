import React, { useState } from 'react';

import { CardType, GameState, ReadyPlayers } from '@/types/types';
import { getTotalFromCards } from '@/helpers/cardHelpers';
import { useBets } from '@/helpers/useBets';
import { useDeck } from '@/helpers/useDeck';
import { usePlayers } from '@/helpers/usePlayers';

import BookRecommendation from './BookRecommendation';
import Player from './Player';
import Settings from './Settings';
import Dealer from './Dealer';

interface BlackJackGameProps {
  numberPlayers: number;
};

const getStyles = () => ({
  container: {
    background: "#CDA37D",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  settingsContainer: {
    backgroundColor: "#7A5827",
    width: "100%",
    color: "white",
  },
  playersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    border: 2,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 2,
    flexGrow: 1,
    backgroundColor: "#e0cdbd"
  },
  playerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e0cdbd",
  },
  button: {
    backgroundColor: "#7A5827",
    color: "#CDA37D",
    border: 2,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 2,
    margin: 5,
    padding: 5,
    // flexGrow: 1,
  }
} as any);

const BlackJackGame = (props: BlackJackGameProps) => {
  const { numberPlayers } = props;
  const styles = getStyles();

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

  // Deck
  let deckHook = useDeck();

  // Bets
  const bets = useBets();

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
    placeBets();
  }

  const placeBets = () => {
    bets.clearBets?.();
    playersHook.clearHands();
    setDealerHand([]);
    setTurn(0);
    setIsDealerBJ(false);
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
  
    // Dealer 1st Card
    let dealerCard = deckHook.drawCards(1);
    newDealerHand.push(dealerCard[0]);

    // Players 2nd Card
    let playersCards = deckHook.drawCards(numberPlayers).map((card, i) => (
      [firstCards[i], card]
    ));
  
    // Dealer 2nd Card
    let dealerSecondCard = deckHook.drawCards(1);
    newDealerHand.push(dealerSecondCard[0]);
    const dealerBJ = getTotalFromCards(newDealerHand).isBlackJack;
    setIsDealerBJ(dealerBJ);
    playersHook.addHands(playersCards);
    setDealerHand(newDealerHand);
  
    if (dealerBJ) {
      resetGame();
    }
  }

  const dealerPlay = () => {
    // Hitting dealers hand until 17 is reached
    const nextDealerCards = deckHook.drawCardsForDealer(dealerHand);
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
    <div style={styles.container}>
      <div style={styles.settingsContainer}>
        <Settings
          showBook={showBook}
          setShowBook={(val) => setShowBook(val)}
          cardsInDeck={deckHook.deck.length}
          indexFinish={deckHook.deckIndexFinish}
          minBet={minBet}
          setMinBet={setMinBet}
        />
      </div>
      <hr />
      {!!dealerHand.length &&
        <Dealer dealerHand={dealerHand} gameState={gameState} />
      }
      <div style={styles.playersContainer}>
        {Object.values(players).map((player, index) => {
          if (player.money > 0) {
            return (
              <div key={index} style={styles.playerContainer}>
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
              </div>
            );
          }
        })}
      </div>
      <hr />
      <div style={styles.buttonsContainer}>
        {(!gameState || gameState === 'gameFinished') &&
          <button style={styles.button} onClick={refreshAllDeck}>Refresh Deck</button>}
        {gameState === 'gameFinished' && 
          <button style={styles.button} onClick={placeBets}>Place Bets</button>}
        {gameState === 'playersReady' &&
          <button style={styles.button} onClick={startGame}>Start Game</button>}
      </div>
    </div>
  );
}

export default BlackJackGame;
