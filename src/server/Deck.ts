// Import the Card class from the blackjack module
import { Card } from './Card';

// Define a class for a deck of cards
export class Deck {
  // A property to store the cards in the deck
  cards: Card[];

  // A constructor to create a deck with a given size
  constructor(size: number) {
    // Initialize the cards array as an empty array
    this.cards = [];

    // Create the cards and add them to the array
    for (let i = 0; i < size; i++) {
      // Calculate the rank and suit of the card based on the index
      let rank = i % 13 + 1;
      let suit = Math.floor(i / 13);

      // Create a new card object with the rank and suit
      let card = new Card(rank, suit);

      // Add the card to the array
      this.cards.push(card);
    }
  }

  // A method to shuffle the deck
  shuffle() {
    // Loop through the array and swap each element with a random element
    for (let i = 0; i < this.cards.length; i++) {
      // Generate a random index
      let j = Math.floor(Math.random() * this.cards.length);

      // Swap the elements at i and j
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }

  // A method to draw a card from the deck
  drawCard() {
    // Check if the deck is empty
    if (this.cards.length === 0) {
      // Throw an error
      throw new Error('The deck is empty');
    } else {
      // Remove and return the last element of the array
      return this.cards.pop();
    }
  }
}
