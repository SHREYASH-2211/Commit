// server/models/Strategy.js
import mongoose from 'mongoose';

const ConditionSchema = new mongoose.Schema({
  indicator: {
    type: String,
    required: true,
    enum: ['price', 'sma', 'ema', 'rsi', 'macd', 'bollinger_bands', 'volume']
  },
  operator: {
    type: String,
    required: true,
    enum: ['>', '<', '>=', '<=', '==', 'crosses_above', 'crosses_below']
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be number or another indicator
    required: true
  },
  timeframe: {
    type: String,
    default: '1d',
    enum: ['1m', '5m', '15m', '1h', '4h', '1d']
  }
});

const ActionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell', 'hold']
  },
  quantity: {
    type: String,
    required: true,
    enum: ['all', 'half', 'custom']
  },
  customQuantity: {
    type: Number,
    min: 0
  },
  stopLoss: {
    type: Number,
    min: 0,
    max: 100 // Percentage
  },
  takeProfit: {
    type: Number,
    min: 0
  }
});

const RuleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  conditions: [ConditionSchema],
  logicalOperator: {
    type: String,
    default: 'AND',
    enum: ['AND', 'OR']
  },
  action: ActionSchema,
  priority: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const StrategySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 500
  },
  category: {
    type: String,
    enum: ['trend_following', 'mean_reversion', 'momentum', 'breakout', 'custom'],
    default: 'custom'
  },
  rules: [RuleSchema],
  riskManagement: {
    maxPositionSize: {
      type: Number,
      default: 10,
      min: 1,
      max: 100 // Percentage of portfolio
    },
    maxDailyLoss: {
      type: Number,
      default: 5,
      min: 1,
      max: 20 // Percentage
    },
    stopLossEnabled: {
      type: Boolean,
      default: true
    },
    takeProfitEnabled: {
      type: Boolean,
      default: false
    }
  },
  backtestResults: {
    totalReturn: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    winRate: Number,
    totalTrades: Number,
    lastBacktest: Date
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
StrategySchema.index({ userId: 1, createdAt: -1 });
StrategySchema.index({ category: 1, isTemplate: 1 });

export default mongoose.model('Strategy', StrategySchema);