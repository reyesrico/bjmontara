// Define a class for a card
export class Card {
  // A property to store the rank of the card
  rank: number;

  // A property to store the suit of the card
  suit: number;

  // A property to store the value of the card
  value: number;

  // A constructor to create a card with a given rank and suit
  constructor(rank: number, suit: number) {
    // Assign the rank and suit to the properties
    this.rank = rank;
    this.suit = suit;

    // Calculate the value of the card based on the rank
    if (rank === 1) {
      // An ace can be either 1 or 11
      this.value = 11;
    } else if (rank > 10) {
      // A face card is worth 10
      this.value = 10;
    } else {
      // Any other card is worth its rank
      this.value = rank;
    }
  }

  // A method to convert the card to a string representation
  toString() {
    // Define an array of rank names
    let rankNames = [
      '',
      'Ace',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Jack',
      'Queen',
      'King',
    ];

    // Define an array of suit names
    let suitNames = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

    // Return the rank name and the suit name of the card
    return rankNames[this.rank] + ' of ' + suitNames[this.suit];
  }
}
