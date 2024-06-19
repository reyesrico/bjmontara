// Import the Card class from the blackjack module
import { Card } from './Card';

// Define a class for a hand of cards
export class Hand {
  // A property to store the cards in the hand
  cards: Card[];

  // A constructor to create a hand with an optional array of cards
  constructor(cards?: Card[]) {
    // Initialize the cards array as an empty array or the given array
    this.cards = cards || [];
  }

  // A method to add a card to the hand
  addCard(card: Card) {
    // Push the card to the array
    this.cards.push(card);
  }

  // A method to get the score of the hand
  getScore() {
    // Initialize the score and the number of aces as zero
    let score = 0;
    let aces = 0;

    // Loop through the cards and add their values to the score
    for (let card of this.cards) {
      // Add the card value to the score
      score += card.value;

      // If the card is an ace, increment the number of aces
      if (card.rank === 1) {
        aces++;
      }
    }

    // Loop through the aces and adjust the score if it is over 21
    while (score > 21 && aces > 0) {
      // Subtract 10 from the score
      score -= 10;

      // Decrement the number of aces
      aces--;
    }

    // Return the score
    return score;
  }
}
