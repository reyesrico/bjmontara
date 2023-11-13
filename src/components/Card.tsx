import React from 'react';
import Image from 'next/image';
import { Number, Suit } from '@/types/types';

interface CardProps {
  number: Number;
  suit: Suit;
  hideCard?: boolean;
}

const Card: React.FC<CardProps> = (props: CardProps) => {
  const { number, suit, hideCard } = props;

  const cardImage = hideCard ?
    require(`../assets/png/back.png`) :
    require(`../assets/png/${number}_of_${suit}.png`);

  const width = hideCard ? 110 : 100;
  const height = hideCard ? 170 : 160;

  return (
    <div style={{ border: "1px black solid" }}>
      <Image
        src={cardImage}
        alt={`${number} of ${suit}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default Card;