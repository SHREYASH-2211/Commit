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

const EntryRuleSchema = new mongoose.Schema({
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
  action: {
    type: {
      type: String,
      required: true,
      enum: ['buy']
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
  },
  priority: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const ExitRuleSchema = new mongoose.Schema({
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
  action: {
    type: {
      type: String,
      required: true,
      enum: ['sell']
    },
    quantity: {
      type: String,
      required: true,
      enum: ['all', 'half', 'custom']
    },
    customQuantity: {
      type: Number,
      min: 0
    }
  },
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
  rules: [RuleSchema], // Legacy support - will be deprecated
  entryRules: [EntryRuleSchema],
  exitRules: [ExitRuleSchema],
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
  tags: [String],
  // Position tracking
  currentPosition: {
    isOpen: {
      type: Boolean,
      default: false
    },
    entryPrice: {
      type: Number,
      min: 0
    },
    entryTimestamp: Date,
    shares: {
      type: Number,
      min: 0,
      default: 0
    },
    stopLossPrice: {
      type: Number,
      min: 0
    },
    takeProfitPrice: {
      type: Number,
      min: 0
    }
  },
  // Strategy execution settings
  executionSettings: {
    allowMultiplePositions: {
      type: Boolean,
      default: false
    },
    maxConcurrentPositions: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    },
    requireExitBeforeEntry: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
StrategySchema.index({ userId: 1, createdAt: -1 });
StrategySchema.index({ category: 1, isTemplate: 1 });

// Instance methods for position management
StrategySchema.methods.openPosition = function(entryPrice, shares, stopLossPrice, takeProfitPrice) {
  this.currentPosition = {
    isOpen: true,
    entryPrice,
    entryTimestamp: new Date(),
    shares,
    stopLossPrice,
    takeProfitPrice
  };
  return this.save();
};

StrategySchema.methods.closePosition = function() {
  this.currentPosition = {
    isOpen: false,
    entryPrice: 0,
    entryTimestamp: null,
    shares: 0,
    stopLossPrice: 0,
    takeProfitPrice: 0
  };
  return this.save();
};

StrategySchema.methods.updatePosition = function(updates) {
  Object.assign(this.currentPosition, updates);
  return this.save();
};

StrategySchema.methods.canOpenPosition = function() {
  if (!this.executionSettings.allowMultiplePositions && this.currentPosition.isOpen) {
    return false;
  }
  return true;
};

StrategySchema.methods.shouldExitPosition = function(currentPrice) {
  if (!this.currentPosition.isOpen) return false;
  
  // Check stop loss
  if (this.currentPosition.stopLossPrice && currentPrice <= this.currentPosition.stopLossPrice) {
    return { reason: 'stop_loss', price: this.currentPosition.stopLossPrice };
  }
  
  // Check take profit
  if (this.currentPosition.takeProfitPrice && currentPrice >= this.currentPosition.takeProfitPrice) {
    return { reason: 'take_profit', price: this.currentPosition.takeProfitPrice };
  }
  
  return false;
};

export default mongoose.model('Strategy', StrategySchema);