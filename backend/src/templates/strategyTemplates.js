// server/templates/strategyTemplates.js
import { generateStrategyId } from '../utils/helpers.js';

const strategyTemplates = [
  {
    name: "Simple Moving Average Crossover",
    description: "Buy when fast SMA crosses above slow SMA, sell when it crosses below",
    category: "trend_following",
    rules: [
      {
        id: generateStrategyId(),
        name: "Buy Signal - SMA Crossover",
        conditions: [
          {
            indicator: "sma",
            operator: "crosses_above",
            value: {
              indicator: "sma",
              params: { period: 50 }
            },
            params: { period: 20 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "buy",
          quantity: "half",
          stopLoss: 5,
          takeProfit: 10
        },
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "Sell Signal - SMA Crossover",
        conditions: [
          {
            indicator: "sma",
            operator: "crosses_below",
            value: {
              indicator: "sma",
              params: { period: 50 }
            },
            params: { period: 20 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "all"
        },
        priority: 2,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 20,
      maxDailyLoss: 3,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    tags: ["beginner", "trend-following", "moving-average"],
    isTemplate: true
  },
  
  {
    name: "RSI Mean Reversion",
    description: "Buy when RSI is oversold (below 30), sell when overbought (above 70)",
    category: "mean_reversion",
    rules: [
      {
        id: generateStrategyId(),
        name: "Buy on Oversold",
        conditions: [
          {
            indicator: "rsi",
            operator: "<",
            value: 30,
            params: { period: 14 },
            timeframe: "1h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "buy",
          quantity: "custom",
          customQuantity: 1000,
          stopLoss: 3,
          takeProfit: 6
        },
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "Sell on Overbought",
        conditions: [
          {
            indicator: "rsi",
            operator: ">",
            value: 70,
            params: { period: 14 },
            timeframe: "1h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "all"
        },
        priority: 2,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 15,
      maxDailyLoss: 2,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    tags: ["intermediate", "mean-reversion", "rsi"],
    isTemplate: true
  },

  {
    name: "Bollinger Bands Breakout",
    description: "Buy when price breaks above upper band, sell when it breaks below lower band",
    category: "breakout",
    rules: [
      {
        id: generateStrategyId(),
        name: "Buy on Upper Band Breakout",
        conditions: [
          {
            indicator: "price",
            operator: ">",
            value: {
              indicator: "bollinger_bands",
              band: "upper",
              params: { period: 20, stdDev: 2 }
            },
            timeframe: "4h"
          },
          {
            indicator: "volume",
            operator: ">",
            value: {
              indicator: "sma",
              params: { period: 10 }
            },
            timeframe: "4h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "buy",
          quantity: "half",
          stopLoss: 4,
          takeProfit: 8
        },
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "Sell on Lower Band Break",
        conditions: [
          {
            indicator: "price",
            operator: "<",
            value: {
              indicator: "bollinger_bands",
              band: "lower",
              params: { period: 20, stdDev: 2 }
            },
            timeframe: "4h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "all"
        },
        priority: 2,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 25,
      maxDailyLoss: 4,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    tags: ["advanced", "breakout", "bollinger-bands", "volume"],
    isTemplate: true
  },

  {
    name: "MACD Momentum Strategy",
    description: "Buy when MACD line crosses above signal line, sell when it crosses below",
    category: "momentum",
    rules: [
      {
        id: generateStrategyId(),
        name: "MACD Bullish Cross",
        conditions: [
          {
            indicator: "macd",
            operator: "crosses_above",
            value: {
              indicator: "macd",
              line: "signal"
            },
            params: { fast: 12, slow: 26, signal: 9 },
            timeframe: "1d"
          },
          {
            indicator: "macd",
            operator: ">",
            value: 0,
            params: { fast: 12, slow: 26, signal: 9 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "buy",
          quantity: "half",
          stopLoss: 3,
          takeProfit: 9
        },
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "MACD Bearish Cross",
        conditions: [
          {
            indicator: "macd",
            operator: "crosses_below",
            value: {
              indicator: "macd",
              line: "signal"
            },
            params: { fast: 12, slow: 26, signal: 9 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "all"
        },
        priority: 2,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 18,
      maxDailyLoss: 3,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    tags: ["intermediate", "momentum", "macd"],
    isTemplate: true
  },

  {
    name: "Multi-Indicator Confirmation",
    description: "Conservative strategy requiring multiple indicators to align before trading",
    category: "trend_following",
    rules: [
      {
        id: generateStrategyId(),
        name: "Multi-Signal Buy",
        conditions: [
          {
            indicator: "price",
            operator: ">",
            value: {
              indicator: "sma",
              params: { period: 50 }
            },
            timeframe: "1d"
          },
          {
            indicator: "rsi",
            operator: ">",
            value: 50,
            params: { period: 14 },
            timeframe: "1d"
          },
          {
            indicator: "macd",
            operator: ">",
            value: {
              indicator: "macd",
              line: "signal"
            },
            params: { fast: 12, slow: 26, signal: 9 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "buy",
          quantity: "custom",
          customQuantity: 500,
          stopLoss: 5,
          takeProfit: 12
        },
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "Multi-Signal Sell",
        conditions: [
          {
            indicator: "price",
            operator: "<",
            value: {
              indicator: "sma",
              params: { period: 20 }
            },
            timeframe: "1d"
          },
          {
            indicator: "rsi",
            operator: "<",
            value: 45,
            params: { period: 14 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "OR",
        action: {
          type: "sell",
          quantity: "all"
        },
        priority: 2,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 12,
      maxDailyLoss: 2,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    tags: ["conservative", "multi-indicator", "confirmation"],
    isTemplate: true
  }
];

export { strategyTemplates };
export default strategyTemplates;