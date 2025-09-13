# Backtesting Integration Documentation

## Overview
This document describes the complete integration between the frontend backtesting interface and the backend API for running strategy backtests.

## Frontend Parameters Location

### 1. State Variables (Backtesting.tsx)
```typescript
// Line 50: Timeframe selection
const [timeframe, setTimeframe] = useState('1d');

// Lines 142-146: Strategy parameters with defaults
let strategyParams = {
  shortMA: 20,        // Short Moving Average period
  longMA: 50,         // Long Moving Average period
  ...strategy?.executionSettings
};
```

### 2. API Interfaces (api.ts)
```typescript
// Lines 219-223: Backtest parameters interface
export interface BacktestParameters {
  shortMA?: number;    // Short Moving Average period
  longMA?: number;     // Long Moving Average period
  [key: string]: any;  // Additional parameters
}

// Lines 239-246: Backtest data structure
export interface Backtest {
  _id: string;
  user: string;
  ticker: string;
  strategyName: string;
  timeframe: string;           // Data timeframe (1d, 1h, 5m)
  parameters: BacktestParameters;
  results: BacktestResult;
  createdAt: string;
  updatedAt: string;
}
```

### 3. UI Components Location

#### Timeframe Selection (Backtesting.tsx:340-350)
```typescript
<Label htmlFor="timeframe">Timeframe</Label>
<Select value={timeframe} onValueChange={setTimeframe}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1d">Daily</SelectItem>
    <SelectItem value="1h">Hourly</SelectItem>
    <SelectItem value="5m">5 Minutes</SelectItem>
  </SelectContent>
</Select>
```

#### Parameter Extraction Logic (Backtesting.tsx:148-164)
```typescript
// Try to extract parameters from strategy rules
if (strategy?.rules || strategy?.entryRules) {
  const rules = strategy.rules || strategy.entryRules || [];
  rules.forEach((rule: any) => {
    if (rule.conditions) {
      rule.conditions.forEach((condition: any) => {
        if (condition.indicator === 'sma' && condition.params?.period) {
          if (condition.params.period <= 30) {
            strategyParams.shortMA = condition.params.period;
          } else {
            strategyParams.longMA = condition.params.period;
          }
        }
      });
    }
  });
}
```

## Backend API Endpoints

### 1. Start Backtest
```
POST /api/v1/backtest/start
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "ticker": "AAPL",
  "strategyName": "Moving Average Crossover",
  "parameters": {
    "shortMA": 20,
    "longMA": 50
  },
  "timeframe": "1d"
}
```

### 2. Get Backtest History
```
GET /api/v1/backtest
Authorization: Bearer <your_access_token>
```

### 3. Get Specific Backtest
```
GET /api/v1/backtest/:id
Authorization: Bearer <your_access_token>
```

## Parameter Flow

### 1. User Input
- **Ticker Symbol**: User enters in text input (e.g., "AAPL")
- **Strategy Selection**: User selects from dropdown (user strategies or templates)
- **Timeframe**: User selects from dropdown (1d, 1h, 5m)

### 2. Parameter Processing
```typescript
// Default parameters
let strategyParams = {
  shortMA: 20,
  longMA: 50,
  ...strategy?.executionSettings
};

// Extract from strategy rules
if (strategy?.rules || strategy?.entryRules) {
  // Logic to extract SMA periods from strategy conditions
  // shortMA = period <= 30
  // longMA = period > 30
}
```

### 3. API Call
```typescript
const backtestData = {
  ticker: ticker.toUpperCase(),
  strategyName: strategy?.name || 'Custom Strategy',
  parameters: strategyParams,
  timeframe: timeframe
};

const response = await backtestAPI.startBacktest(backtestData);
```

## Backend Parameter Handling

### Backtest Controller (backtest.controller.js:40-97)
```javascript
export const startBacktest = asyncHandler(async (req, res) => {
  const { ticker, strategyName, parameters, timeframe } = req.body;
  
  // Extract parameters with defaults
  const short = parameters?.shortMA || 20;
  const long = parameters?.longMA || 50;
  
  // Yahoo Finance API call
  const queryOptions = { 
    period1: "2020-01-01", 
    interval: timeframe || "1d" 
  };
  const result = await yahooFinance.historical(ticker, queryOptions);
  
  // Strategy execution logic
  // ... Moving Average Crossover implementation
});
```

