# Commit - Strategy Builder, Backtesting, and AI Trading Platform

Commit is a full-stack trading-focused application built to help users create algorithmic strategies, test them against historical market data, and manage accounts with secure authentication. The backend powers strategy creation, rule management, backtesting, user sessions, and a Gemini-based AI endpoint, while the frontend is a Next.js 15 app scaffold that serves as the UI foundation for the platform.

The project was built to practice a real-world product flow that combines authentication, portfolio-style strategy modelling, market data analysis, scheduled automation, and AI-assisted workflows in one codebase.

---

## Why Commit Was Created

Most trading demos only show a single chart or a static calculator. Commit was designed to go further by combining the pieces that make a real strategy platform useful:

- Users should be able to register, log in, and keep a secure session.
- Traders should be able to build reusable strategies instead of hardcoding logic.
- Backtests should use historical market data and produce meaningful performance metrics.
- The platform should support templates, rule cloning, and per-user strategy ownership.
- An AI assistant endpoint should be available to support research and workflow automation.

The goal was to build a portfolio project that demonstrates backend architecture, data modelling, market-data processing, and a clean API surface for a strategy-driven trading product.

---

## Core Features

### 1. Authentication & Role-Based Sessions

- Secure registration and login with JWT access tokens and refresh tokens.
- Tokens are stored in HTTP-only cookies.
- Two roles are supported: `retail` and `admin`.
- Users can log out, refresh tokens, change passwords, and fetch the current session user.
- Passwords are hashed with bcrypt before being saved.

### 2. User Account Management

- Users register with name, email, and password.
- Accounts support basic preferences such as theme and notification flags.
- Subscriptions are modelled with plan and expiry fields for future monetization or tiering.
- Logged-in users can update account details and rotate their password.

### 3. Strategy Builder

- Users can create and manage their own trading strategies.
- Strategy definitions support categories such as `trend_following`, `mean_reversion`, `momentum`, `breakout`, and `custom`.
- Strategies can store entry rules, exit rules, legacy rules, risk-management settings, execution settings, and tags.
- Rule conditions can be based on indicators such as price, SMA, EMA, RSI, MACD, Bollinger Bands, and volume.
- Logical operators like `AND` and `OR` are supported for multi-condition rule sets.

### 4. Template Library

- Strategy templates can be retrieved and reused.
- Users can seed template data during development or testing.
- A template can be cloned into a personal strategy and then customized.
- This makes it easier to start from a proven strategy structure instead of building everything from scratch.

### 5. Backtesting Engine

- Users can start a backtest for a strategy against historical market data.
- The backtest API supports timeframes such as `1d`, `1h`, and `15m`.
- The backend fetches historical data using Yahoo Finance.
- The engine calculates key performance metrics such as total return, Sharpe ratio, max drawdown, volatility, and trade history.
- Each completed backtest is stored against the current user for later review.

### 6. AI Assistant Endpoint

- A Gemini-powered endpoint is exposed through the backend.
- Users can submit a prompt and receive a generated response.
- This provides a foundation for research assistance, workflow hints, or trading support inside the product.

### 7. Secure Backend Middleware

- Protected routes use a JWT verification middleware.
- CORS is configured for the frontend origin.
- Cookie parsing and JSON/body parsing are enabled globally.
- File uploads are prepared with Multer for profile and asset flows.

### 8. Frontend Scaffold

- The frontend uses Next.js 15 with React 19.
- The current app directory scaffold provides the base for the trading UI.
- The project is ready for dashboard, strategy, and backtest screens to be layered on top.

---

## Tech Stack

### Backend

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for access and refresh token auth
- **bcrypt / bcryptjs** for password hashing
- **Cloudinary** for file and image storage
- **Multer** for multipart uploads
- **yahoo-finance2** for historical market data
- **Gemini API** for AI-assisted responses
- **dotenv** for environment variable management
- **cors** and **cookie-parser** for session support

### Frontend

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Axios** for API communication
- **Tailwind CSS** for styling

---

## Project Structure

```text
Commit/
├── backend/
│   ├── .env                       # Backend environment variables
│   ├── src/
│   │   ├── index.js               # Server entry point
│   │   ├── app.js                 # Express app and route wiring
│   │   ├── constants.js           # Shared backend constants
│   │   ├── controllers/           # Auth, strategy, and backtest controllers
│   │   ├── db/                    # MongoDB connection helper
│   │   ├── gemini/                # Gemini AI route
│   │   ├── middlewares/           # JWT and upload middleware
│   │   ├── models/                # User, strategy, and backtest schemas
│   │   ├── routes/                # API route definitions
│   │   ├── scripts/               # Seed scripts
│   │   ├── services/              # Validation and business helpers
│   │   └── utils/                 # Cloudinary, token, and helper utilities
│   └── package.json
│
└── frontend/
    ├── src/
    │   └── app/                   # Next.js app router entry files
    └── package.json
```

