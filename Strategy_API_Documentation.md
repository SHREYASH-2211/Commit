# Strategy Trading API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All strategy endpoints require authentication. Use JWT Bearer token in the Authorization header.

## API Endpoints

### 1. Authentication Endpoints

#### Register User
- **POST** `/api/v1/users/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Login User
- **POST** `/api/v1/users/login`
- **Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Response:** Returns access token and refresh token

#### Get Current User
- **GET** `/api/v1/users/current-user`
- **Headers:** `Authorization: Bearer <token>`

#### Logout User
- **POST** `/api/v1/users/logout`
- **Headers:** `Authorization: Bearer <token>`

### 2. Strategy Builder Components

#### Get Builder Components
- **GET** `/api/v1/strategies/components`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Returns available indicators, operators, actions, quantities, and timeframes

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "indicators": [
      {
        "id": "price",
        "name": "Price",
        "description": "Current market price"
      },
      {
        "id": "sma",
        "name": "Simple Moving Average",
        "description": "SMA indicator",
        "params": ["period"]
      },
      {
        "id": "rsi",
        "name": "RSI",
        "description": "Relative Strength Index",
        "params": ["period"]
      }
    ],
    "operators": [
      { "id": ">", "name": "Greater than", "symbol": ">" },
      { "id": "<", "name": "Less than", "symbol": "<" },
      { "id": "crosses_above", "name": "Crosses above", "symbol": "↑" }
    ],
    "actions": [
      { "id": "buy", "name": "Buy", "color": "green" },
      { "id": "sell", "name": "Sell", "color": "red" }
    ],
    "quantities": [
      { "id": "all", "name": "All available funds" },
      { "id": "half", "name": "50% of available funds" },
      { "id": "custom", "name": "Custom amount" }
    ],
    "timeframes": [
      { "id": "1m", "name": "1 Minute" },
      { "id": "1h", "name": "1 Hour" },
      { "id": "1d", "name": "1 Day" }
    ]
  }
}
```

### 3. Strategy Templates

#### Get All Templates
- **GET** `/api/v1/strategies/templates`
- **Headers:** `Authorization: Bearer <token>`

#### Seed Templates
- **POST** `/api/v1/strategies/seed-templates`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Populates the database with pre-built strategy templates
- **Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 5 templates",
  "data": {
    "count": 5,
    "templates": [
      {
        "id": "template_id_1",
        "name": "Simple Moving Average Crossover",
        "category": "trend_following"
      }
    ]
  }
}
```

#### Clone Template
- **POST** `/api/v1/strategies/clone-template`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "templateId": "template_id_here",
  "name": "My Custom Strategy from Template"
}
```

### 4. Strategy CRUD Operations

#### Get All User Strategies
- **GET** `/api/v1/strategies?page=1&limit=10&category=all`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category (all, trend_following, mean_reversion, momentum, breakout, custom)

#### Create New Strategy
- **POST** `/api/v1/strategies`
- **Headers:** `Authorization: Bearer <token>`
- **Body (Legacy Format):**
```json
{
  "name": "My Custom Trading Strategy",
  "description": "A simple RSI-based mean reversion strategy",
  "category": "mean_reversion",
  "rules": [
    {
      "name": "Buy on RSI Oversold",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": "<",
          "value": 30,
          "params": {
            "period": 14
          },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "half",
        "stopLoss": 5,
        "takeProfit": 10
      },
      "priority": 1,
      "isActive": true
    },
    {
      "name": "Sell on RSI Overbought",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": ">",
          "value": 70,
          "params": {
            "period": 14
          },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "sell",
        "quantity": "all"
      },
      "priority": 2,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 20,
    "maxDailyLoss": 5,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "tags": ["rsi", "mean-reversion", "custom"]
}
```

