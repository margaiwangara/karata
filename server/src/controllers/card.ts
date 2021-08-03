import { CARD_SUITS, CARD_VALUES } from '../constants';

export type CardSuit = typeof CARD_SUITS;
export type CardValue = typeof CARD_VALUES;

export class Card {
  public suit: CardSuit[number];
  public value: CardValue[number];
  constructor(suit: CardSuit[number], value: CardValue[number]) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === '♣' || this.suit === '♠' ? 'black' : 'red';
  }

  getHTML() {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = this.suit;
    cardDiv.classList.add('card', this.color);
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}
