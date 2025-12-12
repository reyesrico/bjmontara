import React from 'react';

import { CardType, GameState } from "@/types/types";

import Card from "./Card";
import Total from "./Total";

interface DealerProps {
  dealerHand: CardType[];
  gameState: GameState;
}

const Dealer = (props: DealerProps) => {
  const { dealerHand, gameState } = props;

  return (
    <div className="bj-dealer-area">
      <h1 className="bj-dealer-title">DEALER</h1>
      <div className="bj-dealer-cards">
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
  );
};

export default Dealer;