- **Body (New Entry/Exit Format):**
```json
{
  "name": "Modern Entry/Exit Strategy",
  "description": "Strategy using separate entry and exit rules",
  "category": "trend_following",
  "entryRules": [
    {
      "name": "SMA Golden Cross Entry",
      "conditions": [
        {
          "indicator": "sma",
          "operator": "crosses_above",
          "value": {
            "indicator": "sma",
            "params": { "period": 50 }
          },
          "params": { "period": 20 },
          "timeframe": "1d"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "half",
        "stopLoss": 5,
        "takeProfit": 15
      },
      "priority": 1,
      "isActive": true
    }
  ],
  "exitRules": [
    {
      "name": "SMA Death Cross Exit",
      "conditions": [
        {
          "indicator": "sma",
          "operator": "crosses_below",
          "value": {
            "indicator": "sma",
            "params": { "period": 50 }
          },
          "params": { "period": 20 },
          "timeframe": "1d"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "sell",
        "quantity": "all"
      },
      "priority": 1,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 20,
    "maxDailyLoss": 3,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "executionSettings": {
    "allowMultiplePositions": false,
    "maxConcurrentPositions": 1,
    "requireExitBeforeEntry": true
  },
  "tags": ["sma", "crossover", "entry-exit"]
}
```

#### Get Single Strategy
- **GET** `/api/v1/strategies/{strategyId}`
- **Headers:** `Authorization: Bearer <token>`

#### Update Strategy
- **PUT** `/api/v1/strategies/{strategyId}`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same structure as create, but only include fields to update

#### Delete Strategy
- **DELETE** `/api/v1/strategies/{strategyId}`
- **Headers:** `Authorization: Bearer <token>`

### 5. Entry/Exit Rule Management

#### Add Entry Rule
- **POST** `/api/v1/strategies/{strategyId}/entry-rules`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "rule": {
    "name": "RSI Oversold Entry",
    "conditions": [
      {
        "indicator": "rsi",
        "operator": "<",
        "value": 30,
        "params": { "period": 14 },
        "timeframe": "1h"
      }
    ],
    "logicalOperator": "AND",
    "action": {
      "type": "buy",
      "quantity": "half",
      "stopLoss": 3,
      "takeProfit": 6
    },
    "priority": 1,
    "isActive": true
  }
}
```

#### Add Exit Rule
- **POST** `/api/v1/strategies/{strategyId}/exit-rules`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "rule": {
    "name": "RSI Overbought Exit",
    "conditions": [
      {
        "indicator": "rsi",
        "operator": ">",
        "value": 70,
        "params": { "period": 14 },
        "timeframe": "1h"
      }
    ],
    "logicalOperator": "AND",
    "action": {
      "type": "sell",
      "quantity": "all"
    },
    "priority": 1,
    "isActive": true
  }
}
```

#### Update Entry Rule
- **PUT** `/api/v1/strategies/{strategyId}/entry-rules/{ruleId}`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same structure as add entry rule

#### Update Exit Rule
- **PUT** `/api/v1/strategies/{strategyId}/exit-rules/{ruleId}`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same structure as add exit rule

#### Delete Entry Rule
- **DELETE** `/api/v1/strategies/{strategyId}/entry-rules/{ruleId}`
- **Headers:** `Authorization: Bearer <token>`

#### Delete Exit Rule
- **DELETE** `/api/v1/strategies/{strategyId}/exit-rules/{ruleId}`
- **Headers:** `Authorization: Bearer <token>`

## Strategy Structure

### Legacy Rule Structure
```json
{
  "name": "Rule Name",
  "conditions": [
    {
      "indicator": "rsi|sma|ema|macd|bollinger_bands|price|volume",
      "operator": ">|<|>=|<=|==|crosses_above|crosses_below",
      "value": 30,
      "params": {
        "period": 14
      },
      "timeframe": "1m|5m|15m|1h|4h|1d"
    }
  ],
  "logicalOperator": "AND|OR",
  "action": {
    "type": "buy|sell|hold",
    "quantity": "all|half|custom",
    "customQuantity": 1000,
    "stopLoss": 5,
    "takeProfit": 10
  },
  "priority": 1,
  "isActive": true
}
```

