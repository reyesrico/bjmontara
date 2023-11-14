import React, { useState } from 'react';

import { CardType, GameState, PlayerType, PlayersHands, ResultType } from '@/types/types';
import { getTotalFromCards } from '@/helpers/cardHelpers';
import { useDeck } from '@/helpers/useDeck';
import { useBets } from '@/helpers/useBets';

import BookRecommendation from './BookRecommendation';
import Player from './Player';
import Result from './Result';
import Settings from './Settings';
import Dealer from './Dealer';

type ReadyPlayers = {
  [key: number]: boolean
};

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
    width: "100%"
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
  }
} as any);

const BlackJackGame = (props: BlackJackGameProps) => {
  const { numberPlayers } = props;
  const styles = getStyles();

  // States
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [gameState, setGameState] = useState<GameState>(undefined);
  const [playersHand, setPlayersHand] = useState<PlayersHands>({});
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [turn, setTurn] = useState(0);
  const [handsTurn, setHandsTurn] = useState(0);
  const [showBook, setShowBook] = useState<boolean>(true);
  const [isDealerBJ, setIsDealerBJ] = useState<boolean>(false);
  const [playersReady, setPlayersReady] = useState<ReadyPlayers>({});

  // Deck
  let { deck, deckIndexFinish, refreshDeck,
    drawCards, drawCardsForDealer } = useDeck();

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
    let newPlayers = [];
    for (let i=0; i<numberPlayers; i++) {
      newPlayers.push({ id: i, money: 1000, hands: [] });
    }
    setPlayers(newPlayers);
    refreshDeck();
    placeBets();
  }

  const placeBets = () => {
    bets.clearBets?.();
    setPlayersHand({});
    setDealerHand([]);
    setTurn(0);
    setIsDealerBJ(false);
    setGameState("waitForBets");
  }

  const settleBets = (nextDealerHands: CardType[]) => {
    let playersCopy = [...players];
    bets.executeBets?.(playersHand, nextDealerHands, isDealerBJ).forEach(bet => {
      let player = playersCopy.find(player =>
        player.id === bet.playerId);
      const money = (player?.money || 0) + bet.result;
      if (player) {
        player.money = money;
      }
    });
    setPlayers(playersCopy);
  }

  const startGame = () => {
    setPlayersReady({});
    setGameState("gameStarted");
    let newPlayersHand: Record<string, CardType[]> = {};
    let newDealerHand: CardType[] = [];

    // Players 1st Card
    let firstCards = drawCards(numberPlayers);
    newPlayersHand = firstCards.reduce((acc, card, index) => {
      return {
        ...acc,
        [index]: [card],
      }
    }, newPlayersHand);
  
    // Dealer 1st Card
    let dealerCard = drawCards(1);
    newDealerHand.push(dealerCard[0]);

    // Players 2nd Card
    let secondCards = drawCards(numberPlayers);
    newPlayersHand = secondCards.reduce((acc, card, index) => {
      return {
        ...acc,
        [index]: [...acc[index], card],
      }
    }, newPlayersHand);
  
    // Dealer 2nd Card
    let dealerSecondCard = drawCards(1);
    newDealerHand.push(dealerSecondCard[0]);
    const dealerBJ = getTotalFromCards(newDealerHand).isBlackJack;
    setIsDealerBJ(dealerBJ);
    setPlayersHand(newPlayersHand);
    setDealerHand(newDealerHand);
  
    if (dealerBJ) {
      resetGame();
    }
  }

  const doubleDown = () => {
    const handsId = 0;
    let playerHand = playersHand[turn];
    let card = drawCards(1)[handsId];
    playerHand.push(card);
    setPlayersHand({
      ...playersHand,
      [turn]: playerHand,
    });

    // Applying double down bet
    const currentBet = bets.currentBet?.(turn, handsId) || 0;
    bets.addBet?.(turn, handsId, currentBet);

    if (turn < players.length-1) {
      setTurn(turn + 1);
    } else {
      stand();
    }
  }

  const split = () => {
    let playerHand = playersHand[turn];
    
    const firstHand = [playerHand[0], drawCards(1)[0]];
    const secondHand = [playerHand[1], drawCards(1)[0]];

    const player = players.filter(player => player.id === turn)[0];
    player.hands = [firstHand, secondHand];

    const currentBet = bets.currentBet?.(turn, 0) || 0;
    bets.addBet?.(turn, 1, currentBet);
  }

  const hit = () => {
    let playerHand = playersHand[turn];
    let card = drawCards(1)[0];
    playerHand.push(card);
    setPlayersHand({
      ...playersHand,
      [turn]: playerHand,
    });

    if (getTotalFromCards(playerHand).isBust) {
      if (turn < players.length-1) {
        setTurn(turn + 1);
      } else {
        stand();
      }
    }
  }

  const stand = async () => {
    if (turn < numberPlayers-1) {
      setTurn(turn + 1);
    } else {
      // Hitting dealers hand until 17 is reached
      const nextDealerCards = drawCardsForDealer(dealerHand);
      setDealerHand(nextDealerCards);
    
      // Calculating results
      settleBets(nextDealerCards);

      // ...reset game...
      if (deckIndexFinish > deck.length) {
        setGameState(undefined);
      } else {
        resetGame();
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.settingsContainer}>
        <Settings
          showBook={showBook}
          setShowBook={(val) => setShowBook(val)}
          cardsInDeck={deck.length}
          indexFinish={deckIndexFinish}
        />
      </div>
      <hr />
      {!!dealerHand.length &&
        <Dealer dealerHand={dealerHand} gameState={gameState} />
      }
      <div style={styles.playersContainer}>
        {players.map((player, index) => (
          <div key={index} style={styles.playerContainer}>
            <Player
              player={player}
              playerHand={playersHand[player.id]}
              bets={bets}
              turn={turn}
              hit={hit}
              stand={stand}
              doubleDown={doubleDown}
              split={split}
              gameState={gameState}
              isDealerBJ={isDealerBJ}
              isPlayerBJAction={() => {
                if (turn < players.length-1) {
                  setTurn(turn + 1);
                } else {
                  stand();
                }
              }}
              playerReady={() => {
                setPlayersReady({
                  ...playersReady,
                  [player.id]: true,
                });
              }}
            />
            {showBook && turn === player.id &&
             gameState === 'gameStarted' && <BookRecommendation
              dealerCard={dealerHand[0]}
              playerCards={playersHand[player.id]}
            />}
            {gameState === 'gameFinished' &&
              <Result
                dealerHand={dealerHand}
                playerHand={playersHand[player.id]}
                isDealerBJ={isDealerBJ}
              />
            }
          </div>)
        )}
      </div>
      <hr />
      {(!gameState || gameState === 'gameFinished') && <button onClick={refreshAllDeck}>Refresh Deck</button>}
      {gameState === 'gameFinished' && <button onClick={placeBets}>Place Bets</button>}
      {gameState === 'playersReady' && <button onClick={startGame}>Start Game</button>}
    </div>
  );
}

export default BlackJackGame;
