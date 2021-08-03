import { Deck } from './deck';
import { CARD_VALUE_MAP } from '../constants';
import { Card, CardSuit, CardValue } from './card';
import { Router, Request, Response, NextFunction } from 'express';
import { GameEntity, User } from '../entities';
import { HttpException } from '../middleware/error';

type UserResponse = {
  yours: [CardValue[number], CardSuit[number]];
  opponents: [CardValue[number], CardSuit[number]];
  message?: string;
};

export class GameController {
  private playerDeck: Deck;
  private computerDeck: Deck;
  private inRound: boolean;
  private stop: boolean;
  private deck: Deck;
  public router: Router;
  private points: number;
  private increment: number;
  private playerCardsLeft: number;
  private computerCardsLeft: number;
  private cardsInDeck: number;

  constructor() {
    this.router = Router();
    this.increment = 5;
    this.startGame();
    this.routes(); // routes
  }

  private startGame() {
    this.deck = new Deck();
    this.deck.shuffle();

    // get half cards to distribute between players
    const midpoint = Math.ceil(this.deck.numberOfCards / 2);

    // init player deck and computer deck
    this.playerDeck = new Deck(this.deck.cards.slice(0, midpoint));
    this.computerDeck = new Deck(
      this.deck.cards.slice(midpoint, this.deck.numberOfCards),
    );

    this.stop = false;
    this.inRound = false;
    this.points = 0;
    this.cardsInDeck = this.deck.numberOfCards;

    this.cleanBeforeRound();
  }

  // before starting a round, reset
  private cleanBeforeRound() {
    this.inRound = false;
    this.updateDeckCount();
  }

  private updateDeckCount() {
    this.playerCardsLeft = this.playerDeck.numberOfCards;
    this.computerCardsLeft = this.computerDeck.numberOfCards;
  }

  private flipCards = async () => {
    this.inRound = true;

    const playerCard = this.playerDeck.pop() as Card;
    const computerCard = this.computerDeck.pop() as Card;

    // playerCardSlot.appendChild(playerCard.getHTML());
    // computerCardSlot.appendChild(computerCard.getHTML());

    this.updateDeckCount();

    let response: UserResponse = {
      yours: [playerCard.value, playerCard.suit],
      opponents: [computerCard.value, computerCard.suit],
    };

    if (this.isRoundWinner(playerCard, computerCard)) {
      this.playerDeck.push(playerCard);
      this.playerDeck.push(computerCard);

      // increase points
      this.points = this.increment;
      response = {
        ...response,
        message: 'Win',
      };
    } else if (this.isRoundWinner(computerCard, playerCard)) {
      // text.innerText = 'Lose';
      this.computerDeck.push(playerCard);
      this.computerDeck.push(computerCard);
      this.points = 0;
      response = {
        ...response,
        message: 'Lose',
      };
    } else {
      // text.innerText = 'Draw';
      this.playerDeck.push(playerCard);
      this.computerDeck.push(computerCard);
      this.points = 2;
      response = {
        ...response,
        message: 'Draw',
      };
    }

    if (this.isGameOver(this.playerDeck)) {
      // text.innerText = 'You Lose!!';
      this.stop = true;
      response = {
        ...response,
        message: 'Game Over! You Lose!!',
      };
    } else if (this.isGameOver(this.computerDeck)) {
      // text.innerText = 'You Win!!';
      this.stop = true;
      response = {
        ...response,
        message: 'Game Over! You Win!',
      };
    }

    return response;
  };

  // is winner of round
  private isRoundWinner(cardOne: Card, cardTwo: Card) {
    return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value];
  }

  // is game over
  private isGameOver(deck: Deck) {
    return deck.numberOfCards === 0;
  }

  public play = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session as any).userId;

    if (!userId) {
      return next(new HttpException('Please log in to play', 401));
    }

    // get user data
    const user = await User.findOne(userId);

    if (!user) {
      return next(new HttpException('Please log in to play', 401));
    }

    // set user points
    // this.points = user.points;

    const result = await this.flipCards(); // flip the c

    // persist userid and points to table
    await GameEntity.create({ points: this.points, playerId: userId }).save(); // save game data

    // after creation sum all points and update the user
    const games = await GameEntity.find({ where: { playerId: userId } });
    const total = games.reduce((acc, current) => acc + current.points, 0); // sum all points from games lljlajkfja
    user.points = total; // set points to total
    user.save(); // save

    return res.status(200).json({
      points: this.points,
      yourStack: this.playerCardsLeft,
      computerStack: this.computerCardsLeft,
      ...result,
    });
  };

  public leaderboard = async (_req: Request, res: Response) => {
    // find leader based on points in user
    const users = await User.find();
    const sortedUsers = [...users];

    sortedUsers.sort((a, b) => b.points - a.points);

    return res.status(200).json(sortedUsers);
  };

  public routes() {
    this.router.get('/play', this.play);
    this.router.get('/leaderboard', this.leaderboard);
  }
}