### Entry Rule Structure
```json
{
  "name": "Entry Rule Name",
  "conditions": [
    {
      "indicator": "rsi|sma|ema|macd|bollinger_bands|price|volume",
      "operator": ">|<|>=|<=|==|crosses_above|crosses_below",
      "value": 30,
      "params": {
        "period": 14
      },
      "timeframe": "1m|5m|15m|1h|4h|1d"
    }
  ],
  "logicalOperator": "AND|OR",
  "action": {
    "type": "buy",
    "quantity": "all|half|custom",
    "customQuantity": 1000,
    "stopLoss": 5,
    "takeProfit": 10
  },
  "priority": 1,
  "isActive": true
}
```

### Exit Rule Structure
```json
{
  "name": "Exit Rule Name",
  "conditions": [
    {
      "indicator": "rsi|sma|ema|macd|bollinger_bands|price|volume",
      "operator": ">|<|>=|<=|==|crosses_above|crosses_below",
      "value": 70,
      "params": {
        "period": 14
      },
      "timeframe": "1m|5m|15m|1h|4h|1d"
    }
  ],
  "logicalOperator": "AND|OR",
  "action": {
    "type": "sell",
    "quantity": "all|half|custom",
    "customQuantity": 1000
  },
  "priority": 1,
  "isActive": true
}
```

### Risk Management Structure
```json
{
  "maxPositionSize": 20,
  "maxDailyLoss": 5,
  "stopLossEnabled": true,
  "takeProfitEnabled": true
}
```

### Execution Settings Structure
```json
{
  "allowMultiplePositions": false,
  "maxConcurrentPositions": 1,
  "requireExitBeforeEntry": true
}
```

### Position Tracking Structure
```json
{
  "currentPosition": {
    "isOpen": false,
    "entryPrice": 0,
    "entryTimestamp": null,
    "shares": 0,
    "stopLossPrice": 0,
    "takeProfitPrice": 0
  }
}
```

## Available Indicators

### Price Indicators
- `price`: Current market price
- `volume`: Trading volume

### Technical Indicators
- `sma`: Simple Moving Average
  - Params: `period` (1-200)
- `ema`: Exponential Moving Average
  - Params: `period` (1-200)
- `rsi`: Relative Strength Index
  - Params: `period` (1-200)
  - Value range: 0-100
- `macd`: Moving Average Convergence Divergence
  - Params: `fast`, `slow`, `signal`
- `bollinger_bands`: Bollinger Bands
  - Params: `period`, `stdDev`
  - Access: `upper`, `lower`, `middle`

## Available Operators
- `>`: Greater than
- `<`: Less than
- `>=`: Greater than or equal
- `<=`: Less than or equal
- `==`: Equal to
- `crosses_above`: Crosses above
- `crosses_below`: Crosses below

## Available Actions
- `buy`: Buy action
- `sell`: Sell action
- `hold`: Hold action

## Available Quantities
- `all`: All available funds
- `half`: 50% of available funds
- `custom`: Custom amount (requires `customQuantity`)

## Available Timeframes
- `1m`: 1 Minute
- `5m`: 5 Minutes
- `15m`: 15 Minutes
- `1h`: 1 Hour
- `4h`: 4 Hours
- `1d`: 1 Day