## Strategy Templates Integration

### Available Templates
1. **Simple Moving Average Crossover** - Uses shortMA=20, longMA=50
2. **RSI Mean Reversion** - Uses RSI periods
3. **Bollinger Bands Breakout** - Uses BB periods and stdDev
4. **MACD Momentum Strategy** - Uses MACD parameters
5. **Multi-Indicator Confirmation** - Complex multi-parameter strategy

### Template Loading
```typescript
// Load templates
const loadTemplates = async () => {
  const response = await strategyAPI.getTemplates();
  setTemplates(response.data || []);
};

// Seed templates (first time)
const seedTemplates = async () => {
  await strategyAPI.seedTemplates();
  await loadTemplates();
};
```

## UI Components

### 1. Strategy Selection Panel
- **Toggle**: Switch between "My Strategies" and "Templates"
- **Load Templates Button**: Appears when no templates available
- **Strategy Dropdown**: Shows available strategies with status badges

### 2. Configuration Panel
- **Ticker Input**: Text input for stock symbol
- **Timeframe Selector**: Dropdown with 1d, 1h, 5m options
- **Initial Capital**: Number input (default: 100,000)
- **Commission**: Number input (default: 0.1%)
- **Slippage**: Number input (default: 0.05%)
- **Benchmark**: Selector (SPY, QQQ, IWM)

### 3. Results Display
- **Performance Metrics**: Total Return, Sharpe Ratio, Max Drawdown, Volatility
- **Charts**: Cumulative performance and monthly returns
- **Backtest History**: List of previous backtests with click-to-view

## Error Handling

### Frontend Validation
```typescript
if (!selectedStrategy || !ticker) {
  toast({
    title: "Missing Information",
    description: "Please select a strategy and enter a ticker symbol",
    variant: "destructive",
  });
  return;
}
```

### API Error Handling
```typescript
try {
  const response = await backtestAPI.startBacktest(backtestData);
  setBacktestResults(response.data);
  toast({
    title: "Backtest Completed",
    description: "Your backtest has been completed successfully",
  });
} catch (error: any) {
  toast({
    title: "Backtest Failed",
    description: error.response?.data?.message || "Failed to run backtest",
    variant: "destructive",
  });
}
```

## Data Flow Summary

1. **User Input** → Frontend State Variables
2. **Strategy Selection** → Parameter Extraction from Rules
3. **Parameter Processing** → Default + Extracted Parameters
4. **API Call** → Backend Backtest Controller
5. **Yahoo Finance** → Historical Data Fetch
6. **Strategy Execution** → Moving Average Crossover Logic
7. **Results Calculation** → Performance Metrics
8. **Database Storage** → Backtest Results Save
9. **Frontend Display** → Results Visualization

## Testing

### Manual Testing Steps
1. Start backend server: `npm start` (port 8000)
2. Start frontend: `npm run dev` (port 8080)
3. Navigate to Backtesting page
4. Click "Load Templates" if first time
5. Select a ticker (e.g., "AAPL")
6. Choose a strategy template
7. Select timeframe
8. Click "Run Backtest"
9. Verify results display

### API Testing
```bash
# Test backtest endpoint
curl -X POST http://localhost:8000/api/v1/backtest/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "AAPL",
    "strategyName": "Moving Average Crossover",
    "parameters": {"shortMA": 20, "longMA": 50},
    "timeframe": "1d"
  }'
```

## Future Enhancements

1. **Custom Parameter Input**: Allow users to manually set shortMA/longMA
2. **Multiple Strategy Support**: Support for RSI, MACD, Bollinger Bands strategies
3. **Advanced Parameters**: Commission, slippage, position sizing
4. **Real-time Updates**: WebSocket integration for live backtest progress
5. **Export Functionality**: Download backtest results as CSV/PDF
6. **Comparison Mode**: Compare multiple strategies side-by-side
7. **Optimization**: Parameter optimization for best performance

## Troubleshooting

### Common Issues
1. **No strategies in dropdown**: Click "Load Templates" button
2. **Backtest fails**: Check ticker symbol validity
3. **No historical data**: Verify ticker exists on Yahoo Finance
4. **Authentication errors**: Ensure user is logged in with valid token

### Debug Steps
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check backend logs for errors
4. Validate request payload structure
5. Ensure database connection is working
