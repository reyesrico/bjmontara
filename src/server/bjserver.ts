// Import the required modules
import express from 'express';
import cors from 'cors';
import { Deck } from './Deck';
import { Card } from './Card';
import { Hand } from './Hand';

// Create an express app and enable cors
const app = express();
app.use(cors());

// Define some constants
const PORT = 3000; // The port number for the server
const DECK_SIZE = 52; // The number of cards in a deck
const INITIAL_CARDS = 2; // The number of cards dealt initially to each player
const DEALER_LIMIT = 17; // The minimum score for the dealer to stop hitting
const BLACKJACK = 21; // The maximum score for a blackjack
const NUM_DECKS = 6; // The number of decks to use in the game
const END_NUMBER = 10; // The number of cards left in the full_deck to end the game

// Create a global full_deck of 6 decks and shuffle it
let full_deck = new Deck(DECK_SIZE * NUM_DECKS);
full_deck.shuffle();

// Define a route for starting a new game
app.get('/newgame', (req, res) => {
  // Check if the full_deck has enough cards to start a new game
  if (full_deck.cards.length < END_NUMBER) {
    // Send the response with a message that the full_deck is ended
    res.json({
      message: 'The full_deck is ended. Please restart the server to play again.',
      gameOver: true,
    });
  } else {
    // Create a hand for the player and the dealer
    let playerHand = new Hand();
    let dealerHand = new Hand();

    // Deal the initial cards to each hand from the full_deck
    for (let i = 0; i < INITIAL_CARDS; i++) {
      const playerCardDrawn = full_deck.drawCard();
      playerCardDrawn && playerHand.addCard(playerCardDrawn);
      const dealerCardDrawn = full_deck.drawCard();
      dealerCardDrawn && dealerHand.addCard(dealerCardDrawn);
    }

    // Send the response with the initial state of the game
    res.json({
      playerHand: playerHand.cards,
      playerScore: playerHand.getScore(),
      dealerHand: [dealerHand.cards[0]], // Only show the first card of the dealer
      dealerScore: dealerHand.cards[0].value, // Only show the value of the first card of the dealer
      message: 'Welcome to the game of blackjack! Hit or stand?',
      gameOver: false,
      playerWon: false,
    });
  }
});

// Define a route for hitting a card
app.get('/hit', (req, res) => {
  // Create a hand for the player and the dealer from the query parameters
  let playerHand = new Hand(req.query.playerHand as unknown as Card[]);
  let dealerHand = new Hand(req.query.dealerHand as unknown as Card[]);

  // Draw a card from the full_deck and add it to the player's hand
  let card = full_deck.drawCard();
  card && playerHand.addCard(card);

  // Check if the player busts or gets a blackjack
  let playerScore = playerHand.getScore();
  let dealerScore = dealerHand.getScore();
  let message = '';
  let gameOver = false;
  let playerWon = false;

  if (playerScore > BLACKJACK) {
    // The player busts and loses the game
    message = 'You bust! You lose!';
    gameOver = true;
    playerWon = false;
  } else if (playerScore === BLACKJACK) {
    // The player gets a blackjack and wins the game
    message = 'You got a blackjack! You win!';
    gameOver = true;
    playerWon = true;
  } else {
    // The player can hit or stand again
    message = 'You hit a ' + card?.toString() + '. Hit or stand?';
    gameOver = false;
    playerWon = false;
  }

  // Send the response with the updated state of the game
  res.json({
    playerHand: playerHand.cards,
    playerScore: playerScore,
    dealerHand: [dealerHand.cards[0]], // Only show the first card of the dealer
    dealerScore: dealerHand.cards[0].value, // Only show the value of the first card of the dealer
    message: message,
    gameOver: gameOver,
    playerWon: playerWon,
  });
});

// Define a route for standing
app.get('/stand', (req, res) => {
  // Create a hand for the player and the dealer from the query parameters
  let playerHand = new Hand(req.query.playerHand as unknown as Card[]);
  let dealerHand = new Hand(req.query.dealerHand as unknown as Card[]);

  // The dealer hits until reaching the limit or busting
  while (dealerHand.getScore() < DEALER_LIMIT) {
    const cardDrawn = full_deck.drawCard();
    cardDrawn && dealerHand.addCard(cardDrawn);
  }

  // Compare the scores of the player and the dealer
  let playerScore = playerHand.getScore();
  let dealerScore = dealerHand.getScore();
  let message = '';
  let gameOver = true;
  let playerWon = false;

  if (dealerScore > BLACKJACK) {
    // The dealer busts and the player wins the game
    message = 'The dealer busts! You win!';
    playerWon = true;
  } else if (dealerScore > playerScore) {
    // The dealer has a higher score and the player loses the game
    message = 'The dealer has a higher score! You lose!';
    playerWon = false;
  } else if (dealerScore < playerScore) {
    // The player has a higher score and wins the game
    message = 'You have a higher score! You win!';
    playerWon = true;
  } else {
    // The scores are equal and the game is a tie
    message = 'The scores are equal! It\'s a tie!';
    playerWon = false;
  }

  // Send the response with the final state of the game
  res.json({
    playerHand: playerHand.cards,
    playerScore: playerScore,
    dealerHand: dealerHand.cards,
    dealerScore: dealerScore,
    message: message,
    gameOver: gameOver,
    playerWon: playerWon,
  });
});

// Start the server and listen on the port
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
