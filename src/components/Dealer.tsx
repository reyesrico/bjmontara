import React from 'react';

import { CardType, GameState } from "@/types/types";

import Card from "./Card";
import Total from "./Total";

interface DealerProps {
  dealerHand: CardType[];
  gameState: GameState;
}

const getStyles = () => ({
  dealerContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: 200,
  },
  dealersCardsContainer: {
    background: "#b08258",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
} as any);

const Dealer = (props: DealerProps) => {
  const { dealerHand, gameState } = props;
  const styles = getStyles();

  return (
    <>
      <h1>Dealer</h1>
      <div style={styles.dealerContainer}>
        <div style={styles.dealersCardsContainer}>
          {dealerHand.map((card, index) => {      
            const hideCard = index === 1 && gameState === "gameStarted";    
            return (
              <Card key={index} number={card.number}
                suit={card.suit} hideCard={hideCard} />
            );
          })}
        </div>
        <Total hand={dealerHand} />
      </div>
      <hr />
    </>
  );
};

export default Dealer;