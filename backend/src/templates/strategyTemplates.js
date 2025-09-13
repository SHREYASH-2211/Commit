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
  },

  // New Entry/Exit Rule Templates
  {
    name: "SMA Crossover Entry/Exit Strategy",
    description: "Modern entry/exit rule structure for SMA crossover strategy",
    category: "trend_following",
    entryRules: [
      {
        id: generateStrategyId(),
        name: "SMA Golden Cross Entry",
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
          takeProfit: 15
        },
        priority: 1,
        isActive: true
      }
    ],
    exitRules: [
      {
        id: generateStrategyId(),
        name: "SMA Death Cross Exit",
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
        priority: 1,
        isActive: true
      }
    ],
    riskManagement: {
      maxPositionSize: 20,
      maxDailyLoss: 3,
      stopLossEnabled: true,
      takeProfitEnabled: true
    },
    executionSettings: {
      allowMultiplePositions: false,
      maxConcurrentPositions: 1,
      requireExitBeforeEntry: true
    },
    tags: ["beginner", "trend-following", "sma", "entry-exit"],
    isTemplate: true
  },

  {
    name: "RSI Mean Reversion Entry/Exit",
    description: "Entry/exit structure for RSI mean reversion strategy",
    category: "mean_reversion",
    entryRules: [
      {
        id: generateStrategyId(),
        name: "RSI Oversold Entry",
        conditions: [
          {
            indicator: "rsi",
            operator: "<",
            value: 30,
            params: { period: 14 },
            timeframe: "1h"
          },
          {
            indicator: "price",
            operator: ">",
            value: {
              indicator: "sma",
              params: { period: 200 }
            },
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
      }
    ],
    exitRules: [
      {
        id: generateStrategyId(),
        name: "RSI Overbought Exit",
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
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "RSI Neutral Exit",
        conditions: [
          {
            indicator: "rsi",
            operator: ">",
            value: 50,
            params: { period: 14 },
            timeframe: "1h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "half"
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
    executionSettings: {
      allowMultiplePositions: false,
      maxConcurrentPositions: 1,
      requireExitBeforeEntry: true
    },
    tags: ["intermediate", "mean-reversion", "rsi", "entry-exit"],
    isTemplate: true
  },

  {
    name: "Bollinger Bands Entry/Exit Strategy",
    description: "Advanced entry/exit strategy using Bollinger Bands with volume confirmation",
    category: "breakout",
    entryRules: [
      {
        id: generateStrategyId(),
        name: "Upper Band Breakout Entry",
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
          },
          {
            indicator: "rsi",
            operator: "<",
            value: 80,
            params: { period: 14 },
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
      }
    ],
    exitRules: [
      {
        id: generateStrategyId(),
        name: "Lower Band Touch Exit",
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
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "Middle Band Exit",
        conditions: [
          {
            indicator: "price",
            operator: "<",
            value: {
              indicator: "bollinger_bands",
              band: "middle",
              params: { period: 20, stdDev: 2 }
            },
            timeframe: "4h"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "half"
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
    executionSettings: {
      allowMultiplePositions: true,
      maxConcurrentPositions: 2,
      requireExitBeforeEntry: false
    },
    tags: ["advanced", "breakout", "bollinger-bands", "volume", "entry-exit"],
    isTemplate: true
  },

  {
    name: "MACD Momentum Entry/Exit",
    description: "Entry/exit structure for MACD momentum strategy with divergence detection",
    category: "momentum",
    entryRules: [
      {
        id: generateStrategyId(),
        name: "MACD Bullish Cross Entry",
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
          },
          {
            indicator: "price",
            operator: ">",
            value: {
              indicator: "sma",
              params: { period: 50 }
            },
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
      }
    ],
    exitRules: [
      {
        id: generateStrategyId(),
        name: "MACD Bearish Cross Exit",
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
        priority: 1,
        isActive: true
      },
      {
        id: generateStrategyId(),
        name: "MACD Zero Line Exit",
        conditions: [
          {
            indicator: "macd",
            operator: "<",
            value: 0,
            params: { fast: 12, slow: 26, signal: 9 },
            timeframe: "1d"
          }
        ],
        logicalOperator: "AND",
        action: {
          type: "sell",
          quantity: "half"
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
    executionSettings: {
      allowMultiplePositions: false,
      maxConcurrentPositions: 1,
      requireExitBeforeEntry: true
    },
    tags: ["intermediate", "momentum", "macd", "entry-exit"],
    isTemplate: true
  }
];

export { strategyTemplates };
export default strategyTemplates;