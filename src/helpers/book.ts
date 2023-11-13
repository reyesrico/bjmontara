import { CardType } from "@/types/types";
import { getTotalFromCards, isNumberInCards } from "./cardHelpers";

export const getBook = (dealerCard: CardType, playerCards: CardType[]) => {
  const playersTotal = getTotalFromCards(playerCards).total;
  const dealerNumber: number = parseInt(dealerCard.number);

  if (playersTotal === 21) {
    return "BlackJack";
  } else if (playersTotal <= 8) {
    return "Hit";
  } else if (playersTotal === 9) {
    if (dealerNumber >= 3 && dealerNumber <= 6) {
      return "Double Down";
    } else {
      return "Hit";
    }
  } else if (playersTotal === 10) {
    if (dealerNumber >= 2 && dealerNumber <= 9) {
      return "Double Down";
    } else {
      return "Hit";
    }
  } else if (playersTotal === 11) {
    return "Double Down";
  } else if (playersTotal === 12) {
    if (dealerNumber >= 4 && dealerNumber <= 6) {
      return "Stand";
    } else {
      return "Hit";
    }
  } else if (playersTotal >= 13 && playersTotal <= 16) {
    if (dealerNumber >= 2 && dealerNumber <= 6) {
      return "Stand";
    } else {
      return "Hit";
    }
  } else if (isNumberInCards("A", playerCards)) {
    if (
      isNumberInCards("2", playerCards) ||
      isNumberInCards("3", playerCards) ||
      isNumberInCards("4", playerCards) ||
      isNumberInCards("5", playerCards) ||
      isNumberInCards("6", playerCards) ) {
        if (dealerNumber >= 2 && dealerNumber <= 6) {
          return "Double Down";
        } else {
          return "Hit";
        }
    } else if (isNumberInCards("7", playerCards)) {
      if (dealerNumber >= 3 && dealerNumber <= 6) {
        return "Double Down";
      } else if (dealerNumber === 9 || dealerNumber === 10 || dealerCard.number === "A") {
        return "Hit";
      } else {
        return "Stand";
      }
    } else if (isNumberInCards("8", playerCards) || isNumberInCards("9", playerCards)) {
      return "Stand";
    }
  } else if (playerCards[0].number === "2" && playerCards[1].number === "2") {
    if (dealerNumber >= 4 && dealerNumber <= 7) {
      return "Split";
    } 
    return "Hit";
  } else if (playerCards[0].number === "3" && playerCards[1].number === "3") {
    if (dealerNumber >= 4 && dealerNumber <= 7) {
      return "Split";
    } 
    return "Hit";
  } else if (playerCards[0].number === "4" && playerCards[1].number === "4") {
    return "Hit";
  } else if (playerCards[0].number === "5" && playerCards[1].number === "5") {
    if (dealerNumber >= 2 && dealerNumber <= 6) {
      return "Double Down";
    } 
    return "Hit";
  } else if (playerCards[0].number === "6" && playerCards[1].number === "6") {
    if (dealerNumber >= 2 && dealerNumber <= 6) {
      return "Split";
    } 
    return "Hit";
  } else if (playerCards[0].number === "7" && playerCards[1].number === "7") {
    if (dealerNumber >= 2 && dealerNumber <= 7) {
      return "Split";
    } 
    return "Hit";
  } else if (playerCards[0].number === "8" && playerCards[1].number === "8") {
    return "Split";
  } else if (playerCards[0].number === "9" && playerCards[1].number === "9") {
    if (dealerNumber === 7 || dealerNumber === 10 || dealerCard.number === "A") {
      return "Stand";
    }
    return "Split";
  } else if (playerCards[0].number === "10" && playerCards[1].number === "10") {
    return "Stand";
  } else if (playerCards[0].number === "A" && playerCards[1].number === "A") {
    return "Split";
  } else {
    return undefined;
  }
};
