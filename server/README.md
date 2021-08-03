# Karata Card Game REST API

This is a card game API developed with Express, Node and TypeOrm. It involves the user making a request to an endpoint and a random card is picked and returned. Based on the picked card, the user either **loses**, **wins** or **draws** in comparison to what the computer picks.

- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [Authentication](#authentication)
    - [Registration](#registration)
    - [Login](#login)
    - [Me](#me)
    - [Forgot Password](#forgot_password)
    - [Reset Password](#reset_password)
  - [Game Play](#game_play)
    - [Play](#play)
    - [Leaderboard](#leaderboard)

## Introduction

This API contains endpoints for authentication and gaming. It uses `GET` and `POST` methods to make HTTP requests.

## Endpoints

#### Authentication

Authentication involves multiple endpoints which allow the user to _create an account_, _access their account_, _generate a token to reset password_ and _reset their password_

##### Registration

```typescript
/**
 *  @endpoint /api/auth/register
 *  @description Creates a new user
 *  @method: POST
 *
 * */
type Request = {
  name: string;
  email: string;
  surname?: string;
  password: string;
};

type Response = {
  name: string;
  email: string;
  surname: string | null;
};
```

##### Login

When the user logs in, the user id is stored in the session which is then used for authorization
When the user logs in, the user id is stored in the session

```typescript
  /**
   *  @endpoint /api/auth/login
   *  @description Log in a user based on credentials
   *  @method POST
   *
   * */
  type Request = {
    name: string;
    email: string;
    surname?: string;
    password: string;
  }

  type Response = {
    name: string;
    email: string;
    surname: string | null;
  }

  // error response
  400: Invalid user input for incorrect email or password
```

##### Me

Gets currently logged in user based on token stored in session

```typescript
  /**
   *  @endpoint /api/auth/me
   *  @description Get currently logged in user
   *  @method GET
   *  @request based on token, acquired user id
   *
   * */

  type Response = {
    name: string;
    email: string;
    surname: string | null;
    createdAt: string;
    updatedAt: string;
    points: number; // game points accumulated
  }

  // error response
  401: Unauthorized access based on invalid token
```

##### Forgot Password

Enables the user to reset their password using their email address

```typescript
  /**
   *  @endpoint /api/auth/forgot-password
   *  @description Enables the user to reset their password, generates a token and saves in Redis
   *  @method POST
   *
   * */
  type Request = {
    email: string;
  }

  type Response = {
    token: string; // token to be used for password reset
    success: boolean;
  }

  // error response
  400: Invalid user input for incorrect or no email
```

##### Reset Password

Lets the user reset their password

```typescript
  /**
   *  @endpoint /api/auth/reset-password/:token
   *  @description Lets users reset their password based on token generated
   *  @method POST
   *
   * */
  type Request = {
    password: stAUTHENTICATEDring;
    confirm_password: string;
  }

  type Response = {
   success: true;
  }

  // error response
  400: Invalid user input for incorrect or no password or confirm_password
```

##### Logout

Logs out the user by clearing the token from session

```typescript
/**
 *  @endpoint /api/auth/logout
 *  @description Logs out user
 *  @method POST
 *  @request based on token
 *
 * */

type Response = {
  success: boolean;
};
```

#### Game Play

Endpoints to enable the user to play. These endpoints require the user to be _authenticated_

##### Play

Lets the user reset their password

```typescript
/**
 *  @endpoint /api/play
 *  @description Making a request leads to selection of a random card
 *  @method GET
 *  @accessiblity Private - authentication required
 *
 * */
type Request = {};

type Response = {
  points: number;
  yourStack: number;
  computerStack: number;
  yours: [string, string]; // your card value and  suit
  opponents: [string, string]; // opponent's card and suit
  message: string; // Win, Lose or Draw
};
```

##### Leaderboard

Sorts users based on their points in the game with the highest points being the first

```typescript
/**
 *  @endpoint /api/leaderboard
 *  @description Displays a list of users sorted in descending order based on points
 *  @method GET
 *  @accessiblity Private - authentication required
 *
 * */
type Request = {};

type Response = {
  name: string;
  surname: string | null;
  email: string;
  points: number;
  createdAt: string;
  updatedAt: string;
};
```