---

## Main User Flow

### Retail User Flow

1. Register or log in.
2. Open the strategy builder area and define a new strategy.
3. Add entry and exit rules using indicators, operators, and risk settings.
4. Save the strategy and optionally clone from a template.
5. Run a backtest using a ticker, timeframe, and strategy parameters.
6. Review the generated metrics and trade history.
7. Use the AI endpoint for research assistance or prompt-based help.

### Admin Flow

1. Log in with an admin account.
2. Review user and strategy data.
3. Manage templates, system-level defaults, or future admin workflows.
4. Use the same backtesting and AI utilities where permitted.

---

## API Overview

### Users - `/api/v1/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user and upload profile images |
| `POST` | `/login` | Log in and receive session tokens |
| `POST` | `/logout` | Log out the current user |
| `POST` | `/refresh-token` | Refresh the access token |
| `POST` | `/change-password` | Change the current password |
| `GET`  | `/current-user` | Get the current authenticated user |
| `PATCH` | `/update-account` | Update account details |

### Strategies - `/api/v1/strategies`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/components` | Get available builder components like indicators and operators |
| `GET` | `/templates` | Fetch strategy templates |
| `POST` | `/seed-templates` | Seed template records for development/testing |
| `POST` | `/clone-template` | Clone a template into a personal strategy |
| `GET` | `/` | Get all strategies for the current user |
| `POST` | `/` | Create a new strategy |
| `GET` | `/:id` | Get a single strategy |
| `PUT` | `/:id` | Update a strategy |
| `DELETE` | `/:id` | Delete a strategy |
| `POST` | `/:id/entry-rules` | Add an entry rule |
| `PUT` | `/:id/entry-rules/:ruleId` | Update an entry rule |
| `DELETE` | `/:id/entry-rules/:ruleId` | Delete an entry rule |
| `POST` | `/:id/exit-rules` | Add an exit rule |
| `PUT` | `/:id/exit-rules/:ruleId` | Update an exit rule |
| `DELETE` | `/:id/exit-rules/:ruleId` | Delete an exit rule |

### Backtests - `/api/v1/backtest`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/start` | Run a new backtest for a strategy |
| `GET` | `/` | List all backtests for the current user |
| `GET` | `/:id` | Fetch a single backtest by ID |

### Gemini - `/api/gemini`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Send a prompt to Gemini and receive an AI response |

---

## Setup & Running Locally

### Prerequisites

- Node.js 18 or later
- MongoDB database or MongoDB Atlas connection string
- Cloudinary account for uploads
- Gemini API key

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Commit
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following values:

```env
PORT=8000
CLIENT_URL=http://localhost:8080
MONGO_URI=your-mongodb-connection-string
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SALT_ROUNDS=10
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

The backend app appends the database name from `backend/src/constants.js`, so `MONGO_URI` should be the base connection string without the database suffix.

Start the backend:

```bash
npm run dev
```

For production-style startup, you can use:

```bash
npm start
```

To seed strategy templates during development:

```bash
npm run seed
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend is a Next.js app scaffold and typically runs on `http://localhost:3000`.

---

### 4. Open the App

Visit the frontend URL in your browser and try the following:

- Register a retail user and create a personal strategy.
- Build entry and exit rules using technical indicators.
- Run a backtest on a ticker and inspect the results.
- Test the Gemini endpoint for AI-powered prompts.

---

## Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port the backend runs on |
| `CLIENT_URL` | Frontend origin allowed through CORS, such as `http://localhost:3000` |
| `MONGO_URI` | MongoDB connection string used before the database name is appended |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime, such as `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime, such as `7d` |
| `SALT_ROUNDS` | Password hashing cost factor |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Gemini API key used by the AI route |
| `NODE_ENV` | Runtime mode used for secure cookies |

---

## Screens in the App

**Backend Capabilities**
- User registration and login
- Account management and password updates
- Strategy builder and template library
- Entry and exit rule management
- Backtest execution and stored results
- Gemini prompt endpoint

**Frontend Scaffold**
- Next.js app router entry point
- Layout and global styling foundation
- Starter pages ready for product UI expansion

---

## What This Project Demonstrates

Commit demonstrates how to build a strategy-centric trading backend with:

- JWT authentication with refresh sessions
- Role-based authorization for retail and admin users
- MongoDB data modelling for users, strategies, and backtests
- Reusable strategy templates and rule management
- Backtesting powered by live historical data sources
- Performance metrics such as return, Sharpe ratio, and drawdown
- AI-assisted workflows through a Gemini endpoint
- A modern Next.js frontend base ready for the trading UI

---

## Notes

- The backend loads environment variables from `backend/.env` when started from the backend folder.
- If you want the frontend origin to be different, update `CLIENT_URL` in `backend/.env`.
- If you need to reset seeded strategy templates, rerun `npm run seed` from the backend folder.