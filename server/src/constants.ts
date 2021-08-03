import env from './env';

export const __prod__ = env.NODE_ENV === 'production';
export const FORGOT_PASSWORD_PREFIX = 'forgot-password:';
export const CONFIRM_EMAIL_PREFIX = 'confirm-email:';

export const CARD_SUITS = ['♠', '♣', '♥', '♦'] as const;
export const CARD_VALUES = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const;
export const CARD_VALUE_MAP = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
} as const;