## Strategy Categories
- `trend_following`: Trend following strategies
- `mean_reversion`: Mean reversion strategies
- `momentum`: Momentum strategies
- `breakout`: Breakout strategies
- `custom`: Custom strategies

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Invalid strategy configuration",
  "errors": [
    "Rule 1: RSI value must be between 0 and 100",
    "Rule 1: Rule must have at least one condition"
  ]
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Strategy not found"
}
```

### Unauthorized Error
```json
{
  "success": false,
  "message": "Unauthorized request"
}
```

## Sample Strategy Examples

### 1. Modern Entry/Exit RSI Strategy
```json
{
  "name": "RSI Mean Reversion Entry/Exit",
  "description": "Modern entry/exit structure for RSI mean reversion",
  "category": "mean_reversion",
  "entryRules": [
    {
      "name": "RSI Oversold Entry",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": "<",
          "value": 30,
          "params": { "period": 14 },
          "timeframe": "1h"
        },
        {
          "indicator": "price",
          "operator": ">",
          "value": {
            "indicator": "sma",
            "params": { "period": 200 }
          },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "custom",
        "customQuantity": 1000,
        "stopLoss": 3,
        "takeProfit": 6
      },
      "priority": 1,
      "isActive": true
    }
  ],
  "exitRules": [
    {
      "name": "RSI Overbought Exit",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": ">",
          "value": 70,
          "params": { "period": 14 },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "sell",
        "quantity": "all"
      },
      "priority": 1,
      "isActive": true
    },
    {
      "name": "RSI Neutral Exit",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": ">",
          "value": 50,
          "params": { "period": 14 },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "sell",
        "quantity": "half"
      },
      "priority": 2,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 15,
    "maxDailyLoss": 2,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "executionSettings": {
    "allowMultiplePositions": false,
    "maxConcurrentPositions": 1,
    "requireExitBeforeEntry": true
  },
  "tags": ["rsi", "mean-reversion", "entry-exit"]
}
```

### 2. Legacy RSI Strategy
```json
{
  "name": "RSI Mean Reversion",
  "description": "Buy when RSI is oversold, sell when overbought",
  "category": "mean_reversion",
  "rules": [
    {
      "name": "Buy on Oversold",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": "<",
          "value": 30,
          "params": { "period": 14 },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "half",
        "stopLoss": 3,
        "takeProfit": 6
      },
      "priority": 1,
      "isActive": true
    },
    {
      "name": "Sell on Overbought",
      "conditions": [
        {
          "indicator": "rsi",
          "operator": ">",
          "value": 70,
          "params": { "period": 14 },
          "timeframe": "1h"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "sell",
        "quantity": "all"
      },
      "priority": 2,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 15,
    "maxDailyLoss": 2,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "tags": ["rsi", "mean-reversion"]
}
```

### 2. SMA Crossover Strategy
```json
{
  "name": "SMA Crossover Strategy",
  "description": "Buy when fast SMA crosses above slow SMA",
  "category": "trend_following",
  "rules": [
    {
      "name": "Buy Signal - SMA Crossover",
      "conditions": [
        {
          "indicator": "sma",
          "operator": "crosses_above",
          "value": {
            "indicator": "sma",
            "params": { "period": 50 }
          },
          "params": { "period": 20 },
          "timeframe": "1d"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "half",
        "stopLoss": 5,
        "takeProfit": 10
      },
      "priority": 1,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 20,
    "maxDailyLoss": 3,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "tags": ["sma", "crossover", "trend-following"]
}
```

### 3. Multi-Indicator Strategy
```json
{
  "name": "Multi-Indicator Confirmation",
  "description": "Requires multiple indicators to align",
  "category": "trend_following",
  "rules": [
    {
      "name": "Multi-Signal Buy",
      "conditions": [
        {
          "indicator": "price",
          "operator": ">",
          "value": {
            "indicator": "sma",
            "params": { "period": 50 }
          },
          "timeframe": "1d"
        },
        {
          "indicator": "rsi",
          "operator": ">",
          "value": 50,
          "params": { "period": 14 },
          "timeframe": "1d"
        },
        {
          "indicator": "macd",
          "operator": ">",
          "value": {
            "indicator": "macd",
            "line": "signal"
          },
          "params": { "fast": 12, "slow": 26, "signal": 9 },
          "timeframe": "1d"
        }
      ],
      "logicalOperator": "AND",
      "action": {
        "type": "buy",
        "quantity": "custom",
        "customQuantity": 500,
        "stopLoss": 5,
        "takeProfit": 12
      },
      "priority": 1,
      "isActive": true
    }
  ],
  "riskManagement": {
    "maxPositionSize": 12,
    "maxDailyLoss": 2,
    "stopLossEnabled": true,
    "takeProfitEnabled": true
  },
  "tags": ["multi-indicator", "conservative"]
}
```

## Testing with Postman

1. Import the provided `Strategy_API_Postman_Collection.json` file
2. Set the `baseUrl` variable to `http://localhost:8000`
3. Start with the Authentication folder:
   - Register a new user
   - Login to get the access token
4. The access token will be automatically set in the collection variables
5. Test all strategy endpoints using the pre-configured requests

## Environment Variables

Make sure your `.env` file contains:
```
PORT=8000
MONGO_URI=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SALT_ROUNDS=10
```
