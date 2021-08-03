import { CARD_SUITS, CARD_VALUES } from '../constants';
import { Card } from './card';

export function freshDeck() {
  return CARD_SUITS.flatMap((suit) => {
    return CARD_VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}

export class Deck {
  public cards: Card[];
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  public pop() {
    return this.cards.shift();
  }

  public push(card: Card) {
    this.cards.push(card);
  }

  public shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}
